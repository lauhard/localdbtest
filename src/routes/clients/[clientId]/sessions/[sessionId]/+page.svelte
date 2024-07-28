<script lang="ts">
    import { enhance } from "$app/forms";
    import Input from "$lib/components/Input.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import { redirect } from "@sveltejs/kit";
    import type { Session } from "../../../../../app";
    import {
        LucideFilePlus,
        LucidePencil,
        LucideSave,
        LucideTrash2,
        Trash2,
    } from "lucide-svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    let { data } = $props();
    let session: Session = $state(data.session);
    let edit = $state(false);
    let inputStyle = $state("");
    let textareaStyle = $state("");
    let session_date = $state(
        new Date(session.session_date).toISOString().split("T")[0],
    );
    let modalState = $state(false);

    $effect(() => {
        inputStyle = edit == true ? "input-bordered" : "";
        textareaStyle = edit == true ? "textarea-bordered" : "";
    });

    const appendSessionData = (formData: FormData) => {
        //grab the selected values from the multiselect component
        //turn array to string with comma separated values
        edit = false;
    };
</script>

{#snippet headerSnippet()}
    <header>
        <h3 class="text-xl font-semibold ">Sitzung löschen </h3>
    </header>
{/snippet}

{#snippet bodySnippet()}
    <article>
        <p class="text-center ">Wollen Sie diese Sitzung wirklich löschen?</p>
    </article>
{/snippet}

{#snippet footerSnippet(documentId:string, clientId:string)}
    <footer class="flex flex-row w-full justify-between px-8 ">
        <button class="btn btn-info btn-outline hover:bg-blue-400" tabindex="0" onclick="{()=> modalState=false}"  >abbrechen</button>
        <form action="?/delete" method="POST">
            <input type="hidden" name="documentId" value="{documentId}"  />
            <input type="hidden" name="userId" value="{clientId}"  />
            <button type="submit" class="btn btn-outline btn-error ">löschen</button>
        </form>
    </footer>
{/snippet}

<h2 class="text-xl w-full text-center">Sitzungs Details</h2>
<div class="divider mt-1"></div>

<form
    action="?/update"
    method="POST"
    class="flex justify-center flex-col"
    use:enhance={({ formElement, formData, action, cancel, submitter }) =>
        appendSessionData(formData)}
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
        <a class="btn btn-primary btn-outline h-9 min-h-9"
            href="/clients/{data.client.id}/sessions/new"
           ><LucideFilePlus size={20}></LucideFilePlus></a
        >
        <button class="btn btn-error btn-outline hover:bg-error absolute right-0"
            onclick={()=>{modalState=true; session}}><LucideTrash2></LucideTrash2></button
        >
    </div>
    <label class="label text-sm" for="session_date">Sitzungsdatum</label>
    <input
        type="date"
        name="session_date"
        value={session_date}
        onchange={(e) => console.log(e)}
        class="mb-4"
        disabled={!edit}
    />

    <input
        type="text"
        placeholder="Thema"
        name="topic"
        value={session.topic}
        disabled={!edit}
        class="input text-center font-bold text-xl mb-4 {inputStyle}"
    />
    <textarea
        class="textarea textarea-ghost {textareaStyle}"
        name="notes"
        cols="20"
        rows="10"
        disabled={!edit}
        value={session.notes}
        id=""
    ></textarea>
</form>

{#if modalState}
    <Modal
        class={"bg-slate-300 shadow-lg dialog modal w-96 h-60"}
        bind:modalState
        {headerSnippet}
        {bodySnippet} >
        {@render footerSnippet(session.id, data.client.id)}
    </Modal>
{/if}



<style lang="scss">
    input[type="date"] {
        background: transparent !important;
        border: none !important;
        color: white;
        font-size: 1rem;
        background-color: var(--primary) !important;
        padding-inline: 1rem;
        padding-block: 0.5rem;
        height: 47px;
        width: fit-content;
        border-radius: 1rem;
        &:disabled {
            background: transparent !important;
            border: 1px solid #b4b4b4 !important;
            color: #727272;
            font-size: 0.9rem;
        }
        transition: all 0.3s ease-in-out;
    }
    input,
    textarea {
        font-size: large;
        transition: all 0.3s ease-in-out;
    }
    input:disabled,
    textarea:disabled {
        background: transparent !important;
        border: none !important;
        color: rgb(69, 69, 69);
        transition: all 0.3s ease-in-out;
        font-size: 1rem;
    }
    .action-bar > .btn.active {
        background-color: var(--primary);
        color: white !important;
        transition: all 0.3s ease-in-out;
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
        transition: all 0.3s ease-in-out;
    }
</style>
