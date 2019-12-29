import * as React from "react";

import { AuthBaseInputProps, AuthBaseProps } from ".";
import { AuthorizationService, OAuthGrantType } from "./AuthorizationService";

import { AuthSession } from "./AuthSession";
import { observer } from "mobx-react";

export class AuthError extends Error {
  constructor(message: string, public description?: string) {
    super(message);
  }
}

export interface OAuth2AuthProps extends AuthBaseProps {
  type: "oauth";
  grantType: OAuthGrantType;
  tokenUri: string;
  clientId?: string;
  clientSecret?: string;
  audience?: string;
  scope?: string;
  userNameGetter?: (session: AuthSession) => string;
  // authorization_code
  authorizationUri?: string;
  redirectUri?: string;
  logoutUri?: string;
}

export interface OAuth2AuthComponentProps {
  processing: () => React.ReactNode;
  failed: (props: { error: AuthError; logout: () => void }) => React.ReactNode;
}

export interface AuthState {
  isAuthorizing: boolean;
  authorizationError?: AuthError;
}

@observer
export class OAuth2Auth extends React.Component<
  OAuth2AuthProps & AuthBaseInputProps & OAuth2AuthComponentProps,
  AuthState
> {
  loggedInElement: JSX.Element | null = null;
  authSession: AuthSession;

  auth = new AuthorizationService({
    authorizationUri:
      this.props.grantType === "authorization_code"
        ? this.props.authorizationUri
        : undefined,
    tokenUri: this.props.tokenUri,
    redirectUri:
      this.props.grantType === "authorization_code"
        ? this.props.redirectUri
        : undefined,
    logoutUri:
      this.props.grantType === "authorization_code"
        ? this.props.logoutUri
        : undefined,
    grantType: this.props.grantType,
    clientId: this.props.clientId,
    clientSecret: this.props.clientSecret,
    audience: this.props.audience,
    scope: this.props.scope
  });

  state: AuthState = { isAuthorizing: false, authorizationError: undefined };

  componentWillMount() {
    this.validateAttributes();
    this.authSession = AuthSession.current();
    if (!this.authSession.isLogged() && this.props.grantType !== "password") {
      this.authorize();
    }
  }

  private validateAttributes() {
    const { grantType, clientId, clientSecret, tokenUri } = this.props;
    const assertNotEmpty = (value: string | undefined, name: string) => {
      if (typeof value === "string") {
        return;
      }
      throw new Error(
        `attribute ${name} should not be empty for grantType ${grantType}`
      );
    };

    assertNotEmpty(clientId, "clientId");
    assertNotEmpty(clientSecret, "clientSecret");
    assertNotEmpty(tokenUri, "tokenUri");

    if (this.props.grantType === "authorization_code") {
      assertNotEmpty(this.props.authorizationUri, "authorizationUri");
    }
  }

  handleLogin = async (username: string, password: string) => {
    this.setState({ isAuthorizing: true });
    try {
      let response = await this.auth.authorizeWithPassword(username, password);
      this.authSession.update(response);
      this.setState({ isAuthorizing: false });
    } catch (authorizationError) {
      this.setState({ authorizationError, isAuthorizing: false });
    }
  };

  logout = async () => {
    this.authSession.logout();
    await this.auth.logout();
  };

  authorize = async () => {
    this.setState({ isAuthorizing: true });
    try {
      const response = await this.auth.authorize();
      if (response) {
        this.authSession.update(response);
      }
      window.location.replace("/");
      // no need to update state as we redirect to root page ... this.setState({ isAuthorizing: false });
    } catch (authorizationError) {
      this.setState({ authorizationError, isAuthorizing: false });
    }
  };

  render() {
    const { isAuthorizing, authorizationError } = this.state;

    if (
      !isAuthorizing &&
      this.authSession.isLogged() &&
      this.authSession.data
    ) {
      const content = this.props.content || this.props.children;
      return (
        (content &&
          content({
            logout: () => {
              this.logout();
            },
            accessToken: this.authSession.data.access_token,
            userName:
              (this.props.userNameGetter &&
                this.props.userNameGetter(this.authSession)) ||
              this.defaultUsernameGetter(this.authSession)
          })) ||
        "no content"
      );
    } else if (this.props.grantType === "password") {
      return this.props.form({
        authorize: async (username: string, password: string) => {
          await this.handleLogin(username, password);
        },
        isAuthorizing: this.state.isAuthorizing,
        authorizationError: this.state.authorizationError
      });
    } else {
      const { processing, failed } = this.props;
      if (isAuthorizing) {
        return processing ? processing() : "...";
      }
      if (authorizationError) {
        return failed ? (
          failed({ logout: () => this.logout(), error: authorizationError })
        ) : (
          <>
            Failed {authorizationError.message}
            <a href="#" onClick={() => this.logout()}>
              Logout
            </a>
          </>
        );
      }
      return "...";
    }
  }

  private defaultUsernameGetter = (session: AuthSession) => {
    const payload = session.getIdTokenPayload();
    return (payload && (payload.name || payload.email)) || "";
  };
}
