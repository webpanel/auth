var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as ClientOAuth2 from "client-oauth2";
import * as URL from "url-parse";
import * as qs from "qs";
import { AuthError } from "./Auth";
var delay = function (interval) {
    return new Promise(function (resolver) { return setTimeout(resolver, interval); });
};
var AuthorizationService = /** @class */ (function () {
    function AuthorizationService(config) {
        this.config = config;
    }
    AuthorizationService.prototype.getClient = function () {
        var client = new ClientOAuth2({
            clientId: this.config.clientId,
            clientSecret: this.config.clientSecret,
            accessTokenUri: this.config.tokenUri,
            authorizationUri: this.config.authorizationUri,
            redirectUri: this.getRedirectUri(),
            scopes: this.config.scope ? this.config.scope.split(" ") : []
        });
        return client;
    };
    AuthorizationService.prototype.authorize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, grantType, audience, uri;
            return __generator(this, function (_b) {
                _a = this.config, grantType = _a.grantType, audience = _a.audience;
                if (grantType === "authorization_code") {
                    if (this.isRedirectUri(window.location)) {
                        return [2 /*return*/, this.handleCallback()];
                    }
                    else {
                        uri = this.getClient().code.getUri({
                            redirectUri: this.getRedirectUri(),
                            query: audience ? { audience: audience } : undefined
                        });
                        window.location.replace(uri);
                        return [2 /*return*/, delay(10000)];
                    }
                }
                return [2 /*return*/, null];
            });
        });
    };
    AuthorizationService.prototype.authorizeWithPassword = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getClient().owner.getToken(username, password)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    AuthorizationService.prototype.handleCallback = function () {
        return __awaiter(this, void 0, void 0, function () {
            var querystring, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (window.location.search) {
                            querystring = qs.parse(window.location.search.substr(1));
                            if (querystring.error) {
                                throw new AuthError(querystring.error, querystring.error_description);
                            }
                        }
                        return [4 /*yield*/, this.getClient().code.getToken(window.location.href)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    AuthorizationService.prototype.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            var logoutUri;
            return __generator(this, function (_a) {
                logoutUri = this.getLogoutUri();
                if (logoutUri) {
                    window.location.replace(logoutUri);
                    return [2 /*return*/, delay(5000)];
                }
                return [2 /*return*/];
            });
        });
    };
    AuthorizationService.prototype.getRedirectUri = function () {
        var redirectUri = this.config.redirectUri;
        return redirectUri || window.location.origin + "/oauth/callback";
    };
    AuthorizationService.prototype.getLogoutUri = function () {
        var _a = this.config, logoutUri = _a.logoutUri, clientId = _a.clientId;
        if (logoutUri) {
            var parsedUrl = new URL(logoutUri, true);
            if (!parsedUrl.query.client_id) {
                parsedUrl.query.client_id = clientId;
                parsedUrl.query.returnTo = window.location.origin;
            }
            return parsedUrl.toString();
        }
        return null;
    };
    AuthorizationService.prototype.isRedirectUri = function (loc) {
        return window.location.pathname == "/oauth/callback";
    };
    return AuthorizationService;
}());
export { AuthorizationService };
//# sourceMappingURL=AuthorizationService.js.map