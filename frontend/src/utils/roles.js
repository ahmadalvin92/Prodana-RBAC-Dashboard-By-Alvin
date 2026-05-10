export const ROLES = Object.freeze({
  ADMIN: "Admin",
  EDITOR: "Editor",
  VIEWER: "Viewer",
});

export const permissions = {
  canAccessDashboard: (role) => [ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER].includes(role),
  canReadUsers: (role) => [ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER].includes(role),
  canManageUsers: (role) => [ROLES.ADMIN, ROLES.EDITOR].includes(role),
  canAccessProducts: (role) => role === ROLES.ADMIN,
  canManageProducts: (role) => role === ROLES.ADMIN,
};
