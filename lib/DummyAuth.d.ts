import * as React from 'react';
import { AuthSession } from './AuthSession';
import { AuthState } from './Auth';
import { AuthBaseProps } from '.';
export interface DummyAuthProps {
    type: 'dummy';
    username: string;
    password: string;
}
export declare class DummyAuth extends React.Component<AuthBaseProps & DummyAuthProps, AuthState> {
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
