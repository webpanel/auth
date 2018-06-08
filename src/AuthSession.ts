import { observable, autorun } from 'mobx';
import { decode } from 'jsonwebtoken';

const AUTH_SESSION_STORAGE_KEY = 'auth_session';

export class AuthSession {
  static _shared?: AuthSession;

  @observable accessToken: string | null = null;

  static current(): AuthSession {
    if (typeof this._shared === 'undefined') {
      const accessToken = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
      this._shared = new AuthSession(accessToken);
    }
    return this._shared;
  }

  constructor(accessToken: string | null = null) {
    this.accessToken = accessToken;
    autorun(() => {
      if (this.accessToken === null) {
        localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
      } else {
        localStorage.setItem(AUTH_SESSION_STORAGE_KEY, this.accessToken);
      }
    });
  }

  @observable
  isLogged = () => {
    return this.accessToken !== null;
  };

  updateAccessToken = (accessToken: string) => {
    console.log('??', accessToken);
    this.accessToken = accessToken;
  };

  logout = () => {
    this.accessToken = null;
  };

  getTokenPayload(): any {
    if (!this.accessToken) {
      return null;
    }
    return decode(this.accessToken);
  }
}
