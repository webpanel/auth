var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observable, autorun } from 'mobx';
import { decode } from 'jsonwebtoken';
var AUTH_SESSION_STORAGE_KEY = 'auth_session';
var AuthSession = /** @class */ (function () {
    function AuthSession(accessToken) {
        if (accessToken === void 0) { accessToken = null; }
        var _this = this;
        this.accessToken = null;
        this.isLogged = function () {
            return _this.accessToken !== null;
        };
        this.updateAccessToken = function (accessToken) {
            console.log('??', accessToken);
            _this.accessToken = accessToken;
        };
        this.logout = function () {
            _this.accessToken = null;
        };
        this.accessToken = accessToken;
        autorun(function () {
            if (_this.accessToken === null) {
                localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
            }
            else {
                localStorage.setItem(AUTH_SESSION_STORAGE_KEY, _this.accessToken);
            }
        });
    }
    AuthSession.current = function () {
        if (typeof this._shared === 'undefined') {
            var accessToken = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
            this._shared = new AuthSession(accessToken);
        }
        return this._shared;
    };
    AuthSession.prototype.getTokenPayload = function () {
        if (!this.accessToken) {
            return null;
        }
        return decode(this.accessToken);
    };
    __decorate([
        observable
    ], AuthSession.prototype, "accessToken", void 0);
    __decorate([
        observable
    ], AuthSession.prototype, "isLogged", void 0);
    return AuthSession;
}());
export { AuthSession };
//# sourceMappingURL=AuthSession.js.map