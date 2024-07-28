import type { ServerLoad } from "@sveltejs/kit";
import type { User } from "../app";

export const load: ServerLoad = async ({ locals }) => {
    let user: User = undefined;
    if (locals.user) {
        user = locals.user;
    }
    return {
        user: user
    }
}