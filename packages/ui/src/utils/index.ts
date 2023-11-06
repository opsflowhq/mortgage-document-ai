import { LocalFile } from "@/types";
import { get, set } from "idb-keyval";

export const getLocalFile = async (fileStorageKey: string) => {
    return await get(fileStorageKey) as LocalFile;
}

export const setLocalFile = async (fileStorageKey: string, localFile: LocalFile) => {
    await set(fileStorageKey, localFile);
};
