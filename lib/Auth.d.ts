import * as React from 'react';
import { AuthSession } from './AuthSession';
import { AuthorizationService } from './AuthorizationService';
import { AuthBaseProps } from '.';
export interface AuthProps {
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
