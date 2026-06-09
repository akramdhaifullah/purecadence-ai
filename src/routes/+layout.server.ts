import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const email = cookies.get('garmin_email');
	const password = cookies.get('garmin_password');
	const isLoggedIn = !!(email && password);

	// If not logged in and trying to access anything other than /login, redirect to /login
	if (!isLoggedIn && url.pathname !== '/login') {
		throw redirect(303, '/login');
	}

	// If logged in and trying to access /login, redirect to / (chat page)
	if (isLoggedIn && url.pathname === '/login') {
		throw redirect(303, '/');
	}

	return {
		isLoggedIn,
		email
	};
};
