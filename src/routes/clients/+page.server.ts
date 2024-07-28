/* eslint-disable @typescript-eslint/no-explicit-any */
import { PocketBaseHelper } from "$lib/pbhelper.server";
import { error, redirect } from "@sveltejs/kit";
import { serializeNonPojos } from "$lib/pbhelper";
import type { PageServerLoad } from "./$types";
import type { Client } from "../../app";

let pbHelper = null;

export const load: PageServerLoad = async ({ locals }) => {
    pbHelper = new PocketBaseHelper(locals.pocketbase, locals);

    if (!pbHelper.isValid())
        throw redirect(303, "/login");

    const records = await pbHelper.getCollectionRecords("Clients", { sort: '-created' });
    if (records instanceof Error)
        throw error(500, records.message);

    const clients: Client[] = serializeNonPojos(records) as Client[];
    let header: string[] = [];
    if (clients.length > 0) {
        header = ["Vorname", "Nachname", "Email", "Telefon", "Sitzungstyp"];
    }
    return {
        header: header,
        clients: clients
    }
};