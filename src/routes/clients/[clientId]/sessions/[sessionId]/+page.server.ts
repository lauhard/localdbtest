import { PocketBaseHelper } from "$lib/pbhelper.server";
import { error, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { serializeNonPojos } from "$lib/pbhelper";
import type { Session } from "../../../../../app";
import type { ClientResponseError } from "pocketbase";

export const load: PageServerLoad = async ({ params, locals }) => {
    let session = null;

    const pbHelper = new PocketBaseHelper(locals.pocketbase, locals);
    if (!pbHelper.isValid())
        redirect(303, '/login');

    if (params.clientId === undefined || params.sessionId === undefined)
        throw error(500, 'Invalid parameters');

    try {
        const record = await pbHelper.getCollectionRecordById('Sessions', params.sessionId.toString());
        const data: Session = serializeNonPojos(record);
        session = data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        throw error(500, err.message);
    }

    return {
        session: session
    }
};

export const actions: Actions = {
    update: async ({ request, locals, cookies, params }) => {
        console.log("update action request", request);
        console.log("update action locals", locals);
        console.log("update action cookies", cookies);
        console.log("update action params", params);

        const formData = await request.formData();
        const data = Object.fromEntries(formData);
        //const udata = { ...data, type: data.type.toString()?.split(",") ?? [] };

        console.log("update action data", data);
        try {
            await locals.pocketbase.collection("Sessions").update(params.sessionId, data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("error", error.message);
            throw error(error.status, error.message as ClientResponseError);
        }
        redirect(303, `/clients/${params.clientId}/sessions/${params.sessionId}`);
    },
    delete: async ({ request, locals, params }) => {
        const formdata = await request.formData();
        const entries = Object.fromEntries(formdata);
        console.log(entries);

        const pbHelper = new PocketBaseHelper(locals.pocketbase, locals);
        if (!pbHelper.isValid())
            redirect(303, '/login');

        await pbHelper.deleteCollectionRecord("Sessions", entries.documentId.toString());

        redirect(303, `/clients/${params.clientId}/sessions`);
    }
}