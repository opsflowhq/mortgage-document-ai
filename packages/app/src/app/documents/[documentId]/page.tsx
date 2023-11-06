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
import { usePostHog } from "posthog-js/react";
import posthog from "posthog-js";


const processDocument = async (fileStorageKey: string) => {
    try {
        posthog.capture('process_document_intent');

        const file = await getLocalFile(fileStorageKey);
        if (file.processedDocument) {
            posthog.capture('process_document_success', { response_source: "local-cache" });
            return file.processedDocument;
        }

        const formData = new FormData();
        formData.append('document', file.source);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/document/process`, {
            method: "POST",
            body: formData
        });

        console.log('PAID REQUEST TO THE SERVER');

        const processedDocument = await response.json() as ProcessedDocument;
        await setLocalFile(fileStorageKey, { ...file, processedDocument });

        posthog.capture('process_document_success', { response_source: "api" });
        return processedDocument;
    } catch (e) {
        //Add error notification
        console.log(e)
        posthog.capture('process_document_failure');
        alert('Something went wrong. Please refresh the page and try again.');
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

