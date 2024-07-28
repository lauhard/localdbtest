<script lang="ts">
    import { onMount, type Snippet } from "svelte";
    let {
        children=null,
        snippetFor="",
        required=false,
        readonly=false,
        disabled=false,
        setFocus=false,
        type="text",
        placeholder="",
        label="",
        name="",
        value="",
        labelStyle="",
        inputStyle="",
        ...props } = $props();
    let snippet = children as Snippet;
    let padding = snippetFor != "" ? "pl-0 overflow-hidden" : "";
    let input = $state() as HTMLInputElement;
    onMount(() => {
        if(setFocus) {
            input.focus();
        }
    });
</script>

{#snippet _labelSnippet(label:string)}
     <div
        class="h-full text-center px-2 flex items-center font-semibold min-w-24 {labelStyle}"
        style="background:#77B6BA; color:#fff"
    >
        {label}
    </div>
{/snippet}

{#snippet _iconSnippet()}
     <div
        class="h-full text-center px-2 flex items-center"
        style="background:#77B6BA; color:#fff"
    >
        {@render (snippet as Snippet)()}
    </div>
{/snippet}

{#if snippetFor != "label" && label !== ""}
    <div class="label">
        <span class="label-text">{label}</span>
    </div>
{/if}

<label class="input flex items-center gap-2 {padding} max-w-full {inputStyle} ">
    {#if snippet !== null && snippetFor != "icon"}
        {@render snippet()}
    {/if}

    {#if snippetFor === "label"}
        {@render _labelSnippet(label)}
    {/if}
    {#if snippetFor === "icon" && snippet !== null}
        {@render _iconSnippet()}
    {/if}

    <input
        bind:this={input}
        type="{type as string}"
        class="grow max-w-full"
        name="{name as string}"
        required="{required as boolean}"
        readonly="{readonly as boolean}"
        disabled="{disabled as boolean}"
        placeholder="{placeholder as string}"
        value="{value as string}"
    />
</label>

<style lang="scss">
    input{
        transition: all 0.3s ease-in-out;
    }
</style>