import * as React from "react";
import { AuthBaseInputProps, AuthBaseProps } from ".";
import { AuthorizationService, OAuthGrantType } from "./AuthorizationService";
import { AuthSession } from "./AuthSession";
export declare class AuthError extends Error {
    description?: string | undefined;
    constructor(message: string, description?: string | undefined);
}
export interface OAuth2AuthProps extends AuthBaseProps {
    type: "oauth";
    grantType: OAuthGrantType;
    tokenUri: string;
    clientId?: string;
    clientSecret?: string;
    audience?: string;
    scope?: string;
    userNameGetter?: (session: AuthSession) => string;
    authorizationUri?: string;
    redirectUri?: string;
    logoutUri?: string;
    processing?: () => React.ReactNode;
    failed?: (props: {
        error: AuthError;
        logout: () => void;
    }) => React.ReactNode;
}
export interface AuthState {
    isAuthorizing: boolean;
    authorizationError?: AuthError;
}
export declare class OAuth2Auth extends React.Component<OAuth2AuthProps & AuthBaseInputProps, AuthState> {
    loggedInElement: JSX.Element | null;
    authSession: AuthSession;
    auth: AuthorizationService;
    state: AuthState;
    componentWillMount(): void;
    private validateAttributes;
    handleLogin: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    authorize: () => Promise<void>;
    render(): {} | null | undefined;
    private defaultUsernameGetter;
}
