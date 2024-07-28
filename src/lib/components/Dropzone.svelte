<script lang="ts">
    let { children = null, uploadFiles = $bindable(), ...props } = $props();

    let inDropZone = $state(false);
    let hasDropped = $state(false);
    let noFiles = $state();

    const dragOverHandler = (e: DragEvent) => {
        console.log("dragging", e.target);
        inDropZone = true;
        e.preventDefault();
        e.stopPropagation();
    };
    const dragLeaveHandler = (e: DragEvent) => {
        console.log("drag leave", e.target);
        inDropZone = false;
        e.preventDefault();
        e.stopPropagation();
    };
    const dropHandler = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        hasDropped = true;

        let files = e.dataTransfer?.files;
        console.log("files", files);
        //filter all files with file size 0
        noFiles = true;
        if (files && files.length > 0) {
            for (let index = 0; index < files.length; index++) {
                const element = files[index];
                if (element.size > 0) {
                    noFiles = false;
                }
            }
        }
        if (noFiles == false) {
            uploadFiles = files as FileList;
            setTimeout(() => {
                hasDropped = false;
                inDropZone = false;
                noFiles = undefined;
            }, 2000);
        }
    };
</script>

<div
    role="dialog"
    id="document-dropzone"
    ondragover={dragOverHandler}
    ondragleave={dragLeaveHandler}
    ondrop={dropHandler}
    class:dropped={hasDropped}
    class:dragged={inDropZone}
    class="dropzone max-w-3xl w-auto h-72 border-4 border-dashed border-orange-300 rounded-lg flex items-center justify-center"
>
    {#if noFiles == undefined}
        <p class="font-bold text-2xl text-gray-500 text-pretty">
            🔥 Drop it like it`s hot 🔥
        </p>
        <!-- content here -->
    {/if}
    {#if noFiles}
        <!-- content here -->
        <div role="alert" class="alert alert-error">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <span>Error! File Drop doesnt work!! </span>
        </div>
    {/if}
</div>

<style>
    .dropzone {
        transition: all 0.3s ease-in-out;
    }
    /*file drop aninmation*/
    .dropzone.dropped {
        animation: pulse 0.3s ease-out 3;
    }
    .dropzone.dragged {
        border-color: var(--primary);
        transform: scale(1.02);
    }

    @keyframes pulse {
        0%,
        100% {
            transform: scale(1);
        }
        50% {
            transform: scale(0.95);
        }
    }
</style>
