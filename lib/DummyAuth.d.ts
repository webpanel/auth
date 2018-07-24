/// <reference types="react" />
import * as React from 'react';
import { AuthSession } from './AuthSession';
import { AuthFormProps, AuthContentProps, AuthState } from './Auth';
export interface DummyAuthProps {
    username: string;
    password: string;
    form: (props: AuthFormProps) => React.ReactNode;
    content: (props: AuthContentProps) => React.ReactNode;
}
export declare class DummyAuth extends React.Component<DummyAuthProps, AuthState> {
    loggedInElement: JSX.Element | null;
    authSession: AuthSession;
    state: {
        isAuthorizing: boolean;
        authorizationError: undefined;
    };
    componentWillMount(): void;
    handleLogin: (username: string, password: string) => Promise<void>;
    render(): React.ReactNode;
}
