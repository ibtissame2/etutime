import { usePage } from './inertia';

const page = usePage();

export function getOrganizationCurrencyString() {
	return page.props?.auth?.user?.current_team?.currency ?? 'EUR';
}
