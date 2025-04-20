import { usePage } from './inertia';

const page = usePage();

function getCurrentUserId() {
	return page.props.auth.user.id;
}

function getCurrentOrganizationId() {
	return page.props.auth.user.current_team.id;
}

function getCurrentMembershipId() {
	return page.props.auth.user.all_teams.find((team) => team.id === getCurrentOrganizationId())?.membership.id;
}

function getCurrentRole() {
	return page.props.auth.user.all_teams.find((team) => team.id === getCurrentOrganizationId())?.membership.role;
}

export { getCurrentOrganizationId, getCurrentUserId, getCurrentMembershipId, getCurrentRole };
