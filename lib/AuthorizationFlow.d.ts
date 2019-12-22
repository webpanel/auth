import * as ClientOAuth2 from "client-oauth2";
import { AuthorizationServiceResponse } from "./AuthorizationService";
export interface AuthorizationFlowResponse {
    [key: string]: any;
    access_token: string;
    refresh_token?: string;
    id_token?: string;
}
export interface AuthorizationFlowConfig {
    tokenUri: string;
    clientId?: string;
    clientSecret?: string;
    audience?: string;
    scope?: string;
}
interface AuthorizationFlow {
    getClient(): ClientOAuth2;
    authorize(): Promise<AuthorizationServiceResponse | null>;
}
export declare class AuthorizationPasswordFlow implements AuthorizationFlow {
    private config;
    constructor(config: AuthorizationFlowConfig);
    getClient(): ClientOAuth2;
}
export {};
