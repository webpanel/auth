import * as React from 'react';
import { observer } from 'mobx-react';

import { AuthSession } from './AuthSession';
import { AuthorizationService } from './AuthorizationService';

export type AuthFormProps = {
  authorize: (username: string, password: string) => Promise<void>;
  isAuthorizing: boolean;
  authorizationError?: Error;
};

export type AuthContentProps = {
  logout: () => void;
  userName?: string;
};

export interface AuthProps {
  oauthTokenURL: string;
  clientId?: string;
  clientSecret?: string;
  scope?: string;
  form: (props: AuthFormProps) => React.ReactNode;
  content: (props: AuthContentProps) => React.ReactNode;
  userNameGetter?: (session: AuthSession) => string;
}
export interface AuthState {
  isAuthorizing: boolean;
  authorizationError?: Error;
}

@observer
export class Auth extends React.Component<AuthProps, AuthState> {
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
      return this.props.content({
        logout: () => {
          this.authSession.logout();
        },
        userName:
          this.props.userNameGetter &&
          this.props.userNameGetter(this.authSession)
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
}
