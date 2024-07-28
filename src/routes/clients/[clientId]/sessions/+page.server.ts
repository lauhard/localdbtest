import { PocketBaseHelper } from "$lib/pbhelper.server";
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { serializeNonPojos } from "$lib/pbhelper";
import type { Session } from "../../../../app";

export const load: PageServerLoad = async ({ locals, params }) => {
    const pbHelper = new PocketBaseHelper(locals.pocketbase, locals);
    if (!pbHelper.isValid())
        redirect(303, '/login');

    const { clientId } = params;

    const records = await pbHelper.getCollectionRecords("Sessions", { filter: 'client_id="' + clientId + '"', sort: '-created' });
    const sessions: Session[] = serializeNonPojos(records) as Session[];
    console.log("sessions", sessions);
    let header: string[] = [];
    if (sessions.length > 0) {
        header = ["Session Datum", "Thema", "Sitzungstyp"];
    }
    return {
        header: header,
        sessions: sessions
    }
};

export const actions: Actions = {
    delete: async ({ request, locals }) => {
        const formdata = await request.formData();
        const entries = Object.fromEntries(formdata);
        console.log(entries);

        const pbHelper = new PocketBaseHelper(locals.pocketbase, locals);
        if (!pbHelper.isValid())
            redirect(303, '/login');

        await pbHelper.deleteCollectionRecord("Documents", entries.documentId.toString());

        throw redirect(303, `/clients/${entries.userId}/documents`);
    }
}
