import { observable, autorun } from 'mobx';
import { decode } from 'jsonwebtoken';
import { AuthorizationServiceResponse } from './AuthorizationService';

const AUTH_SESSION_STORAGE_KEY = 'auth_session';

export class AuthSession {
  static _shared?: AuthSession;

  @observable accessToken: string | null = null;
  @observable data: AuthorizationServiceResponse | null = null;

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
    console.log('??', this.accessToken, this.data);
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
    this.data = authResponse;
    console.log('!!', this.accessToken, this.data);
  };

  logout = () => {
    this.accessToken = null;
    this.data = null;
  };

  getTokenPayload(): any {
    if (!this.accessToken) {
      return null;
    }
    return decode(this.accessToken);
  }
}
