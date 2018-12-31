import { checkPermissions } from 'acl-permissions';

import { AuthSession } from './AuthSession';

export const hasRole = (role: string): boolean => {
  const payload = AuthSession.current().getTokenPayload();
  const roles = payload && payload.user && payload.user.roles;
  if (roles) {
    return roles.indexOf(role) !== -1;
  }
  return false;
};

export const hasAccess = (resource: string, strict = false): boolean => {
  const payload = AuthSession.current().getTokenPayload();
  const permissions = payload && payload.user && payload.user.permissions;
  if (permissions) {
    return checkPermissions(permissions, resource, strict);
  }
  return false;
};
