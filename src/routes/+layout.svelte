<script lang="ts">
    import '../app.css';
    import Footer from '$lib/components/Footer.svelte';
</script>

<div class="app-container">
    <main>
        <slot />
    </main>
    
    <Footer />
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        min-height: 100vh;
    }
    
    .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }
    
    main {
        flex: 1;
    }
</style>
