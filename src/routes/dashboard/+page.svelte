<script>
	import { onMount, tick } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';

	let user = pb.authStore.model;
	let messages = [];
	let newMessage = '';
	let messageList;
	let showPicker = false;
	let pickerEl;
	let inputEl;

	function getAvatarUrl(author) {
		return author?.avatar ? `${pb.baseUrl}/api/files/users/${author.id}/${author.avatar}` : null;
	}

	function getInitials(name) {
		return name ? name.charAt(0).toUpperCase() : '?';
	}

	onMount(async () => {
		if (!pb.authStore.isValid) {
			goto('/login');
			return;
		}

		if (typeof window !== 'undefined') {
			await import('emoji-picker-element');
		}

		user = pb.authStore.model;

		messages = await pb.collection('messages').getFullList({
			sort: 'created',
			expand: 'author'
		});

		await tick();
		messageList.scrollTop = messageList.scrollHeight;

		pb.collection('messages').subscribe('*', async (e) => {
			if (e.action === 'create') {
				const full = await pb.collection('messages').getOne(e.record.id, { expand: 'author' });
				messages = [...messages, full];
				await tick();
				messageList.scrollTop = messageList.scrollHeight;
			}
		});
	});

	function togglePicker() {
		showPicker = !showPicker;
	}

	// Attach emoji handler every time pickerEl exists
	$: if (showPicker && pickerEl && typeof window !== 'undefined') {
		pickerEl.addEventListener('emoji-click', onEmojiClick);
	}

	function onEmojiClick(e) {
		newMessage += e.detail.unicode;
		showPicker = false;
		inputEl?.focus();
	}

	async function sendMessage() {
		if (!newMessage.trim()) return;
		await pb.collection('messages').create({
			text: newMessage,
			author: user.id
		});
		newMessage = '';
		await tick();
		messageList.scrollTop = messageList.scrollHeight;
	}

	function logout() {
		pb.authStore.clear();
		localStorage.removeItem('pb_auth');
		document.cookie = 'pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
		goto('/login');
	}
</script>

<div class="chat-container">
	<header class="chat-header">
		<div class="user-info">
			{#if user?.avatar}
				<img src={getAvatarUrl(user)} alt="Avatar" class="user-avatar" />
			{:else}
				<div class="user-avatar fallback">{getInitials(user?.username)}</div>
			{/if}
			<h2>{user?.username} <span>({user?.email})</span></h2>
		</div>
		<button on:click={logout}>Logout</button>
	</header>

	<main class="chat-messages" bind:this={messageList}>
		{#each messages as msg}
			<div class="chat-message-row">
				{#if msg.expand?.author?.avatar}
					<img class="msg-avatar" src={getAvatarUrl(msg.expand.author)} alt="User" />
				{:else}
					<div class="msg-avatar fallback">{getInitials(msg.expand?.author?.username)}</div>
				{/if}

				<div class="chat-message">
					<div class="meta">
						<strong>{msg.expand?.author?.username || 'Unknown'}</strong>
						<span
							>{new Date(msg.created).toLocaleTimeString([], {
								hour: '2-digit',
								minute: '2-digit'
							})}</span
						>
					</div>
					<p class="text">{msg.text}</p>
				</div>
			</div>
		{/each}
	</main>

	<footer class="chat-input">
		<!-- Emoji Button -->
		<button class="emoji-btn" on:click={togglePicker}>😊</button>

		<!-- Emoji Picker -->
		{#if showPicker}
			<emoji-picker bind:this={pickerEl}></emoji-picker>
		{/if}

		<input
			type="text"
			bind:value={newMessage}
			bind:this={inputEl}
			placeholder="Type a message..."
			on:keydown={(e) => e.key === 'Enter' && sendMessage()}
		/>

		<button on:click={sendMessage}>Send</button>
	</footer>
</div>

<style>
	.chat-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: #f9f9f9;
		font-family: 'Segoe UI', sans-serif;
	}

	.chat-header {
		background: #2e3a59;
		color: #fff;
		padding: 1rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.user-avatar,
	.msg-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid white;
		background: #ccc;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		color: white;
		font-size: 1rem;
	}

	.user-avatar.fallback,
	.msg-avatar.fallback {
		background-color: #2e3a59;
	}

	.chat-message-row {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.chat-header h2 {
		margin: 0;
		font-size: 1rem;
	}

	.chat-header h2 span {
		font-weight: 300;
		font-size: 0.85rem;
		opacity: 0.8;
	}

	.chat-header button {
		background: #ffffff;
		color: #2e3a59;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-weight: bold;
	}

	.chat-messages {
		flex: 1;
		overflow-y: auto;
		padding: 1rem 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		scroll-behavior: smooth;
	}

	.chat-message {
		background: #ffffff;
		padding: 0.75rem 1rem;
		border-left: 4px solid #2e3a59;
		border-radius: 6px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		width: fit-content;
		max-width: 70%;
		word-wrap: break-word;
	}

	.meta {
		display: flex;
		justify-content: space-between;
		font-size: 0.9rem;
		color: #444;
		margin-bottom: 0.5rem;
	}

	.text {
		margin: 0;
		color: #222;
		font-size: 1rem;
		white-space: pre-wrap;
	}

	.chat-input {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 2rem;
		background: #fff;
		border-top: 1px solid #ddd;
		position: relative;
	}

	.chat-input input {
		flex: 1;
		padding: 0.75rem 1rem;
		border: 1px solid #ccc;
		border-radius: 6px;
		font-size: 1rem;
	}

	.chat-input button {
		background-color: #2e3a59;
		color: white;
		padding: 0.75rem 1.2rem;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-weight: bold;
	}

	.chat-input button:hover {
		background-color: #1e2a46;
	}

	.emoji-btn {
		width: 36px;
		height: 36px;
		padding: 6px;
		font-size: 1.2rem;
		background-color: #2e3a59;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.3s;
	}

	.emoji-btn:hover {
		background-color: #1e2a46;
	}

	emoji-picker {
		position: absolute;
		bottom: 60px;
		left: 2rem;
		z-index: 100;
		background: white;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		border-radius: 10px;
		width: 320px;
		max-height: 400px;
		overflow: hidden;
	}
</style>
