import { ProcessedDocument } from "@mortgage-document-ai/models";

export interface LocalFile {
    source: File,
    processedDocument: ProcessedDocument | null;
}