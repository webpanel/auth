import * as ClientOAuth2 from "client-oauth2";
import * as qs from "qs";

// import { Request } from "./networking/Request";
// import { RestConnector } from "./networking/RestConnector";

export type OAuthGrantType =
  | "password"
  | "authorization_code"
  | "client_credentials";

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

const delay = <T>(interval: number): Promise<T> =>
  new Promise(resolver => setTimeout(resolver, interval));

export class AuthorizationService {
  config: AuthorizationConfig;
  constructor(config: AuthorizationConfig) {
    this.config = config;
  }

  getClient(): ClientOAuth2 {
    var client = new ClientOAuth2({
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret,
      accessTokenUri: this.config.tokenUri,
      authorizationUri: this.config.authorizationUri,
      redirectUri: this.config.redirectUri,
      scopes: this.config.scope ? this.config.scope.split(" ") : []
    });
    return client;
  }

  public async authorize(): Promise<AuthorizationServiceResponse | null> {
    const { grantType, audience, redirectUri } = this.config;
    if (grantType === "authorization_code") {
      if (window.location.pathname === "/oauth/callback") {
        const res = await this.getClient().code.getToken(window.location.href);
        return res.data as AuthorizationServiceResponse;
      } else {
        const uri = this.getClient().code.getUri({
          redirectUri,
          query: audience ? { audience: audience } : undefined
        });
        window.location.replace(uri);
        return delay(10000);
      }
    }
    return null;
  }

  async authorizeWithPassword(
    username: string,
    password: string
  ): Promise<AuthorizationServiceResponse> {
    const res = await this.getClient().owner.getToken(username, password);
    return res.data as AuthorizationServiceResponse;
  }

  async logout(): Promise<void> {
    const { logoutUri, clientId } = this.config;
    if (logoutUri) {
      const params = { returnTo: window.location.origin, client_id: clientId };
      window.location.replace(logoutUri + "?" + qs.stringify(params));
      return delay(5000);
    }
  }
}
