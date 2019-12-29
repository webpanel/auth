import * as ClientOAuth2 from "client-oauth2";
export declare type OAuthGrantType = "password" | "authorization_code";
export interface AuthorizationServiceResponse {
    [key: string]: any;
    access_token: string;
    refresh_token?: string;
    id_token?: string;
}
export interface AuthorizationConfig {
    authorizationUri?: string;
    tokenUri: string;
    grantType: OAuthGrantType;
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
    logoutUri?: string;
    audience?: string;
    scope?: string;
}
export declare class AuthorizationService {
    config: AuthorizationConfig;
    constructor(config: AuthorizationConfig);
    getClient(): ClientOAuth2;
    authorize(): Promise<AuthorizationServiceResponse | null>;
    authorizeWithPassword(username: string, password: string): Promise<AuthorizationServiceResponse>;
    handleCallback(): Promise<AuthorizationServiceResponse | null>;
    logout(): Promise<void>;
    private getRedirectUri;
    private getLogoutUri;
    private isRedirectUri;
}
