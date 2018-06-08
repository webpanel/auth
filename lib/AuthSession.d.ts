export declare class AuthSession {
    static _shared?: AuthSession;
    accessToken: string | null;
    static current(): AuthSession;
    constructor(accessToken?: string | null);
    isLogged: () => boolean;
    updateAccessToken: (accessToken: string) => void;
    logout: () => void;
    getTokenPayload(): any;
}
