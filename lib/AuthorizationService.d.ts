export interface AuthorizationConfig {
    authorizeURL: string;
    tokenURL?: string;
    clientId?: string;
    clientSecret?: string;
    scope?: string;
}
export declare class AuthorizationService {
    config: AuthorizationConfig;
    constructor(config: AuthorizationConfig);
    getClientAuthHeader(): string | undefined;
    authorize(username: string, password: string): Promise<string>;
}
