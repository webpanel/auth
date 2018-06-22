import { Request } from './networking/Request';
import { RestConnector } from './networking/RestConnector';

export interface AuthorizationConfig {
  authorizeURL: string;
  tokenURL?: string;
  clientId?: string;
  clientSecret?: string;
  scope?: string;
}

const serialize = (
  obj: { [key: string]: any },
  prefix: string = ''
): string => {
  var str = [],
    p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + '[' + p + ']' : p,
        v = obj[p];
      if (typeof v !== 'undefined') {
        str.push(
          v !== null && typeof v === 'object'
            ? serialize(v, k)
            : encodeURIComponent(k) + '=' + encodeURIComponent(v)
        );
      }
    }
  }
  return str.join('&');
};

export class AuthorizationService {
  config: AuthorizationConfig;
  constructor(config: AuthorizationConfig) {
    this.config = config;
  }

  getClientAuthHeader(): string | undefined {
    if (this.config.clientId && this.config.clientSecret) {
      const basicAuth = btoa(
        `${this.config.clientId}:${this.config.clientSecret}`
      );
      return `Basic ${basicAuth}`;
    }
    return undefined;
  }

  async authorize(username: string, password: string): Promise<string> {
    let connector = new RestConnector();

    let req = new Request({ url: this.config.authorizeURL });

    const clientAuth = this.getClientAuthHeader();
    if (clientAuth) {
      req.headers['authorization'] = clientAuth;
    }

    req.headers['content-type'] =
      'application/x-www-form-urlencoded;charset=utf-8';

    let config = {
      grantType: 'password',
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret,
      scope: this.config.scope
    };

    let data = {
      username: username,
      password: password,
      grant_type: config.grantType,
      scope: config.scope
    };
    req.data = serialize(data);

    let res = await connector.send(req, 'POST');
    let json = await res.json();
    return json.access_token;
  }
}
