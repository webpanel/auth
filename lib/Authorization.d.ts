export interface AuthorizationConfig {
    authorizeURL: string;
    tokenURL?: string;
}
export declare class Authorization {
    config: AuthorizationConfig;
    constructor(config: AuthorizationConfig);
    authorize(username: string, password: string): Promise<string>;
}
