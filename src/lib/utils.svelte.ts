import type { PBDocument } from "../app";
import { getFileRessource } from "./pbhelper";

export const parentContains = (parent: HTMLElement, child: HTMLElement): boolean => {
    if (parent.nodeName === child.nodeName && parent.nodeName === "DIALOG")
        return true;
    if (child.parentElement && child.parentElement.nodeName !== "BODY") {
        return parentContains(parent, child.parentElement);
    }
    if (child.parentElement?.nodeName === "BODY" || !child.parentElement) {
        return false;
    }
    return false;
}

export const downloadFile = async (item: PBDocument) => {
    const response = await fetch(getFileRessource(
        item.collectionId,
        item.id,
        item.document,
    ));
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

export const batchColors = $state([
    { type: "coaching", color: "badge-error" },
    { type: "hypnose", color: "badge-warning" },
]);