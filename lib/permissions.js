import { AuthSession } from './AuthSession';
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
        return validatePermissions(permissions, resource);
    }
    return false;
};
var validatePermissions = function (permissions, resource) {
    var _permissions = permissions.split('\n');
    var valid = false;
    for (var _i = 0, _permissions_1 = _permissions; _i < _permissions_1.length; _i++) {
        var permission = _permissions_1[_i];
        var parts = permission.split('|');
        if (parts.length <= 1)
            continue;
        var _rule = parts[0];
        var _resource = parts[1];
        var regepx = new RegExp('^' + _resource.replace(/\*/, '.*') + '$');
        if (regepx.test(resource)) {
            if (_rule == 'deny') {
                return false;
            }
            else {
                valid = true;
            }
        }
    }
    return valid;
};
//# sourceMappingURL=permissions.js.map