import { AuthSession } from './AuthSession';

export const hasRole = (role: string): boolean => {
  const payload = AuthSession.current().getTokenPayload();
  const roles = payload && payload.user && payload.user.roles;
  if (roles) {
    return roles.indexOf(role) !== -1;
  }
  return false;
};

export const hasAccess = (resource: string): boolean => {
  const payload = AuthSession.current().getTokenPayload();
  const permissions = payload && payload.user && payload.user.permissions;
  if (permissions) {
    return validatePermissions(permissions, resource);
  }
  return false;
};

const validatePermissions = (
  permissions: string,
  resource: string
): boolean => {
  const _permissions = permissions.split('\n');
  var valid = false;
  for (const permission of _permissions) {
    let parts = permission.split('|');
    if (parts.length <= 1) continue;
    const _rule = parts[0];
    const _resource = parts[1];
    const regepx = new RegExp('^' + _resource.replace(/\*/, '.*') + '$');
    if (regepx.test(resource)) {
      if (_rule == 'deny') {
        return false;
      } else {
        valid = true;
      }
    }
  }
  return valid;
};
