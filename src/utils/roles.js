export function filterRoles(roles) {
    return roles.filter(function (role) {
        return role.key !== 'placeholder' && role.key !== 'owner';
    });
}
