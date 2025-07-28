import PocketBase from 'pocketbase';

export async function handle({ event, resolve }) {
	const pb = new PocketBase('https://pocketbase-deploy-kkjz.onrender.com'); // ✅ LIVE URL

	const cookie = event.request.headers.get('cookie') || '';
	pb.authStore.loadFromCookie(cookie);

	event.locals.pb = pb;
	event.locals.user = pb.authStore.model;

	const response = await resolve(event);

	response.headers.set(
		'set-cookie',
		pb.authStore.exportToCookie({ httpOnly: false, path: '/', maxAge: 60 * 60 * 24 * 7 })
	);

	return response;
}
