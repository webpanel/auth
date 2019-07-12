import * as React from 'react';

import { AuthBaseProps } from '.';
import { AuthSession } from './AuthSession';
import { AuthState } from './Auth';
import { observer } from 'mobx-react';

export interface DummyAuthProps {
  type: 'dummy';
  username: string;
  password: string;
}

@observer
export class DummyAuth extends React.Component<
  AuthBaseProps & DummyAuthProps,
  AuthState
> {
  loggedInElement: JSX.Element | null = null;
  authSession: AuthSession;

  state = { isAuthorizing: false, authorizationError: undefined };

  componentWillMount() {
    this.authSession = AuthSession.current();
  }

  handleLogin = async (username: string, password: string) => {
    try {
      if (
        username !== this.props.username ||
        password !== this.props.password
      ) {
        throw new Error('Invalid credentials');
      }

      let response = {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      };
      this.authSession.update(response);
    } catch (authorizationError) {
      this.setState({ authorizationError });
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
        userName: this.props.username
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
