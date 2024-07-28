/* eslint-disable @typescript-eslint/no-explicit-any */
import { PocketBaseHelper } from "$lib/pbhelper.server";
import { error, redirect } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";
import { serializeNonPojos } from "$lib/pbhelper";

export const load: LayoutServerLoad = async ({ params, locals }) => {
    let client = null;
    const pbHelper = new PocketBaseHelper(locals.pocketbase, locals);
    if (!pbHelper.isValid())
        redirect(303, '/login');

    try {
        const record = await pbHelper.getCollectionRecordById('Clients', params.clientId);
        const data: any = serializeNonPojos(record);
        client = data;
    } catch (err: any) {
        throw error(500, err.message);
    }

    return {
        client: client
    }
};