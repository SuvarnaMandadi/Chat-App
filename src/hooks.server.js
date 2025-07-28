import PocketBase from 'pocketbase';

export async function handle({ event, resolve }) {
	const pb = new PocketBase('http://127.0.0.1:8090');
	const cookie = event.request.headers.get('cookie') || '';

	pb.authStore.loadFromCookie(cookie);
	event.locals.pb = pb;
	event.locals.user = pb.authStore.model;

	const response = await resolve(event);

	// sync cookie to browser
	response.headers.set(
		'set-cookie',
		pb.authStore.exportToCookie({ httpOnly: false, path: '/', maxAge: 60 * 60 * 24 * 7 })
	);

	return response;
}
