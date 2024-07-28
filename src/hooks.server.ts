import PocketBase from 'pocketbase'
import { PUBLIC_HOST, PUBLIC_PORT } from '$env/static/public'
import { serializeNonPojos } from '$lib/pbhelper';
import { type Handle } from '@sveltejs/kit';
import type { User } from './app';

const HOSTURL = `${PUBLIC_HOST}:${PUBLIC_PORT}`;
export const handle: Handle = async ({ event, resolve }) => {
    const pocketBase = new PocketBase(HOSTURL);
    let user: User | undefined = undefined;

    const cookie: string = event.request.headers.get('cookie') || '';
    pocketBase.authStore.loadFromCookie(cookie);

    if (pocketBase.authStore.isValid) {
        // pocketbase model is not a POJO
        user = serializeNonPojos(pocketBase.authStore.model);
    }
    console.log('user', user);
    event.locals.pocketbase = pocketBase;
    event.locals.user = user;
    const response = await resolve(event);
    //append the cookie to the response headers
    response.headers.append('Set-Cookie', pocketBase.authStore.exportToCookie({ secure: false }));
    return response;
}