/// <reference types="react" />
import * as React from 'react';
import { AuthSession } from './AuthSession';
import { Authorization } from './Authorization';
export interface LoginProps {
    oauthTokenURL: string;
    content: any;
    authSession: AuthSession;
}
export interface LoginState {
    isAuthorizing: boolean;
    authorizationError: Error | null;
}
export declare class Login extends React.Component<LoginProps, LoginState> {
    loggedInElement: JSX.Element | null;
    auth: Authorization;
    state: {
        isAuthorizing: boolean;
        authorizationError: null;
    };
    handleLogin: (username: string, password: string) => Promise<void>;
    render(): "logged" | "login form";
}
