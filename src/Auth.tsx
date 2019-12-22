import * as React from "react";

import {
  AuthorizationService,
  AuthorizationServiceResponse,
  OAuthGrantType
} from "./AuthorizationService";

import { AuthBaseProps } from ".";
import { AuthSession } from "./AuthSession";
import { observer } from "mobx-react";

export interface AuthProps {
  type: "oauth";
  grantType: OAuthGrantType;
  oauthAuthorizationUri?: string;
  oauthTokenUri: string;
  redirectUri?: string;
  logoutUri?: string;
  clientId?: string;
  clientSecret?: string;
  audience?: string;
  scope?: string;
  userNameGetter?: (session: AuthSession) => string;
}
export interface AuthState {
  isAuthorizing: boolean;
  authorizationError?: Error;
}

@observer
export class Auth extends React.Component<
  AuthBaseProps & AuthProps,
  AuthState
> {
  loggedInElement: JSX.Element | null = null;
  authSession: AuthSession;

  auth = new AuthorizationService({
    authorizationUri: this.props.oauthAuthorizationUri,
    tokenUri: this.props.oauthTokenUri,
    redirectUri: this.props.redirectUri,
    logoutUri: this.props.logoutUri,
    grantType: this.props.grantType,
    clientId: this.props.clientId,
    clientSecret: this.props.clientSecret,
    audience: this.props.audience,
    scope: this.props.scope
  });

  state: AuthState = { isAuthorizing: false, authorizationError: undefined };

  componentWillMount() {
    this.authSession = AuthSession.current();
    if (!this.authSession.isLogged() && this.props.grantType !== "password") {
      this.authorize();
    }
  }

  handleLogin = async (username: string, password: string) => {
    this.setState({ isAuthorizing: true });
    try {
      let response = await this.auth.authorizeWithPassword(username, password);
      this.authSession.update(response.data as AuthorizationServiceResponse);
      this.setState({ isAuthorizing: false });
    } catch (authorizationError) {
      this.setState({ authorizationError, isAuthorizing: false });
    }
  };

  // private authorizeRequest: WrappedPromiseResult<void> | null = null;
  // readAuthorize = () => {
  //   if (this.authorizeRequest === null) {
  //     global.console.log("creating request");
  //     this.authorizeRequest = wrapPromise(this.authorize());
  //   }
  //   global.console.log("reading request");
  //   this.authorizeRequest.read();
  // };
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
      // this.setState({ isAuthorizing: false });
    } catch (authorizationError) {
      this.setState({ authorizationError, isAuthorizing: false });
      throw authorizationError;
    }
  };

  render() {
    const { isAuthorizing, authorizationError } = this.state;
    if (isAuthorizing) {
      return "...";
    }
    if (authorizationError) {
      return (
        <>
          Failed {authorizationError.message}{" "}
          <a href="#" onClick={() => this.logout()}>
            Logout
          </a>
        </>
      );
    }

    if (this.authSession.isLogged() && this.authSession.data) {
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
      return "...";
    }
  }

  private defaultUsernameGetter = (session: AuthSession) => {
    const payload = session.getIdTokenPayload();
    return (payload && (payload.name || payload.email)) || "";
  };
}
