<script>
	import '../app.css';
	import { pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;
	let user = data.user;

	pb.authStore.onChange(() => {
		user = pb.authStore.model;
	});

	function logout() {
		pb.authStore.clear();
		localStorage.removeItem('pb_auth');

		document.cookie = 'pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

		goto('/login');
	}
</script>

<slot />
