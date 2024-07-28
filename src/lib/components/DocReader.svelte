<script lang="ts">
    import { getFileRessource } from "$lib/pbhelper";
    import { onMount, type Snippet } from "svelte";
    import type { PBDocument } from "../../app";

    let {
        children,
        currentItem,
        docReaderState = $bindable(),
    }: {
        children: Snippet;
        currentItem: PBDocument;
        docReaderState: boolean;
    } = $props();

    onMount(() => {
        console.log("DocReader mounted");
    });
</script>

{#if currentItem && docReaderState}
    <dialog open={docReaderState} class="modal"></dialog>
{/if}

<style lang="scss">
    .modal,
    .modal-box {
        max-width: 100% !important;
        max-height: 100% !important;
    }
    .modal-box {
        height: 80vh !important;
    }

    .reader {
        height: 100% !important;
    }
</style>
