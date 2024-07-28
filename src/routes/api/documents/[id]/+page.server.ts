import { PocketBaseHelper } from "$lib/pbhelper.server";
import { redirect } from "@sveltejs/kit";

export const DELETE = async ({ params, locals, cookies }): Promise<void> => {
    const id = params.id;
    const pbHelper = new PocketBaseHelper(locals.pocketbase, locals);
    if (!pbHelper.isValid())
        redirect(303, '/login');


    const res = await pbHelper.deleteCollectionRecord("Documents", id);
    if (res) {
        cookies.set(`DocumentRecord ${id} deleted`, 'true', {
            httpOnly: true,
            maxAge: 60,
            path: '/'
        })

        redirect(303, '/documents')
    }
}