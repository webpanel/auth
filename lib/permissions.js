import { AuthSession } from './AuthSession';
import { PermissionList } from 'acl-permissions';
export var hasRole = function (role) {
    var payload = AuthSession.current().getTokenPayload();
    var roles = payload && payload.user && payload.user.roles;
    if (roles) {
        return roles.indexOf(role) !== -1;
    }
    return false;
};
export var hasAccess = function (resource) {
    var payload = AuthSession.current().getTokenPayload();
    var permissions = payload && payload.user && payload.user.permissions;
    if (permissions) {
        var acl = new PermissionList(permissions);
        return acl.isAllowed(resource);
    }
    return false;
};
//# sourceMappingURL=permissions.js.map