import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const email = cookies.get('garmin_email');
	const password = cookies.get('garmin_password');
	const isLoggedIn = !!(email && password);

	// Allow public access to the landing page `/` and the login page `/login`
	if (!isLoggedIn && url.pathname !== '/' && url.pathname !== '/login') {
		throw redirect(303, '/login');
	}

	// If logged in and trying to access /login, redirect to /chat
	if (isLoggedIn && url.pathname === '/login') {
		throw redirect(303, '/chat');
	}

	return {
		isLoggedIn,
		email
	};
};
