import * as React from "react";
import { AuthBaseInputProps, AuthBaseProps } from ".";
import { AuthSession } from "./AuthSession";
import { AuthState } from "./Auth";
export interface DummyAuthProps {
    type: "dummy";
    username: string;
    password: string;
}
export declare class DummyAuth extends React.Component<AuthBaseProps & DummyAuthProps & AuthBaseInputProps, AuthState> {
    loggedInElement: JSX.Element | null;
    authSession: AuthSession;
    state: {
        isAuthorizing: boolean;
        authorizationError: undefined;
    };
    componentWillMount(): void;
    handleLogin: (username: string, password: string) => Promise<void>;
    render(): {} | null | undefined;
}
