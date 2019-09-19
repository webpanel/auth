import { autorun, observable } from 'mobx';

import { AuthorizationServiceResponse } from './AuthorizationService';
import { decode } from 'jsonwebtoken';

const AUTH_SESSION_STORAGE_KEY = 'auth_session';

export interface AccessToken {
  aud?: string; // audience
  exp?: number; // expires at
  jti?: string; // token id
  iat?: number; // issued at
  iss?: string; // issuer
  sub?: string; // subject
  nbf?: number; // not before
  scope?: string;
  // deprecated
  user?: {
    [key: string]: any;
    permissions?: string;
    roles?: string[];
  };
}

export interface IdToken {
  aud?: string; // audience
  exp?: number; // expires at
  sub?: string; // token id
  email?: string;
  name?: string;
  family_name?: string;
  given_name?: string;
}

export class AuthSession {
  static _shared?: AuthSession;

  @observable
  accessToken: string | null = null;
  accessTokenPayload?: AccessToken | null;
  @observable
  idToken?: string | null = null;
  idTokenPayload?: AccessToken | null;
  @observable
  data: AuthorizationServiceResponse | null = null;

  static current(): AuthSession {
    if (typeof this._shared === 'undefined') {
      let data = null;
      try {
        const json = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
        data = json && JSON.parse(json);
      } catch (err) {}
      this._shared = new AuthSession(data);
    }
    return this._shared;
  }

  constructor(data: AuthorizationServiceResponse | null = null) {
    if (data) {
      this.data = data;
      this.accessToken = data.access_token;
    }
    autorun(() => {
      if (this.data === null) {
        localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
      } else {
        localStorage.setItem(
          AUTH_SESSION_STORAGE_KEY,
          JSON.stringify(this.data)
        );
      }
    });
  }

  @observable
  isLogged = () => {
    return this.accessToken !== null;
  };

  update = (authResponse: AuthorizationServiceResponse) => {
    this.accessToken = authResponse.access_token;
    this.idToken = authResponse.id_token;
    this.accessTokenPayload = undefined;
    this.data = authResponse;
  };

  logout = () => {
    this.accessToken = null;
    this.idToken = null;
    this.accessTokenPayload = undefined;
    this.data = null;
  };

  getTokenPayload(): AccessToken | null {
    if (typeof this.accessTokenPayload === 'undefined') {
      if (!this.accessToken) {
        return null;
      }
      this.accessTokenPayload = decode(this.accessToken) as AccessToken;
    }
    return this.accessTokenPayload;
  }

  hasJWTScope(scope: string): boolean {
    const payload = this.getTokenPayload();
    const scopes = (payload && payload.scope && payload.scope.split(' ')) || [];
    return scopes.indexOf(scope) !== -1;
  }

  getIdTokenPayload(): IdToken | null {
    if (typeof this.idTokenPayload === 'undefined') {
      if (!this.idToken) {
        return null;
      }
      this.idTokenPayload = decode(this.idToken) as IdToken;
    }
    return this.idTokenPayload;
  }
}
