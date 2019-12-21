import * as React from "react";
import { AuthorizationService, OAuthGrantType } from "./AuthorizationService";
import { AuthBaseProps } from ".";
import { AuthSession } from "./AuthSession";
export interface AuthProps {
    type: "oauth";
    grantType: OAuthGrantType;
    oauthAuthorizationUri?: string;
    oauthTokenUri: string;
    redirectUri?: string;
    logoutUri?: string;
    clientId?: string;
    clientSecret?: string;
    audience?: string;
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
    logout: () => Promise<void>;
    authorize: () => Promise<void>;
    render(): {} | null | undefined;
    private defaultUsernameGetter;
}
