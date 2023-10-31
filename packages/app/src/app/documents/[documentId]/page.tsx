'use client';

import { Document, Form1003, ProcessedDocument } from "@urla1003/types";
import { useCallback, useEffect, useState } from "react";
import Image from 'next/image'

import useSWR from "swr";
import DocumentViewer from "@/components/DocumentViewer/DocumentViewer";
import DocumentEditor from "@/components/DocumentEditor/DocumentEditor";
import { FieldHoverEvent } from "@/components/DocumentViewer/BoundingBoxCanvas";
import { DocumentProvider } from "@/components/DocumentProvider";
import { get, set } from "idb-keyval";
import { LocalFile } from "@/types";
import { getLocalFile, setLocalFile } from "@/utils";


const processDocument = async (fileStorageKey: string) => {
    try {
        const file = await getLocalFile(fileStorageKey);
        console.log({ file })
        if (file.processedDocument) return file.processedDocument;

        const formData = new FormData();
        formData.append('document', file.source);

        const response = await fetch("http://localhost:3001/document/process", {
            method: "POST",
            body: formData
        });

        console.log('PAID REQUEST TO THE SERVER');

        const processedDocument = await response.json() as ProcessedDocument;
        await setLocalFile(fileStorageKey, { ...file, processedDocument });

        return processedDocument;
    } catch (e) {
        console.log(e)
    }
}



export default function DocumentPage({ params }: { params: { documentId: string } }) {
    const fileStorageKey = params.documentId;


    const { data: processedDocument, error, isLoading: isDocumentProcessing } = useSWR(fileStorageKey, processDocument, {});

    const documentModel = Form1003.documentModel;
    const documentData = processedDocument?.data;
    const documentPages = processedDocument?.pages;
    const documentMeta = processedDocument?.meta;




    return (
        <div className="grid grid-cols-[450px,1fr] h-screen">
            <DocumentProvider
                isLoading={!processedDocument && !error}
                isDocumentProcessing={isDocumentProcessing}
                documentData={documentData}
                documentModel={documentModel}
                documentPages={documentPages}
                documentMeta={documentMeta}

            >
                <DocumentEditor />
                <DocumentViewer />
            </DocumentProvider>
        </div>
    );
}

