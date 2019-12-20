import * as ClientOAuth2 from "client-oauth2";

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
  audience?: string;
  scope?: string;
}

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
    global.console.log(
      "authorizing",
      this.config.grantType,
      window.location.pathname
    );
    if (grantType === "authorization_code") {
      if (window.location.pathname === "/oauth/callback") {
        const res = await this.getClient().code.getToken(window.location.href);
        // window.location.href = "/";
        return res.data as AuthorizationServiceResponse;
      } else {
        const uri = this.getClient().code.getUri({
          redirectUri,
          query: audience ? { audience: audience } : undefined
        });
        global.console.log("redirecting to", uri);
        window.location.href = uri;
        return new Promise(resolver => setTimeout(resolver, 10000));
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
}
