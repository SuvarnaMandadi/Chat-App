<script>
	import { pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let password = '';
	let confirm = '';
	let error = '';
	let success = '';
	let loading = false;
	let token = '';

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		token = params.get('token') || '';
		console.log('Reset token:', token);
	});

	async function resetPassword() {
		error = '';
		success = '';
		loading = true;

		if (!token) {
			error = 'Reset token is missing or invalid.';
			loading = false;
			return;
		}

		if (password.length < 8) {
			error = 'Password must be at least 8 characters.';
			loading = false;
			return;
		}
		if (password !== confirm) {
			error = 'Passwords do not match.';
			loading = false;
			return;
		}

		try {
			await pb.collection('users').confirmPasswordReset(token, password, confirm);
			success = 'Password reset successfully!';
			setTimeout(() => goto('/login'), 1500);
		} catch (err) {
			error = err?.message || 'Reset failed.';
			console.error(err);
		} finally {
			loading = false;
		}
	}
</script>

<div class="reset-container">
	<div class="box">
		<h2>Reset Your Password</h2>

		{#if error}
			<p class="error">{error}</p>
		{/if}
		{#if success}
			<p class="success">{success}</p>
		{/if}

		<form on:submit|preventDefault={resetPassword} class="form">
			<input type="password" bind:value={password} placeholder="New Password" required />
			<input type="password" bind:value={confirm} placeholder="Confirm Password" required />
			<button type="submit" disabled={loading}>
				{#if loading}Resetting...{:else}Reset Password{/if}
			</button>
		</form>
	</div>
</div>

<style>
	.reset-container {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background-image: url('/bg.jpg');
		background-size: cover;
		background-position: center;
		padding: 1rem;
	}

	.box {
		background: rgba(255, 255, 255, 0.25);
		backdrop-filter: blur(14px);
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 400px;
		text-align: center;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1rem;
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

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.error {
		color: #d8000c;
		font-weight: 600;
		margin-top: 0.5rem;
	}

	.success {
		color: #1e7e34;
		font-weight: 600;
		margin-top: 0.5rem;
	}
</style>
