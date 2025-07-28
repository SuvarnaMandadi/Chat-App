import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	if (url.pathname.startsWith('/dashboard') && !locals.user) {
		throw redirect(302, '/login');
	}

	return {
		user: locals.user
	};
};
