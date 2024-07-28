/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import PocketBase, { type ListResult, type RecordModel } from "pocketbase";
import type { Client, Locals, PBVerifyAuth } from "../app";
import { error } from "@sveltejs/kit";

interface Error {
    status: number;
    message: string;
}

// export AuthHelper Class for providers
// set provider via constructot
// constructor receives locals and sets pocketbase

export class PocketBaseHelper {

    private pocketbase: PocketBase;
    constructor(public pocketBase: PocketBase, public locals: Locals) {
        this.pocketbase = pocketBase;
    }
    async verifyPasswordAuth(email: string, password: string): Promise<PBVerifyAuth> {
        const res: PBVerifyAuth = {
            error: "",
            verified: false
        }
        try {
            await this.pocketbase.collection("users").authWithPassword(email, password);
            if (!this.isValid()) {
                this.authStoreClear();
            } else {
                res.verified = true;
            }
        } catch (error: any) {
            console.log(error);
            res.error = error.message;
        }
        this.locals.pocketbase = this.pocketbase;
        return res;
    }
    isValid(): boolean {
        return this.pocketbase.authStore.isValid;
    }
    authStoreClear = () => this.pocketbase.authStore.clear();

    createCollectionRecord = async (collectionName: string, data: FormData): Promise<RecordModel | Error> => {
        try {
            const res: RecordModel = await this.pocketbase.collection(collectionName).create(data);
            return res;
        } catch (err: any) {
            return error(err.status, err.message);
        }
    }
    getCollectionRecords = async (collectionName: string, query?: Record<string, unknown>): Promise<RecordModel[] | Error> => {
        try {
            // you can also fetch all records at once via getFullList
            const records: RecordModel[] = await this.pocketBase.collection(collectionName).getFullList(query);
            return records;
        } catch (err: any) {
            return error(err.status, err.message);
        }
    }
    getCollectionRecordList = async (collectionName: string, pageFrom: number, pageTo: number, query?: Record<string, unknown>): Promise<ListResult<RecordModel[] | Error>> => {
        try {
            // you can also fetch all records at once via getFullList
            const records: ListResult<RecordModel[]> = await this.pocketBase.collection(collectionName).getList(pageFrom, pageTo, query);
            return records;
        } catch (err: any) {
            return error(err.status, err.message);
        }
    }
    getCollectionRecordById = async (collectionName: string, recordId: string): Promise<RecordModel> => {
        try {
            const record: RecordModel = await this.pocketBase.collection(collectionName).getOne(recordId);
            return record;
        } catch (err: any) {
            throw error(err.message);
        }
    }
    deleteCollectionRecord = async (collectionName: string, recordId: string): Promise<boolean> => {
        let success: boolean = false;
        try {
            success = await this.pocketBase.collection(collectionName).delete(recordId);
        } catch (err: any) {
            throw error(err.message);
        }
        return success;
    }
    updateColletionRecord = async (collectionName: string, recordId: string, data: Client): Promise<RecordModel> => {
        try {
            const record: RecordModel = await this.pocketBase.collection(collectionName).update(recordId, data);
            return record;
        } catch (err: any) {
            throw error(err.message);
        }
    }
}
