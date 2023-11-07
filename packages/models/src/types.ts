export type Point = { x: number; y: number };

//https://cloud.google.com/document-ai/docs/reference/rest/v1/Document#pageanchor
export interface PageAnchor {
    page: string | number | Long;
    boundingPoly: Point[];
}

export interface DocumentFieldValue {
    value: string | null;
    confidence: number;
    pageAnchor?: PageAnchor[];
}

export type DocumentData = {
    [key: string]: DocumentEntityData;
};

export type DocumentEntityData = {
    [key: string]: DocumentFieldValueUnion
};

export type DocumentFieldValueUnion = DocumentFieldValue | DocumentEntityData | DocumentEntityData[] | DocumentFieldValue[];

export type FlatDocumentData = {
    [key: string]: DocumentFieldValue
}

export interface Document {
    name: string;
    base64: string | ArrayBuffer;
}

export interface Page {
    pageNumber: number;
    image: {
        /** Image content */
        content: Uint8Array | string;

        /** Image mimeType */
        mimeType?: string;

        /** Image width */
        width: number;

        /** Image height */
        height: number;
    };
}

export interface DocumentMeta {
    type: string;
    sourceFileName: string;
}

export interface ProcessedDocument {
    pages: Page[];
    data: DocumentData;
    meta: DocumentMeta;
}

export interface DocumentFieldModel<ENTITY_KEY = string> {
    label: string;
    key: ENTITY_KEY;
    isArray?: boolean;
    fields?: DocumentEntityFieldsModel;
}

export interface DocumentEntityFieldsModel<ENTITY_KEY = string> {
    [key: string]: DocumentFieldModel<ENTITY_KEY>;
}

interface IEntity<ENTITY_KEY = string> {
    label: string;
    fields: DocumentEntityFieldsModel<ENTITY_KEY>;
}

export type DocumentModel<ENTITY_KEY = string> = { [key: string]: IEntity<ENTITY_KEY> };

export interface DocumentType<ENTITY_ENUM extends string = string> {
    slug: string;
    processors: readonly DocumentProcessor[];
    entities: Record<string, ENTITY_ENUM>;
    model: DocumentModel;
}

interface DocumentProcessor {
    name: string;
    pageRange: {
        from: number,
        to: number
    }
}