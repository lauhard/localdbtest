/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { ClientResponseError } from "pocketbase";
import { PocketBaseHelper } from "$lib/pbhelper.server";

export const load: PageServerLoad = async () => {

};

export const actions: Actions = {
    upload: async ({ request, locals }) => {
        const formData = await request.formData();
        const data = Object.fromEntries(formData);
        console.log("entrie", data);

        try {
            await locals.pocketbase.collection("Documents").create(data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("error", error.message);
            throw error(error.status, error.message as ClientResponseError);
        }
    },
    update: async ({ request, locals }) => {

        const formData = await request.formData();
        const data = Object.fromEntries(formData);
        const id = data.id;
        const udata = { ...data, type: data.type.toString()?.split(",") ?? [] };
        console.log("update action data", udata);
        console.log("update action id", data);
        try {
            await locals.pocketbase.collection("Clients").update(id, udata);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("error", error.message);
            throw error(error.status, error.message as ClientResponseError);
        }
        redirect(303, `/clients/${id}/`);
    },
    delete: async ({ request, locals }) => {
        const formdata = await request.formData();
        const entries = Object.fromEntries(formdata);
        console.log(entries);

        const pbHelper = new PocketBaseHelper(locals.pocketbase, locals);
        if (!pbHelper.isValid())
            redirect(303, '/login');

        await pbHelper.deleteCollectionRecord("Clients", entries.documentId.toString());

        throw redirect(303, `/clients`);
    }
}