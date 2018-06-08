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
};

export interface AuthProps {
  oauthTokenURL: string;
  form: (props: AuthFormProps) => React.ReactNode;
  content: (props: AuthContentProps) => React.ReactNode;
}
export interface AuthState {
  isAuthorizing: boolean;
  authorizationError: Error | null;
}

@observer
export class Auth extends React.Component<AuthProps, AuthState> {
  loggedInElement: JSX.Element | null = null;
  authSession: AuthSession;

  auth = new AuthorizationService({
    authorizeURL: this.props.oauthTokenURL
  });

  state = { isAuthorizing: false, authorizationError: null };

  componentWillMount() {
    this.authSession = AuthSession.current();
  }

  handleLogin = async (username: string, password: string) => {
    this.setState({ isAuthorizing: true });
    try {
      let token = await this.auth.authorize(username, password);
      this.authSession.updateAccessToken(token);
    } catch (authorizationError) {
      this.setState({ authorizationError });
    }
    this.setState({ isAuthorizing: false });
  };

  render() {
    if (this.authSession.isLogged()) {
      return this.props.content({
        logout: () => {
          this.authSession.logout();
        }
      });
    } else {
      return this.props.form({
        authorize: async (username: string, password: string) => {
          await this.handleLogin(username, password);
        },
        isAuthorizing: this.state.isAuthorizing
      });
    }
  }
}
