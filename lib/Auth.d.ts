/// <reference types="react" />
import * as React from 'react';
import { AuthSession } from './AuthSession';
import { AuthorizationService } from './AuthorizationService';
export declare type AuthFormProps = {
    authorize: (username: string, password: string) => Promise<void>;
    isAuthorizing: boolean;
    authorizationError?: Error;
};
export declare type AuthContentProps = {
    logout: () => void;
    accessToken: string;
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
export declare class Auth extends React.Component<AuthProps, AuthState> {
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
