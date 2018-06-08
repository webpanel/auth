import { Request } from './networking/Request';
import { RestConnector } from './networking/RestConnector';

export interface AuthorizationConfig {
  authorizeURL: string;
  tokenURL?: string;
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
      str.push(
        v !== null && typeof v === 'object'
          ? serialize(v, k)
          : encodeURIComponent(k) + '=' + encodeURIComponent(v)
      );
    }
  }
  return str.join('&');
};

export class Authorization {
  config: AuthorizationConfig;
  constructor(config: AuthorizationConfig) {
    this.config = config;
  }

  async authorize(username: string, password: string): Promise<string> {
    let connector = new RestConnector();

    let req = new Request({ url: this.config.authorizeURL });

    req.headers['content-type'] =
      'application/x-www-form-urlencoded;charset=utf-8';

    let config = {
      grantType: 'password',
      clientId: 'blah',
      clientSecret: 'foo',
      scope: 'account'
    };

    let data = {
      username: username,
      password: password,
      grant_type: config.grantType,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      scope: config.scope
    };
    req.data = serialize(data);

    let res = await connector.send(req, 'POST');
    let json = await res.json();
    return json.access_token;
  }
}
