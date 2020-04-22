import { AuthSession } from './AuthSession';
import { PermissionList } from 'acl-permissions';

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
    const acl = new PermissionList(permissions);
    return acl.isAllowed(resource);
  }
  return false;
};
