<script>
	import PocketBase from 'pocketbase';
	import { goto } from '$app/navigation';

	const pb = new PocketBase('https://pocketbase-deploy-kkjz.onrender.com');

	let email = '';
	let username = '';
	let password = '';
	let avatarFile = null;
	let error = '';
	let success = '';

	function handleFileChange(event) {
		const file = event.target.files?.[0];
		if (file && !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
			error = 'Please upload PNG, JPG, or WEBP files only.';
			avatarFile = null;
		} else {
			error = '';
			avatarFile = file;
		}
	}

	function extractErrorMessage(err) {
		if (err?.response?.data) {
			const messages = Object.entries(err.response.data).map(([field, val]) => {
				if (val?.message?.includes('must be unique')) {
					return `${field} already exists.`;
				}
				return `${field}: ${val?.message || 'Invalid'}`;
			});
			return messages.join('\n');
		}
		return err?.message || 'Failed to register.';
	}

	function isAllowedDomain(email) {
		const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];
		const domain = email.split('@')[1]?.toLowerCase();
		return allowedDomains.includes(domain);
	}

	async function register() {
		error = '';
		success = '';

		if (!isAllowedDomain(email)) {
			error = 'Please use an email from gmail.com, yahoo.com, or outlook.com.';
			return;
		}

		try {
			const formData = new FormData();
			formData.append('email', email);
			formData.append('username', username);
			formData.append('password', password);
			formData.append('passwordConfirm', password);
			if (avatarFile) {
				formData.append('avatar', avatarFile);
			}

			await pb.collection('users').create(formData);
			await pb.collection('users').requestVerification(email);
			success = 'User registered successfully!';
			setTimeout(() => goto('/login'), 1000);
		} catch (err) {
			console.error('Full error:', err);
			error = extractErrorMessage(err);
		}
	}
</script>

<div class="register-container">
	<div class="register-box">
		<img src="/Icon.png" alt="User Icon" class="icon" />

		{#if error}
			<p class="error">{error}</p>
		{/if}
		{#if success}
			<p class="success">{success}</p>
		{/if}

		<form on:submit|preventDefault={register} class="form">
			<input type="email" bind:value={email} placeholder="Email" required />
			<input type="text" bind:value={username} placeholder="Username" required />
			<input type="password" bind:value={password} placeholder="Password" required />

			<label for="avatar" class="file-label">Upload Profile Picture</label>
			<input
				id="avatar"
				type="file"
				accept="image/png, image/jpeg, image/webp"
				on:change={handleFileChange}
			/>

			<button type="submit">Register</button>
		</form>

		<p class="login-text">Already have an account? <a href="/login">Login here</a></p>
	</div>
</div>

<style>
	.register-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background: url('/bg.jpg') no-repeat center center/cover;
	}

	.register-box {
		background: rgba(255, 255, 255, 0.25);
		backdrop-filter: blur(14px);
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 360px;
		text-align: center;
	}

	.icon {
		width: 80px;
		height: 80px;
		margin: 0 auto 1.5rem;
		display: block;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.file-label {
		text-align: left;
		font-size: 0.95rem;
		font-weight: bold;
		color: #333;
		margin-bottom: -0.5rem;
	}

	input[type='email'],
	input[type='text'],
	input[type='password'],
	input[type='file'] {
		padding: 0.75rem;
		border-radius: 0.5rem;
		border: 1px solid #ccc;
		font-size: 1rem;
	}

	button {
		background-color: #28a745;
		color: white;
		font-weight: bold;
		padding: 0.75rem;
		border-radius: 0.5rem;
		border: none;
		cursor: pointer;
		transition: background 0.3s;
	}

	button:hover {
		background-color: #1e7e34;
	}

	.error {
		color: #d8000c;
		margin-bottom: 1rem;
		font-weight: 600;
		white-space: pre-line;
	}

	.success {
		color: #1e7e34;
		margin-bottom: 1rem;
		font-weight: 600;
	}

	.login-text {
		margin-top: 1rem;
		font-size: 0.9rem;
		color: #333;
	}

	.login-text a {
		color: #28a745;
		text-decoration: none;
		font-weight: 600;
	}

	.login-text a:hover {
		text-decoration: underline;
	}
</style>
