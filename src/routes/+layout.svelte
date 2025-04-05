<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<header class="flex items-center justify-between bg-neutral-100 p-4">
	<h1>Flashcard Royale</h1>
	<nav>
		<ul class="flex gap-4">
			<li>
				<a href="/play" class="{page.url.pathname === '/play' ? 'underline' : ''} text-neutral-500">
					Play
				</a>
			</li>
			<li>
				<a
					href="/leaderboard"
					class="{page.url.pathname === '/play' ? 'underline' : ''} text-neutral-500"
				>
					Leaderboard
				</a>
			</li>
			<li>
				<a
					href="/profile/aidan"
					class="{page.url.pathname === '/play' ? 'underline' : ''} text-neutral-500"
				>
					Profile
				</a>
			</li>
		</ul>
	</nav>
</header>

{@render children()}
