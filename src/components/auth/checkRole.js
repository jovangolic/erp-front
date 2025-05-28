

export const hasRole = (user, allowedRoles = []) => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => allowedRoles.includes(role));
};