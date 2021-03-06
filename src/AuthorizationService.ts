import * as ClientOAuth2 from "client-oauth2";
import * as URL from "url-parse";
import * as qs from "qs";

import { AuthError } from "./Auth";

// import { Request } from "./networking/Request";
// import { RestConnector } from "./networking/RestConnector";

export type OAuthGrantType = "password" | "authorization_code";

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
      redirectUri: this.getRedirectUri(),
      scopes: this.config.scope ? this.config.scope.split(" ") : []
    });
    return client;
  }

  public async authorize(): Promise<AuthorizationServiceResponse | null> {
    const { grantType, audience } = this.config;

    if (grantType === "authorization_code") {
      if (this.isRedirectUri(window.location)) {
        return this.handleCallback();
      } else {
        const uri = this.getClient().code.getUri({
          redirectUri: this.getRedirectUri(),
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

  async handleCallback(): Promise<AuthorizationServiceResponse | null> {
    if (window.location.search) {
      const querystring = qs.parse(window.location.search.substr(1));
      if (querystring.error) {
        throw new AuthError(querystring.error, querystring.error_description);
      }
    }

    const res = await this.getClient().code.getToken(window.location.href);
    return res.data as AuthorizationServiceResponse;
  }

  async logout(): Promise<void> {
    const logoutUri = this.getLogoutUri();
    if (logoutUri) {
      window.location.replace(logoutUri);
      return delay(5000);
    }
  }

  private getRedirectUri(): string {
    const { redirectUri } = this.config;
    return redirectUri || `${window.location.origin}/oauth/callback`;
  }
  private getLogoutUri(): string | null {
    const { logoutUri, clientId } = this.config;
    if (logoutUri) {
      const parsedUrl = new URL(logoutUri, true);
      if (!parsedUrl.query.client_id) {
        parsedUrl.query.client_id = clientId;
        parsedUrl.query.returnTo = window.location.origin;
      }
      return parsedUrl.toString();
    }
    return null;
  }
  private isRedirectUri(loc: Location): boolean {
    return window.location.pathname == "/oauth/callback";
  }
}
