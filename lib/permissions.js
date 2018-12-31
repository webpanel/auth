import { checkPermissions } from 'acl-permissions';
import { AuthSession } from './AuthSession';
export var hasRole = function (role) {
    var payload = AuthSession.current().getTokenPayload();
    var roles = payload && payload.user && payload.user.roles;
    if (roles) {
        return roles.indexOf(role) !== -1;
    }
    return false;
};
export var hasAccess = function (resource, strict) {
    if (strict === void 0) { strict = false; }
    var payload = AuthSession.current().getTokenPayload();
    var permissions = payload && payload.user && payload.user.permissions;
    if (permissions) {
        return checkPermissions(permissions, resource, strict);
    }
    return false;
};
//# sourceMappingURL=permissions.js.map