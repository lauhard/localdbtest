<script lang="ts">
    import { onMount } from "svelte";

    let {
        options = [],
        selected = $bindable([]) as string[],
        label = "",
        setFocus = false,
        disabled = false,
        placeholder = "Select...",
        style = "",
    } = $props();

    let isOpen = $state(false);
    let mulitSelect = $state() as HTMLElement;
    let _options = options as string[];

    const toggleDropdown = () => {
        isOpen = !isOpen;
    };

    const onMouseDownDropdown = (e: MouseEvent) => {
        if (disabled) return;
        toggleDropdown();
    };

    const onKeyDownDropdown = (e: KeyboardEvent) => {
        let event = e.target as HTMLElement;
        if (disabled) return;
        if (event?.role === "listbox") {
            toggleDropdown();
        }
    };

    /**
     * @param {string} option
     */
    function toggleOption(option: string) {
        if (selected.includes(option)) {
            selected = selected.filter((o) => o !== option);
        } else {
            selected = [...selected, option];
        }
    }

    /**
     * @param {string} option
     * @param {KeyboardEvent} e
     */
    const onKeyDownOption = (e: KeyboardEvent, option: string) => {
        if (e.key === "Enter") {
            toggleOption(option);
        }
    };

    /**
     * @param {MouseEvent} e
     * @param {string} option
     */
    const onMousDownOption = (e: MouseEvent, option: string) => {
        toggleOption(option);
    };

    /**
     * description: check if the option is selected
     * @param {string} option
     * @returns {boolean}
     */
    const isSelected = (option: string) => {
        return selected.includes(option);
    };

    /**
     * description: when the focus is lost from the dropdown
     * @param {FocusEvent} e
     */
    const onFocusOut = (e: FocusEvent) => {
        let event = e.relatedTarget as HTMLElement;
        if (event?.role != "option") {
            isOpen = !isOpen;
        }
    };
    onMount(() => {
        if (setFocus) {
            mulitSelect.focus();
        }
    });
</script>

{#if label !== ""}
    <!-- content here -->
    <div class="label label-text">{label}</div>
{/if}
<div
    class=" select-bordered select w-full relative {style}"
    role="listbox"
    aria-controls="combobox"
    tabindex="0"
    bind:this={mulitSelect}
    onmousedown={onMouseDownDropdown}
    onkeydown={onKeyDownDropdown}
    aria-disabled={disabled}
>
    <div
        aria-selected={selected.length > 0}
        aria-disabled={disabled}
        class="text text-center w-full h-full flex items-center"
    >
        {#if selected.length === 0}
            <div class="text-gray-500">{placeholder}</div>
        {/if}
        {#each selected as sel}
            <div class="badge badge-outline mx-1">{sel}</div>
        {/each}
    </div>
    <div
        role="listbox"
        aria-multiselectable="true"
        aria-expanded={isOpen}
        class:show={isOpen}
        onfocusout={(e) => onFocusOut(e)}
        class="dropdown-content flex flex-col w-full absolute top-12 left-0 overflow-hidden shadow-lg bg-base-100 rounded-lg"
    >
        {#each _options as option, i}
            <div
                tabindex="0"
                role="option"
                aria-selected={selected.filter((o) => o === option).length > 0}
                class="item flex w-full items-center justify-center min-w-full min-h-10 h-full hover:bg-gray-200"
                class:selected={isSelected(option)}
                onmousedown={(e) => onMousDownOption(e, option)}
                onkeydown={(e) => onKeyDownOption(e, option)}
            >
                {option}
            </div>
        {/each}
    </div>
</div>

<style type="scss">
    .dropdown-content {
        display: none;
        border: #5ca3a8 1px solid;
    }
    .selected {
        background-color: #5ca3a8a6;
    }
    .show {
        display: flex;
    }
    .badge {
        color: #5ca3a8;
    }
</style>
