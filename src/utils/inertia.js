// import { Head, Link, useForm, usePage, router, route } from '@inertiajs/vue3';

export const usePage = () => {
	return {
		props: {
			availableRoles: [
				{ key: 'admin', name: 'admin' },
				{ key: 'member', name: 'member' },
			],
			timezones: ['Casablanca (GMT+1)'],
			weekdays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
			terms_url: 'https://example.com/photo.jpg', // string | null
			privacy_policy_url: 'https://example.com/photo.jpg', // string | null
			newsletter_consent: true,
			jetstream: {
				canUpdateProfileInformation: true,
				canUpdatePassword: true,
				canManageTwoFactorAuthentication: true,
				hasAccountDeletionFeatures: true,
				hasTermsAndPrivacyPolicyFeature: true,
				canCreateTeams: true,
				hasTeamFeatures: true,
				managesProfilePhotos: true,
				hasEmailVerification: true,
				hasApiFeatures: true,
				flash: {
					token: '',
				},
			},
			flash: {
				message: '',
			},
			auth: {
				user: {
					id: 1,
					name: 'Ibtissame',
					email: 'ibtissame@gmail.com',
					profile_photo_url: 'https://example.com/photo.jpg',
					all_teams: [{ id: 1, name: 'Team A', membership: { id: '1', role: 'Admin' } }],
					current_team: { id: 1, name: 'Team A' },
					two_factor_enabled: true,
					timezone: 'Africa/Casablanca',
					week_start: 'Lundi',
					email_verified_at: null,
				},
			},
		},
	};
};

export const useForm = (schema) => {
	const { method } = schema;
	// _method: 'PUT',
	return {
		put(route, dataObj) {},
		post(route, dataObj) {},
		delete(route, dataArrayOrObj) {},
		reset() {},
		clearErrors() {},
		transform(callback) {
			return {
				post(route, dataObj) {},
			};
		},
		errors: {},
		recentlySuccessful: true,
		processing: false,
		...schema,
	};
};

export const router = {
	reload: function (options) {},
	post: function (name) {
		route.setCurrent(name);
	},
};

export const Head = () => {};

const route = function (...parts) {
	return parts.join('/');
};
route.currentRoute = undefined;
route.current = function (name) {
	return route.currentRoute === name;
};
route.setCurrent = function (name) {
	return (route.currentRoute = name);
};
export { route };
