import { PUBLIC_HOST, PUBLIC_PORT } from "$env/static/public";

const baseURL = `${PUBLIC_HOST}:${PUBLIC_PORT}`;

export const serializeNonPojos = (obj: unknown) => structuredClone(obj);

export const generateUsername = (name: string) => {
    const array = new Uint32Array(10)
    const id = crypto.getRandomValues(array).toString().slice(0, 9);
    return `${name}${id}`
}

export const getFileRessource = (collectionID: string, fileID: string, fileName: string, thumb?: string) => {
    console.log("getFileRessource", `${baseURL}/api/files/${collectionID}/${fileID}/${fileName}${thumb ? `?thumb=${thumb}` : ""}`);
    return `${baseURL}/api/files/${collectionID}/${fileID}/${fileName}${thumb ? `?thumb=${thumb}` : ""}`;
}
