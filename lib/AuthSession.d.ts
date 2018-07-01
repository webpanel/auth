import { AuthorizationServiceResponse } from './AuthorizationService';
export declare class AuthSession {
    static _shared?: AuthSession;
    accessToken: string | null;
    data: AuthorizationServiceResponse | null;
    static current(): AuthSession;
    constructor(data?: AuthorizationServiceResponse | null);
    isLogged: () => boolean;
    update: (authResponse: AuthorizationServiceResponse) => void;
    logout: () => void;
    getTokenPayload(): any;
}
