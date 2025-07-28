import PocketBase from 'pocketbase';

export const pb = new PocketBase('https://pocketbase-deploy-kkjz.onrender.com');

if (typeof localStorage !== 'undefined') {
	const auth = localStorage.getItem('pb_auth');
	if (auth) pb.authStore.loadFromCookie(auth);

	pb.authStore.onChange(() => {
		localStorage.setItem('pb_auth', pb.authStore.exportToCookie());
	});
}