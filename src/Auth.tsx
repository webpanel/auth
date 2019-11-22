import * as React from "react";

import { AuthBaseProps } from ".";
import { AuthSession } from "./AuthSession";
import { AuthorizationService } from "./AuthorizationService";
import { observer } from "mobx-react";

export interface AuthProps {
  type: "oauth";
  oauthTokenURL: string;
  clientId?: string;
  clientSecret?: string;
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
    authorizeURL: this.props.oauthTokenURL,
    clientId: this.props.clientId,
    clientSecret: this.props.clientSecret,
    scope: this.props.scope
  });

  state = { isAuthorizing: false, authorizationError: undefined };

  componentWillMount() {
    this.authSession = AuthSession.current();
  }

  handleLogin = async (username: string, password: string) => {
    this.setState({ isAuthorizing: true });
    try {
      let response = await this.auth.authorize(username, password);
      this.authSession.update(response);
      this.setState({ isAuthorizing: false });
    } catch (authorizationError) {
      this.setState({ authorizationError, isAuthorizing: false });
    }
  };

  render() {
    if (this.authSession.isLogged() && this.authSession.data) {
      const content = this.props.content || this.props.children;
      return content({
        logout: () => {
          this.authSession.logout();
        },
        accessToken: this.authSession.data.access_token,
        userName:
          (this.props.userNameGetter &&
            this.props.userNameGetter(this.authSession)) ||
          this.defaultUsernameGetter(this.authSession)
      });
    } else {
      return this.props.form({
        authorize: async (username: string, password: string) => {
          await this.handleLogin(username, password);
        },
        isAuthorizing: this.state.isAuthorizing,
        authorizationError: this.state.authorizationError
      });
    }
  }

  private defaultUsernameGetter = (session: AuthSession) => {
    const payload = session.getIdTokenPayload();
    return (payload && (payload.name || payload.email)) || "";
  };
}
