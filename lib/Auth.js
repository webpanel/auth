var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
import * as React from "react";
import { AuthorizationService } from "./AuthorizationService";
import { AuthSession } from "./AuthSession";
import { observer } from "mobx-react";
var OAuth2Auth = /** @class */ (function (_super) {
    __extends(OAuth2Auth, _super);
    function OAuth2Auth() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.loggedInElement = null;
        _this.auth = new AuthorizationService({
            authorizationUri: _this.props.grantType === "authorization_code"
                ? _this.props.authorizationUri
                : undefined,
            tokenUri: _this.props.tokenUri,
            redirectUri: _this.props.grantType === "authorization_code"
                ? _this.props.redirectUri
                : undefined,
            logoutUri: _this.props.grantType === "authorization_code"
                ? _this.props.logoutUri
                : undefined,
            grantType: _this.props.grantType,
            clientId: _this.props.clientId,
            clientSecret: _this.props.clientSecret,
            audience: _this.props.audience,
            scope: _this.props.scope
        });
        _this.state = { isAuthorizing: false, authorizationError: undefined };
        _this.handleLogin = function (username, password) { return __awaiter(_this, void 0, void 0, function () {
            var response, authorizationError_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setState({ isAuthorizing: true });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.auth.authorizeWithPassword(username, password)];
                    case 2:
                        response = _a.sent();
                        this.authSession.update(response.data);
                        this.setState({ isAuthorizing: false });
                        return [3 /*break*/, 4];
                    case 3:
                        authorizationError_1 = _a.sent();
                        this.setState({ authorizationError: authorizationError_1, isAuthorizing: false });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        _this.logout = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.authSession.logout();
                        return [4 /*yield*/, this.auth.logout()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this.authorize = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, authorizationError_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setState({ isAuthorizing: true });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.auth.authorize()];
                    case 2:
                        response = _a.sent();
                        if (response) {
                            this.authSession.update(response);
                        }
                        window.location.replace("/");
                        return [3 /*break*/, 4];
                    case 3:
                        authorizationError_2 = _a.sent();
                        this.setState({ authorizationError: authorizationError_2, isAuthorizing: false });
                        throw authorizationError_2;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        _this.defaultUsernameGetter = function (session) {
            var payload = session.getIdTokenPayload();
            return (payload && (payload.name || payload.email)) || "";
        };
        return _this;
    }
    OAuth2Auth.prototype.componentWillMount = function () {
        this.validateAttributes();
        this.authSession = AuthSession.current();
        if (!this.authSession.isLogged() && this.props.grantType !== "password") {
            this.authorize();
        }
    };
    OAuth2Auth.prototype.validateAttributes = function () {
        var _a = this.props, grantType = _a.grantType, clientId = _a.clientId, clientSecret = _a.clientSecret, tokenUri = _a.tokenUri;
        var assertNotEmpty = function (value, name) {
            if (typeof value === "string") {
                return;
            }
            throw new Error("attribute " + name + " should not be empty for grantType " + grantType);
        };
        assertNotEmpty(clientId, "clientId");
        assertNotEmpty(clientSecret, "clientSecret");
        assertNotEmpty(tokenUri, "tokenUri");
        if (this.props.grantType === "authorization_code") {
            assertNotEmpty(this.props.authorizationUri, "authorizationUri");
        }
    };
    OAuth2Auth.prototype.render = function () {
        var _this = this;
        var _a = this.state, isAuthorizing = _a.isAuthorizing, authorizationError = _a.authorizationError;
        if (this.authSession.isLogged() && this.authSession.data) {
            var content = this.props.content || this.props.children;
            return ((content &&
                content({
                    logout: function () {
                        _this.logout();
                    },
                    accessToken: this.authSession.data.access_token,
                    userName: (this.props.userNameGetter &&
                        this.props.userNameGetter(this.authSession)) ||
                        this.defaultUsernameGetter(this.authSession)
                })) ||
                "no content");
        }
        else if (this.props.grantType === "password") {
            return this.props.form({
                authorize: function (username, password) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.handleLogin(username, password)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); },
                isAuthorizing: this.state.isAuthorizing,
                authorizationError: this.state.authorizationError
            });
        }
        else {
            var _b = this.props, processing = _b.processing, failed = _b.failed;
            if (isAuthorizing) {
                return processing ? processing() : "...";
            }
            if (authorizationError) {
                return failed ? (failed({ logout: function () { return _this.logout(); } })) : (React.createElement(React.Fragment, null,
                    "Failed ",
                    authorizationError.message,
                    " ",
                    React.createElement("a", { href: "#", onClick: function () { return _this.logout(); } }, "Logout")));
            }
            return "...";
        }
    };
    OAuth2Auth = __decorate([
        observer
    ], OAuth2Auth);
    return OAuth2Auth;
}(React.Component));
export { OAuth2Auth };
//# sourceMappingURL=Auth.js.map