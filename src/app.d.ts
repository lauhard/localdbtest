// See https://kit.svelte.dev/docs/types#app


// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}

        interface User {
            id: string;
            collectionId: string;
            collectionName: string;
            created: string;
            updated: string;
            username: string;
            name: string;
            email: string;
            emailVisibility: boolean;
            verified: boolean;
            avatar: string;
        }
        interface Client {
            id: string;
            collectionId: string;
            collectionName: string;
            created: string;
            updated: string;
            type: string[];
            firstname: string;
            lastname: string;
            email: string;
            phone: string;
            street: string;
            city: string;
            zip: string;
            country: string;
        }

        interface PBDocument {
            id: string;
            collectionId: string;
            collectionName: string;
            created: string;
            updated: string;
            filename: string;
            document: string;
            client_id: string;
        }
        interface Session {
            id: string;
            collectionId: string;
            collectionName: string;
            created: string;
            updated: string;
            client_id: string;
            session_date: string;
            notes: string;
        }
        interface Locals {
            pocketbase: PocketBase;
            user: User | undefined;
        }
        interface PBVerifyAuth {
            error: string;
            verified: boolean;
        }
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export { User, Locals, PBVerifyAuth, PBDocument, Client, Session };
