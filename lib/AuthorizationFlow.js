import * as ClientOAuth2 from "client-oauth2";
var AuthorizationPasswordFlow = /** @class */ (function () {
    function AuthorizationPasswordFlow(config) {
        this.config = config;
    }
    AuthorizationPasswordFlow.prototype.getClient = function () {
        var client = new ClientOAuth2({
            clientId: this.config.clientId,
            clientSecret: this.config.clientSecret,
            accessTokenUri: this.config.tokenUri,
            scopes: this.config.scope ? this.config.scope.split(" ") : []
        });
        return client;
    };
    return AuthorizationPasswordFlow;
}());
export { AuthorizationPasswordFlow };
// export class AuthorizationFlow {
//   config: AuthorizationFlowConfig;
//   constructor(config: AuthorizationFlowConfig) {
//     this.config = config;
//   }
//   getClient(): ClientOAuth2 {
//     var client = new ClientOAuth2({
//       clientId: this.config.clientId,
//       clientSecret: this.config.clientSecret,
//       accessTokenUri: this.config.tokenUri,
//       authorizationUri: this.config.authorizationUri,
//       redirectUri: this.config.redirectUri,
//       scopes: this.config.scope ? this.config.scope.split(" ") : []
//     });
//     return client;
//   }
//   public async authorize(): Promise<AuthorizationServiceResponse | null> {
//     const { grantType, audience, redirectUri } = this.config;
//     if (grantType === "authorization_code") {
//       if (window.location.pathname === "/oauth/callback") {
//         return this.handleCallback();
//       } else {
//         const uri = this.getClient().code.getUri({
//           redirectUri,
//           query: audience ? { audience: audience } : undefined
//         });
//         window.location.replace(uri);
//         return delay(10000);
//       }
//     }
//     return null;
//   }
//   async authorizeWithPassword(
//     username: string,
//     password: string
//   ): Promise<AuthorizationServiceResponse> {
//     const res = await this.getClient().owner.getToken(username, password);
//     return res.data as AuthorizationServiceResponse;
//   }
//   async handleCallback(): Promise<AuthorizationServiceResponse | null> {
//     if (window.location.search) {
//       const querystring = qs.parse(window.location.search.substr(1));
//       if (querystring.error || querystring.error_description) {
//         throw new Error(querystring.error_description || querystring.error);
//       }
//     }
//     const res = await this.getClient().code.getToken(window.location.href);
//     return res.data as AuthorizationServiceResponse;
//   }
//   async logout(): Promise<void> {
//     const { logoutUri, clientId } = this.config;
//     if (logoutUri) {
//       const params = { returnTo: window.location.origin, client_id: clientId };
//       window.location.replace(logoutUri + "?" + qs.stringify(params));
//       return delay(5000);
//     }
//   }
// }
//# sourceMappingURL=AuthorizationFlow.js.map