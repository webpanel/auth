import * as React from "react";
import { AuthBaseInputProps, AuthBaseProps } from ".";
import { AuthorizationService, OAuthGrantType } from "./AuthorizationService";
import { AuthSession } from "./AuthSession";
export interface OAuth2AuthProps extends AuthBaseProps {
    type: "oauth";
    grantType: OAuthGrantType;
    tokenUri: string;
    clientId?: string;
    clientSecret?: string;
    audience?: string;
    scope?: string;
    userNameGetter?: (session: AuthSession) => string;
}
export interface OAuth2PasswordProps extends OAuth2AuthProps, AuthBaseInputProps {
    grantType: "password";
}
export interface OAuth2AuthorizationCodeProps extends OAuth2AuthProps {
    grantType: "authorization_code";
    authorizationUri: string;
    redirectUri: string;
    logoutUri: string;
    processing: () => React.ReactNode;
    failed: (props: {
        logout: () => void;
    }) => React.ReactNode;
}
export interface AuthState {
    isAuthorizing: boolean;
    authorizationError?: Error;
}
export declare class OAuth2Auth extends React.Component<OAuth2PasswordProps | OAuth2AuthorizationCodeProps, AuthState> {
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
