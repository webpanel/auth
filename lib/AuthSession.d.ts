import { AuthorizationServiceResponse } from "./AuthorizationService";
export interface AccessToken {
    aud?: string;
    exp?: number;
    jti?: string;
    iat?: number;
    iss?: string;
    sub?: string;
    nbf?: number;
    scope?: string;
    user?: {
        [key: string]: any;
        permissions?: string;
        roles?: string[];
    };
}
export interface IdToken {
    aud?: string;
    exp?: number;
    sub?: string;
    email?: string;
    name?: string;
    family_name?: string;
    given_name?: string;
}
export declare class AuthSession {
    static _shared?: AuthSession;
    accessToken: string | null;
    accessTokenPayload?: AccessToken | null;
    idToken?: string | null;
    idTokenPayload?: AccessToken | null;
    data: AuthorizationServiceResponse | null;
    static current(): AuthSession;
    constructor(data?: AuthorizationServiceResponse | null);
    isLogged: () => boolean;
    update: (authResponse: AuthorizationServiceResponse) => void;
    logout: () => void;
    getTokenPayload(): AccessToken | null;
    hasJWTScope(scope: string): boolean;
    getIdTokenPayload(): IdToken | null;
}
