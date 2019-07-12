import * as React from 'react';
import { AuthBaseProps } from '.';
import { AuthSession } from './AuthSession';
import { AuthorizationService } from './AuthorizationService';
export interface AuthProps {
    type: 'oauth';
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
export declare class Auth extends React.Component<AuthBaseProps & AuthProps, AuthState> {
    loggedInElement: JSX.Element | null;
    authSession: AuthSession;
    auth: AuthorizationService;
    state: {
        isAuthorizing: boolean;
        authorizationError: undefined;
    };
    componentWillMount(): void;
    handleLogin: (username: string, password: string) => Promise<void>;
    render(): React.ReactNode;
}
