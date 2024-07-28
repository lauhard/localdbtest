import { PocketBaseHelper } from "$lib/pbhelper.server";
import { error, redirect, type Actions } from "@sveltejs/kit";
export const actions: Actions = {
    login: async ({ request, locals }) => {
        const formData = await request.formData();
        const entries = Object.fromEntries(formData);
        const pbHelper = new PocketBaseHelper(locals.pocketbase, locals);
        const authRes = await pbHelper.verifyPasswordAuth(entries.email.toString(), entries.password.toString());

        if (authRes.verified) {
            throw redirect(303, "/clients");
        }
        else {
            if (authRes.error) {
                console.log(authRes.error);
                throw error(500, authRes.error);
            }
            else {
                console.log("Invalid email or password");
                throw error(401, "Invalid email or password");
            }
        }
    }
}