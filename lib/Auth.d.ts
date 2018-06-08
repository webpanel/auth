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
export declare class Auth extends React.Component<AuthProps, AuthState> {
    loggedInElement: JSX.Element | null;
    authSession: AuthSession;
    auth: AuthorizationService;
    state: {
        isAuthorizing: boolean;
        authorizationError: null;
    };
    componentWillMount(): void;
    handleLogin: (username: string, password: string) => Promise<void>;
    render(): React.ReactNode;
}