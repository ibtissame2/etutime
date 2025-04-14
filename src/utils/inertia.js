export const usePage = () => {
	return {
		props: {
			jetstream: {
				canCreateTeams: true,
				hasTeamFeatures: true,
				managesProfilePhotos: true,
				hasApiFeatures: true,
				flash: {
					bannerStyle: '',
					banner: '',
				},
			},
			auth: {
				user: {
					id: '1',
					name: 'Ibtissame',
					profile_photo_url: 'https://example.com/photo.jpg',
					all_teams: [],
					current_team_id: '1',
					current_team: {
						id: 1,
						name: 'Team A',
						currency: 'MAD',
					},
				},
				permissions: [
					'organizations:update',
					'projects:view',
					'projects:create',
					'projects:update',
					'projects:delete',
					'project-members:view',
					'tasks:create',
					'tasks:update',
					'tasks:delete',
					'clients:create',
					'clients:update',
					'clients:delete',
					'clients:view',
					'members:view',
					'members:update',
					'members:delete',
					'members:merge-into',
					'members:make-placeholder',
					'members:invite-placeholder',
					'invitations:create',
					'tags:view',
					'tags:create',
					'tags:delete',
					'billing',
					'reports:view',
					'reports:update',
					'reports:delete',
					'time-entries:view:all',
				],
			},
			has_billing_extension: true,
			billing: {
				has_trial: true,
				trial_until: '2025-06-26',
				is_blocked: false,
				has_subscription: true,
			},
		},
	};
};

const route = function (...parts) {
	return parts.join('/');
};
route.current = undefined;
route.isCurrent = function (name) {
	return route.current === name;
};
route.setCurrent = function (name) {
	return (route.current = name);
};

const router = {
	reload: function (options) {},
	post: function (name) {
		// redirect to the route
		route.setCurrent(name);
	},
};

export { route, router };
