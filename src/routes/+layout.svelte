<script lang="ts">
    import "../app.css";
    import Navigation from "$lib/components/Navigation.svelte";
    let {children, data} = $props();
</script>

<div class="app min-h-full">
    <Navigation {data} />
        <main class="mx-auto max-w-7xl sm:px-6 lg:px-8">
            {@render children()}
        </main>
</div>
