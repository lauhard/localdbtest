import type { Actions } from "@sveltejs/kit";
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from "./$types";
import type { ClientResponseError } from "pocketbase";
import { PocketBaseHelper } from "$lib/pbhelper.server";

let pbHelper = null;

export const load: PageServerLoad = async ({ locals }) => {
    pbHelper = new PocketBaseHelper(locals.pocketbase, locals);

    if (!pbHelper.isValid()) {
        throw redirect(303, "/login");
    }
};

export const actions: Actions = {
    create: async ({ request, locals, params }) => {
        const formData = await request.formData();
        const entries = Object.fromEntries(formData);

        const keywords = entries?.keywords?.toString().split(",");
        console.log("params", params);
        console.log("keywords", keywords);
        console.log("entries", entries);
        const clientData = {
            ...entries,
            "client_id": params.clientId as string,
            "keywords": keywords
        }
        //create client with pocketbase
        try {
            await locals.pocketbase.collection("Sessions").create(clientData);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("error", error.message);
            throw error(error.status, error.message as ClientResponseError);
        }
        // return status code for created sucessfully
        // redirect to login page
        redirect(303, `/clients/${params.clientId}/sessions`);
    }
}