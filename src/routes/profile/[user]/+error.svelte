<script>
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} Not Found</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-100 text-gray-800">
	<div class="text-center">
		<h1 class="text-6xl font-bold">{page.status}</h1>
		<p class="mt-2 text-lg">User not found.</p>
		<a href="/" class="text-blue-600 hover:underline">Go back home</a>
	</div>
</div>
