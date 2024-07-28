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
    create: async ({ request, locals }) => {
        const formData = await request.formData();
        const entries = Object.fromEntries(formData);

        const type = entries?.type?.toString().split(",");
        const clientData = {
            ...entries,
            "user": locals.user?.id as string,
            "type": type
        }
        //create client with pocketbase
        try {
            await locals.pocketbase.collection("clients").create(clientData);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("error", error.message);
            throw error(error.status, error.message as ClientResponseError);
        }
        // return status code for created sucessfully
        // redirect to login page
        throw redirect(303, "/clients");
    }
}