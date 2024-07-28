<script lang="ts">
    import { parentContains } from "$lib/utils.svelte";
    import { onMount, type Snippet } from "svelte";
    import type { ActionReturn } from "svelte/action";
    let {children=null, headerSnippet=null, bodySnippet=null, footerSnippet=null, modalState=$bindable(false), class:CLASS="", ...props } = $props();
    let dialog = $state() as HTMLDialogElement;
    const modalClose = (node: HTMLElement): ActionReturn<void> => {
        //define logic ...
        // in this case we want to create a custom event to close the dialog on click outside or on escape key
        // is modal active
        const handleClick = (e: MouseEvent) => {
            //ceck if the dialog is open and if the click is outside the dialog
            if (parentContains(node, e.target as HTMLElement)=== false && modalState===true) {
                node.dispatchEvent(new CustomEvent("close"));
            }
        };
        //check for specific parent node recursively

        const handleKeydown = (e: KeyboardEvent) => {
            // check if dialog is on focus and the key pressed is escape
            if (parentContains(node, document.activeElement as HTMLElement) && e.key === "Escape") {
                node.dispatchEvent(new CustomEvent("close"));
            }
        };

        //add event listener to the document
        document.addEventListener("click", handleClick, true);
        document.addEventListener("keydown", handleKeydown, true);
        return {
            destroy() {
                document.removeEventListener("click", handleClick, true);
                document.removeEventListener("keydown", handleKeydown, true);
            },
        };
    };
    onMount(() => {
        //add event listener to the document
       console.info("moda called at, ", new Date().toLocaleTimeString());
       dialog.focus();
    });
</script>

{#if (modalState)}
   <div class="backdrop w-full h-full flex bg-slate-900 fixed top-0 left-0 opacity-80 "></div>
{/if}

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<dialog
    bind:this={dialog}
    open={modalState as boolean}
    aria-modal="true"
    class="dialog modal bg-slate-100 rounded-lg {CLASS}"
    tabindex="0"
    use:modalClose onclose={()=>modalState=false}>
    {@render (headerSnippet as Snippet)()}
    {@render (bodySnippet as Snippet)()}
    {@render (footerSnippet as Snippet)()}
    {@render (children as Snippet)()}
</dialog>
<style lang="scss">
    :global(body){
        transition: filter 0.3s ease-in-out;
    }
    .backdrop{
        z-index: 999;
    }
    .dialog, .modal {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        max-height: 90%;
        max-width: 90%;
        min-width: none !important;
        min-height: none !important;
    }
</style>
