import { ProcessedDocument } from "@urla1003/types";

export interface LocalFile {
    source: File,
    processedDocument: ProcessedDocument | null;
}