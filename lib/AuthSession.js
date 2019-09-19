var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { autorun, observable } from 'mobx';
import { decode } from 'jsonwebtoken';
var AUTH_SESSION_STORAGE_KEY = 'auth_session';
var AuthSession = /** @class */ (function () {
    function AuthSession(data) {
        var _this = this;
        if (data === void 0) { data = null; }
        this.accessToken = null;
        this.data = null;
        this.isLogged = function () {
            return _this.accessToken !== null;
        };
        this.update = function (authResponse) {
            _this.accessToken = authResponse.access_token;
            _this.data = authResponse;
        };
        this.logout = function () {
            _this.accessToken = null;
            _this.data = null;
        };
        if (data) {
            this.data = data;
            this.accessToken = data.access_token;
        }
        autorun(function () {
            if (_this.data === null) {
                localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
            }
            else {
                localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(_this.data));
            }
        });
    }
    AuthSession.current = function () {
        if (typeof this._shared === 'undefined') {
            var data = null;
            try {
                var json = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
                data = json && JSON.parse(json);
            }
            catch (err) { }
            this._shared = new AuthSession(data);
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
    ], AuthSession.prototype, "data", void 0);
    __decorate([
        observable
    ], AuthSession.prototype, "isLogged", void 0);
    return AuthSession;
}());
export { AuthSession };
//# sourceMappingURL=AuthSession.js.map