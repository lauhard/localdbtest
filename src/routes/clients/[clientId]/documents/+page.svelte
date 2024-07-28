<script lang="ts">
    import { getFileRessource } from "$lib/pbhelper";
    import {
        Eye,
        LucideAppWindowMac,
        LucideDownloadCloud,
        LucideTrash2,
        LucideXCircle,
    } from "lucide-svelte";
    import type { PBDocument } from "../../../../app";
    import Modal from "$lib/components/Modal.svelte";
    import { downloadFile } from "$lib/utils.svelte";
    let { data } = $props();
    let documents: PBDocument[] = $state(data.documents);
    let docReaderState = $state(false);
    let currentItem = $state() as PBDocument;
    let modalState = $state(false);
    let readerState = $state(false);
    let imageWidth = $state("100");
    let imageHeight = $state("100");

    const isImage = (file: any) => {
        const img = new Image();
        let image = getFileRessource(
            file.collectionId,
            file.id,
            file.document,
        )
        console.log('image', image);
        if(image.split(".").pop() === "webp" || image.split(".").pop() === "jpg"  || image.split(".").pop() === "jpeg"  || image.split(".").pop() === "png"){
            img.src =image;
            console.log('Image width:', img.width);
            console.log('Image height:', img.height);
            if(img.width > img.height){
                console.log('landscape');
                imageHeight = 'auto';
                imageWidth ="100%";
            }else{
                console.log('portrait');
                imageHeight ="100%";
                imageWidth ='auto';
            }
            return true;
        }

       return false;
    }
</script>
<h2 class="text-xl w-full text-center">Dokumentenliste</h2>
<div class="divider mt-1"></div>
{#if documents.length === 0}
    <div class="alert alert-warning">
      <p>Keine Dokumente gefunden.</p>
    </div>
{/if}

{#snippet headerSnippet()}
    <header>
        <h3 class="text-xl font-semibold ">Ressource löschen </h3>
    </header>
{/snippet}

{#snippet bodySnippet()}
    <article>
        <p class="text-center ">Wollen Sie diese Ressource wirklich löschen?</p>
    </article>
{/snippet}

{#snippet footerSnippet(documentId:string, clientId:string)}
    <footer class="flex flex-row w-full justify-between px-8 ">
        <button class="btn bg-blue-400" tabindex="0" onclick="{()=> modalState=false}"  >abbrechen</button>
        <form action="?/delete" method="POST">
            <input type="hidden" name="documentId" value="{documentId}"  />
            <input type="hidden" name="userId" value="{clientId}"  />
            <button type="submit" class="btn btn-outline btn-error ">löschen</button>
        </form>
    </footer>
{/snippet}

{#snippet avatar(item:PBDocument)}
    <div class="avatar min-w-24 w-24 h-full">
            {#if item.document.split(".").pop() === "webp" || item.document
                    .split(".")
                    .pop() === "jpg" || item.document
                    .split(".")
                    .pop() === "jpeg" || item.document
                    .split(".")
                    .pop() === "png"}
                <div class=" rounded-xl">
                    <!-- svelte-ignore a11y_missing_attribute -->
                    <img
                        src={getFileRessource(
                            item.collectionId,
                            item.id,
                            item.document,
                        )}
                    />
                </div>
            {:else}
                <div class=" rounded-xl">
                    <!-- svelte-ignore a11y_missing_attribute -->
                    <img src={"https://placehold.co/400"} />
                </div>
            {/if}
        </div>

{/snippet}

{#snippet information(item:PBDocument)}
       <div
            class="input-info w-full min-w-20 h-full ml-6 flex text-center flex-col justify-start"
        >
            <p class="flex font-normal text-sm">
                <span class="min-w-20 mr-1 text-left"
                    >Hochgeladen
                </span>{new Date(item.created).toLocaleDateString()} - {new Date(
                    item.created,
                ).toLocaleTimeString()}
            </p>
            <p class="font-semibold text-lg text-base-400 flex text-left">
                {item.filename}
            </p>
        </div>
{/snippet}

{#snippet docReader(item:PBDocument)}
    <div class="w-full h-full flex flex-col justify-around">
        <!-- detect if document is an image -->
         <!-- detect if document is landscape or portrait-->
        {#if isImage(item)}
             <!-- content here -->
            <div class="image-wrapper" style="--imageWidth: {imageWidth}; --imageHeight: {imageHeight};">
                <img class="avatar image" src="{getFileRessource(
                    item.collectionId,
                    item.id,
                    item.document,
                )}" alt="" srcset="" >
            </div>
        {:else}
            <object
            class="reader "
            aria-labelledby={item.document}
            data={getFileRessource(
                item.collectionId,
                item.id,
                item.document,
            )}
            width=100
            height=100
        >
            <p>
                Your browser does not support PDFs. <a
                    href={getFileRessource(
                        item.collectionId,
                        item.id,
                        item.document,
                    )}>Download the PDF</a
                >.
            </p>
            </object>
        {/if}


        <form method="dialog" class="flex">
            <button type="submit" class="btn w-full btn-error absolute bottom-0"
                onclick={() => {
                    docReaderState = false;
                    currentItem = {};
                }}>
                    <LucideXCircle></LucideXCircle> schließen
                </button
            >
        </form>
    </div>
{/snippet}

{#each documents as item}
    <div
        class="doc-item flex flex-row w-full h-28 bg-base-100 rounded-lg relative p-3 "
    >
        {@render avatar(item)}

        {@render information(item)}

        <button
            class="btn btn-success btn-outline hover:bg-success"
            onclick={()=>{readerState=true; currentItem=item}}><Eye></Eye></button
        >
        <button
            onclick={ async ()=>{await downloadFile(item)}}
            class="btn btn-info btn-outline  hover:bg-info"> <LucideDownloadCloud></LucideDownloadCloud></button
        >
        <button
            class="btn btn-error btn-outline hover:bg-error"
            onclick={()=>{modalState=true; currentItem=item}}><LucideTrash2></LucideTrash2></button
        >
    </div>
    <div class="divider my-1"></div>
{/each}

{#if modalState}
    <Modal
        class={"bg-slate-300 shadow-lg dialog modal w-96 h-60"}
        bind:modalState
        {headerSnippet}
        {bodySnippet} >
        {@render footerSnippet(currentItem.id, data.client.id)}
    </Modal>
{/if}

{#if readerState}
    <Modal
        class={"bg-slate-300 shadow-lg "}
        bind:modalState = {readerState}>
        {@render docReader(currentItem)}
    </Modal>
{/if}


<style lang="scss">
    .doc-item:hover {
        //box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
        //background-color: var(--primary);
        transition: all 0.3s ease-in-out;
    }
    .btn.active {
        background-color: var(--primary);
        color: white !important;
    }
   .doc-item .btn {
        max-width: 40px;
        max-height: 40px;
        padding: 0.2rem;
        width: 100%;
        height: 100%;
        min-height: auto;
        min-width: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 0.5rem;
    }

    .reader{
        width: 100%;
        height: 100%;
    }
    .image-wrapper{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        display: flex; /* Align content */
        align-items: center; /* Center image vertically */
        justify-content: center; /* Center image horizontally */
        .image{
            max-width: 100%;          /* Maximum width of the container */
            max-height: 100%;         /* Maximum height of the container */
            object-fit: cover;      /* Fit image within container */
            object-position: center;  /* Center the image */
            transition: all 0.3s ease; /* Optional: smooth transition for resize */
            height: var(--imageHeight);
            width: var(--imageWidth);
            position: absolute;
        }
    }

</style>
