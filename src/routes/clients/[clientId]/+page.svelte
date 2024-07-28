<script lang="ts">
    import { enhance } from "$app/forms";
    import Dropzone from "$lib/components/Dropzone.svelte";
    import Input from "$lib/components/Input.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import Multiselect from "$lib/components/Multiselect.svelte";
    import { batchColors } from "$lib/utils.svelte.js";
    import { LucidePencil, LucideSave, LucideTrash2 } from "lucide-svelte";

    let { data } = $props();
    let client = $state(data.client);

    let uploadForm = $state() as HTMLFormElement;
    let uploadFiles = $state() as FileList;
    let edit = $state(false);
    let selected = $state(client.type) as string[];
    let inputStyle = "text-sm h-10 min-h-10 input-bordered ";
    let modalState = $state(false);

    // here we use the effect rune to submit the form when uploadFiles changes and is not empty
    $effect(() => {
        if (uploadFiles && uploadFiles.length > 0) uploadForm.requestSubmit();
    });

    const appendDocumentData = (formData: FormData) => {
        console.log(
            "manually submitting form successfull -> use enhance successfull",
            formData,
        );
        for (let file of uploadFiles) {
            if (file.size > 0) {
                formData.append("document", file, file.name);
                formData.append("client_id", client.id);
                formData.append("filename", file.name);
            }
        }
    };
    const appendUserData = (formData: FormData) => {
        //grab the selected values from the multiselect component
        //turn array to string with comma separated values
        formData.append("type", selected.join(","));
        edit = false;
    };
</script>

{#snippet headerSnippet()}
    <header>
        <h3 class="text-xl font-semibold ">Klient löschen </h3>
    </header>
{/snippet}

{#snippet bodySnippet()}
    <article>
        <p class="text-center ">Wollen Sie diesen Klient wirklich löschen?</p>
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


<div class="mb-5">
    {#each selected as item, i}
        <div
            class="badge {batchColors.find((b) => b.type == item.toLowerCase())
                ?.color} mr-2"
        >
            {item}
        </div>
    {/each}
</div>

<div class=" min-h-48">
    <form
        action="?/update"
        method="POST"
        enctype="multipart/form-data"
        use:enhance={({ formElement, formData, action, cancel, submitter }) =>
            appendUserData(formData)}
    >
        <div class="action-bar w-full h-20 flex relative">
            <button class="btn btn-outline btn-primary" type="submit">
                <LucideSave size={20}></LucideSave></button
            >
            <button
                class="btn btn-outline btn-primary"
                class:active={edit}
                onclick={(e) => {
                    edit = true;
                    e.preventDefault();
                }}><LucidePencil size={20}></LucidePencil></button
            >
            <button  class="btn btn-error btn-outline hover:bg-error absolute right-0"
                onclick={()=>{modalState=true; client}}><LucideTrash2></LucideTrash2></button
            >
        </div>
        <div class="flex flex-row flex-wrap w-full h-full justify-between">
            <div class="flex flex-col w-5/12 min-w-fit">
                <input
                    hidden
                    value={client.id}
                    name="id"
                    type="text"
                    placeholder="fff"
                />
                <div class="form-control w-full max-w-lg mb-3">
                    <Multiselect
                        setFocus={true}
                        bind:selected
                        options={["Hypnose", "Coaching"]}
                        disabled={!edit}
                        style={inputStyle}
                    ></Multiselect>
                </div>
                <div class="form-control w-full max-w-lg mb-1">
                    <Input
                        required={true}
                        label="Vorname"
                        type="text"
                        name="firstname"
                        value={client.firstname}
                        disabled={!edit}
                        snippetFor="label"
                        {inputStyle}
                    ></Input>
                </div>
                <div class="form-control w-full max-w-lg mb-1">
                    <Input
                        required={true}
                        label="Nachname"
                        type="text"
                        name="lastname"
                        value={client.lastname}
                        disabled={!edit}
                        snippetFor="label"
                        {inputStyle}
                    ></Input>
                </div>
                <div class="form-control w-full max-w-lg mb-1">
                    <Input
                        required={true}
                        label="Email"
                        type="email"
                        name="email"
                        value={client.email}
                        disabled={!edit}
                        snippetFor="label"
                        {inputStyle}
                    ></Input>
                </div>
                <div class="form-control w-full max-w-lg mb-1">
                    <Input
                        required={true}
                        label="Telefon"
                        type="phone"
                        name="phone"
                        value={client.phone}
                        disabled={!edit}
                        snippetFor="label"
                        {inputStyle}
                    ></Input>
                </div>
            </div>
            <div class="flex flex-col w-5/12">
                <div class="form-control w-full max-w-lg mb-1">
                    <Input
                        required={true}
                        label="Strasse"
                        type="text"
                        name="street"
                        value={client.street}
                        disabled={!edit}
                        snippetFor="label"
                        {inputStyle}
                    ></Input>
                </div>
                <div class="form-control w-full max-w-lg mb-1">
                    <Input
                        required={true}
                        label="PLZ"
                        type="text"
                        name="zip"
                        value={client.zip}
                        disabled={!edit}
                        snippetFor="label"
                        {inputStyle}
                    ></Input>
                </div>
                <div class="form-control w-full max-w-lg mb-1">
                    <Input
                        required={true}
                        label="Stadt"
                        type="text"
                        name="city"
                        value={client.city}
                        disabled={!edit}
                        snippetFor="label"
                        {inputStyle}
                    ></Input>
                </div>
            </div>
        </div>
    </form>
</div>
<div class="divider"></div>

<form
    bind:this={uploadForm}
    use:enhance={({ formData }) => appendDocumentData(formData)}
    method="POST"
    action="?/upload"
    enctype="multipart/form-data"
    class="flex flex-col w-full mt-5"
>
    <Dropzone bind:uploadFiles></Dropzone>
</form>

{#if modalState}
    <Modal
        class={"bg-slate-300 shadow-lg dialog modal w-96 h-60"}
        bind:modalState
        {headerSnippet}
        {bodySnippet} >
        {@render footerSnippet(client.id, data.client.id)}
    </Modal>
{/if}




<style lang="scss">
    .action-bar > .btn.active {
        background-color: var(--primary);
        color: white !important;
    }
    .action-bar > .btn {
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
</style>
