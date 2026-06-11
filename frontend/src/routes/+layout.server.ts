import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const email = cookies.get('garmin_email');
	const password = cookies.get('garmin_password');
	const isLoggedIn = !!(email && password);

	// Redirection logic removed since pages were deleted

	return {
		isLoggedIn,
		email
	};
};
