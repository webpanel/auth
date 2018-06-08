import * as React from 'react';
// import { observer } from 'mobx-react';
// import { Subscriber, Broadcast } from 'react-broadcast';

// import {
//   Authorization,
//   Renderer,
//   RendererComponentProps,
//   AuthSession,
//   ContextObserver
// } from '../../../../webana';
import { AuthSession } from './AuthSession';
import { Authorization } from './Authorization';
// import LoginForm from './LoginForm';

interface LoginProps {
  oauthTokenURL: string;
  content: any;
  authSession: AuthSession;
}
interface LoginState {
  isAuthorizing: boolean;
  authorizationError: Error | null;
}

// @observer
export class Login extends React.Component<LoginProps, LoginState> {
  loggedInElement: JSX.Element | null = null;
  auth = new Authorization({
    authorizeURL: this.props.oauthTokenURL
  });

  state = { isAuthorizing: false, authorizationError: null };

  handleLogin = async (username: string, password: string) => {
    this.setState({ isAuthorizing: true });
    try {
      let token = await this.auth.authorize(username, password);
      this.props.authSession.updateAccessToken(token);
    } catch (authorizationError) {
      this.setState({ authorizationError });
    }
    this.setState({ isAuthorizing: false });
  };

  render() {
    if (this.props.authSession.isLogged()) {
      // const { context } = this.props;
      // const authSession = this.props.authSession;
      // const auth = authSession.getTokenPayload();
      // const ctx = { ...context, auth };
      // console.log('login context', ctx, context);
      return 'logged';
      // <Broadcast channel="context" value={ctx}>
      //   <Renderer content={this.props.config.content} />
      // </Broadcast>
    } else {
      return 'login form';
      // <LoginForm
      //   handleLogin={this.handleLogin}
      //   isAuthorizing={this.state.isAuthorizing}
      //   authorizationError={this.state.authorizationError}
      // />
    }
  }
}

// const currentSession = AuthSession.current();
// @observer
// export class Login extends React.Component<LoginProps> {
//   render() {
//     return (
//       <Subscriber channel="context">
//         {ctx => (
//           <LoginComponent
//             {...this.props}
//             authSession={currentSession}
//             context={ctx}
//           />
//         )}
//       </Subscriber>
//     );
//   }
// }
