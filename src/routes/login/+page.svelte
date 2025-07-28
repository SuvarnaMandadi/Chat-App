<script>
	import { pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let email = '';
	let password = '';
	let error = '';
	let success = '';
	let loading = false;

	onMount(() => {
		if (pb.authStore.isValid) {
			goto('/dashboard');
		}
	});

	function extractLoginError(err) {
		if (err?.response?.data?.email) return 'Invalid email address.';
		if (err?.response?.data?.password) return 'Incorrect password.';
		if (err?.status === 400) return 'Invalid email or password.';
		return err?.message || 'Login failed.';
	}

	async function login() {
		error = '';
		success = '';
		loading = true;
		try {
			await pb.collection('users').authWithPassword(email, password);
			document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
			goto('/dashboard');
		} catch (err) {
			console.error(err);
			error = extractLoginError(err);
		} finally {
			loading = false;
		}
	}

	async function forgotPassword() {
		error = '';
		success = '';
		if (!email) {
			error = 'Enter your email before resetting password.';
			return;
		}
		try {
			await pb.collection('users').requestPasswordReset(email);
			success = 'Password reset email sent.';
		} catch (err) {
			error = err?.message || 'Reset failed.';
		}
	}
</script>

<div class="login-container">
	<div class="login-box">
		<img src="/Icon.png" alt="User Icon" class="icon" />

		{#if error}
			<p class="error">{error}</p>
		{/if}
		{#if success}
			<p class="success">{success}</p>
		{/if}

		<form on:submit|preventDefault={login} class="form">
			<input type="email" bind:value={email} placeholder="Email" required />
			<input type="password" bind:value={password} placeholder="Password" required />
			<button type="submit" disabled={loading}>
				{#if loading}Logging in...{:else}Login{/if}
			</button>
		</form>

		<p class="forgot-text">
			<a href="#" on:click|preventDefault={forgotPassword}>Forgot Password?</a>
		</p>

		<p class="register-text">
			Don't have an account? <a href="/register">Register here</a>
		</p>
	</div>
</div>

<style>
	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 1rem;
		background-image: url('/bg.jpg');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		font-family: Arial, Helvetica, sans-serif;
		box-sizing: border-box;
	}

	.login-box {
		background: rgba(255, 255, 255, 0.25);
		backdrop-filter: blur(14px);
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 380px;
		color: #222;
		text-align: center;
		box-sizing: border-box;
	}

	.icon {
		width: 100px;
		height: 100px;
		margin: 0 auto 1.5rem;
		display: block;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	input {
		padding: 0.75rem;
		border-radius: 0.5rem;
		border: 1px solid #ccc;
		font-size: 1rem;
	}

	button {
		background-color: #007bff;
		color: white;
		font-weight: bold;
		padding: 0.75rem;
		border-radius: 0.5rem;
		border: none;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	button:hover {
		background-color: #0056b3;
	}

	.error {
		color: #d8000c;
		margin-bottom: 1rem;
		font-weight: 600;
	}

	.success {
		color: #1e7e34;
		margin-bottom: 1rem;
		font-weight: 600;
	}

	.register-text,
	.forgot-text {
		margin-top: 1rem;
		font-size: 0.9rem;
		color: #444;
	}

	.register-text a,
	.forgot-text a {
		color: #007bff;
		text-decoration: none;
		font-weight: 600;
	}

	.register-text a:hover,
	.forgot-text a:hover {
		text-decoration: underline;
	}
</style>
