import * as React from 'react';
import { observer } from 'mobx-react';

import { AuthSession } from './AuthSession';
import { AuthorizationServiceResponse } from './AuthorizationService';

import { AuthFormProps, AuthContentProps, AuthState } from './Auth';

export interface DummyAuthProps {
  username: string;
  password: string;
  form: (props: AuthFormProps) => React.ReactNode;
  content: (props: AuthContentProps) => React.ReactNode;
}

@observer
export class DummyAuth extends React.Component<DummyAuthProps, AuthState> {
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
      return this.props.content({
        logout: () => {
          this.authSession.logout();
        },
        accessToken: this.authSession.data.access_token,
        userName: 'John Doe'
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
