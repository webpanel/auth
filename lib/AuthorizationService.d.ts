export interface AuthorizationConfig {
    authorizeURL: string;
    tokenURL?: string;
}
export declare class AuthorizationService {
    config: AuthorizationConfig;
    constructor(config: AuthorizationConfig);
    authorize(username: string, password: string): Promise<string>;
}
