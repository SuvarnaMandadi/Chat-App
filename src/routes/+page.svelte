<script>
	import { goto } from '$app/navigation';

	const goToLogin = () => goto('/login');
	const goToRegister = () => goto('/register');
</script>

<div class="container">
	<div class="box">
		<img src="/app_icon.png" alt="User Icon" class="icon" />
		<div class="actions">
			<button class="btn" on:click={goToLogin}>LOG IN</button>
			<button class="btn" on:click={goToRegister}>REGISTER</button>
		</div>
	</div>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background: url('/bg.jpg') no-repeat center center/cover;
		font-family: Arial, Helvetica, sans-serif;
	}

	.box {
		background-color: #f9f9f9;
		padding: 2.5rem 2rem;
		border-radius: 16px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
		text-align: center;
		width: 320px;
	}

	.icon {
		width: 100px;
		height: 100px;
		margin: 0 auto 1.5rem;
		display: block;
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		font-family: Arial, Helvetica, sans-serif;
	}

	.btn {
		padding: 0.75rem;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: bold;
		background-color: #007bff;
		color: white;
		transition: background-color 0.3s;
	}

	.btn:hover {
		background-color: #0056b3;
	}
	.login-box {
		background: rgba(255, 255, 255, 0.25);
		color: #222;
	}
	:global(.dark) .login-box {
		background: rgba(0, 0, 0, 0.5);
		color: white;
	}
</style>
