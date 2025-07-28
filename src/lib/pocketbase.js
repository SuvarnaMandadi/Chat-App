// place files you want to import through the `$lib` alias in this folder.
import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');


// Restore auth if already logged in
if (typeof localStorage !== 'undefined') {
	const auth = localStorage.getItem('pb_auth');
	if (auth) pb.authStore.loadFromCookie(auth);

	pb.authStore.onChange(() => {
		localStorage.setItem('pb_auth', pb.authStore.exportToCookie());
	});
}