<script lang="ts">
    import { enhance } from "$app/forms";
    import Input from "$lib/components/Input.svelte";
    import Multiselect from "$lib/components/Multiselect.svelte";
    let selected = $state([]) as string[];
    let inputStyle = "input-bordered ";

    const appendData = (formData: FormData) => {
        //grab the selected values from the multiselect component
        //turn array to string with comma separated values
        formData.append("type", selected.join(","));
    };
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
        <h3 class="text-3xl font-bold">Neuer Klient</h3>
        <div class="form-control w-full max-w-lg">
            <Multiselect
                label="Sitzungstyp"
                setFocus={true}
                bind:selected
                options={["Hypnose", "Coaching"]}
            ></Multiselect>
        </div>
        <div class="form-control w-full max-w-lg">
            <Input
                required={true}
                label="Vorname"
                type="text"
                name="firstname"
                {inputStyle}
            ></Input>
        </div>
        <div class="form-control w-full max-w-lg">
            <Input
                required={true}
                type="text"
                label="Nachname"
                name="lastname"
                {inputStyle}
            ></Input>
        </div>
        <div class="form-control w-full max-w-lg">
            <Input type="email" label="Email" name="email" {inputStyle}></Input>
        </div>
        <div class="form-control w-full max-w-lg">
            <Input type="tel" label="Telefon" name="phone" {inputStyle}></Input>
        </div>

        <div
            class="form-control grid grid-flow-dense gap-x-4 grid-cols-3 grid-rows-3 h-fit w-full max-w-lg mt-5"
        >
            <div class="col-span-full">
                <Input type="text" label="Strasse" name="street" {inputStyle}
                ></Input>
            </div>
            <div class="col-span-">
                <Input type="text" label="Plz" name="zip" {inputStyle}></Input>
            </div>
            <div class="col-span-2">
                <Input type="text" label="Stadt" name="city" {inputStyle}
                ></Input>
            </div>
            <div class="col-span-2">
                <Input type="text" label="Land" name="country" {inputStyle}
                ></Input>
            </div>
        </div>
        <button class="btn btn-primary w-full max-w-lg text-base mt-5"
            >Klient erstellen</button
        >
    </form>
</div>
