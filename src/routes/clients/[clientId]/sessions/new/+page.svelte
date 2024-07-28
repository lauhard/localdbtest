<script lang="ts">
    import { enhance } from "$app/forms";
    import Input from "$lib/components/Input.svelte";
    import Multiselect from "$lib/components/Multiselect.svelte";
    import { onMount } from "svelte";

    let selected = $state([]) as string[];

    const appendData = (formData: FormData) => {
        //grab the selected values from the multiselect component
        //turn array to string with comma separated values
        formData.append("keywords", selected.join(","));
    };
    let topic_input = $state() as HTMLInputElement;
    onMount(() => {
        topic_input.focus();
    });
</script>

<div class="flex flex-col w-full h-full p-2">
    <form
        action="?/create"
        method="POST"
        class="flex flex-col items-center gap-4 w-full"
        enctype="multipart/form-data"
        use:enhance={({ formElement, formData, action, cancel, submitter }) =>
            appendData(formData)}
    >
        <h3 class="text-xl font-bold">Neue Sitzung</h3>
        <input
            type="date"
            name="session_date"
            onchange={(e) => console.log(e)}
            class="mb-4 w-full"
            value={new Date().toISOString().split("T")[0]}
        />

        <input
            bind:this={topic_input}
            type="text"
            placeholder="Thema"
            name="topic"
            class="input text-center font-bold text-xl mb-4 input-bordered w-full"
        />
        <div class="form-control w-full max-w-auto">
            <Multiselect
                label="Sitzungstyp"
                placeholder="Select Coachig / Hypnose"
                bind:selected
                options={["Hypnose", "Coaching"]}
            ></Multiselect>
        </div>
        <textarea
            class="textarea textarea-bordered max-w-auto w-full"
            name="notes"
            rows="10"
            placeholder="Notizen"
            id=""
        ></textarea>

        <button class="btn btn-primary max-w-auto w-full text-base mt-5"
            >Sitzung erstellen</button
        >
    </form>
</div>

<style lang="scss">
    input[type="date"] {
        background: transparent !important;
        border: none !important;
        color: white;
        font-size: 0.9rem;
        background-color: var(--primary) !important;
        padding-inline: 1rem;
        padding-block: 0.5rem;
        height: 47px;
        width: fit-content;
        border-radius: 1rem;
    }
    textarea {
        font-size: large;
    }
</style>
