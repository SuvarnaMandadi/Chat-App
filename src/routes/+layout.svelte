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

<nav>
	{#if user && $page.url.pathname !== '/dashboard'}
		<p>Welcome, {user.username}!</p>
		<button on:click={logout}>Logout</button>
	{:else if $page.url.pathname !== '/login'}
		<!-- <a href="/login">Login</a> -->
	{/if}
</nav>

<slot />
