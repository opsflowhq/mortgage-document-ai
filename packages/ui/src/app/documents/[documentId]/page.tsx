'use client';

import { ProcessedDocument, documentModel as Form1003 } from "@mortgage-document-ai/models";
import { useCallback, useEffect, useState } from "react";
import Image from 'next/image'

import useSWR from "swr";
import DocumentViewer from "@/components/DocumentViewer/DocumentViewer";
import DocumentEditor from "@/components/DocumentEditor/DocumentEditor";
import { DocumentProvider } from "@/components/DocumentProvider";
import { get, set } from "idb-keyval";
import { LocalFile } from "@/types";
import { getLocalFile, setLocalFile } from "@/utils";
import { usePostHog } from "posthog-js/react";
import posthog from "posthog-js";
import axios from "axios";


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

        console.log('PAID REQUEST TO THE DOCUMENT AI');

        const processedDocument = await response.json() as ProcessedDocument;
        await setLocalFile(fileStorageKey, { ...file, processedDocument });

        posthog.capture('process_document_success', { response_source: "api" });
        return processedDocument;
    } catch (e) {
        console.log(e)
        posthog.capture('process_document_failure');
        alert('Something went wrong. Please refresh the page and try again.');
    }
}



export default function DocumentPage({ params }: { params: { documentId: string } }) {
    const fileStorageKey = params.documentId;

    const [isGeneratingJSON, setGeneratingJSON] = useState(false);

    const { data: processedDocument, error, isLoading: isDocumentProcessing } = useSWR(fileStorageKey, processDocument, {});


    const documentModel = Form1003;
    const documentData = processedDocument?.data;
    const documentPages = processedDocument?.pages;
    const documentMeta = processedDocument?.meta;

    const handleViewJSON = useCallback(async () => {
        setGeneratingJSON(true);
        const { data } = await axios.post('https://jsonhero.io/api/create.json', {
            title: documentMeta?.sourceFileName,
            content: documentData,
        });
        window.open(data.location, '_blank');
        posthog.capture('view_json_data');
        setGeneratingJSON(false);
    }, [documentData, documentMeta]);




    return (
        <div className="grid grid-cols-[450px,1fr] h-screen">
            <DocumentProvider
                //Loading status
                isLoading={!processedDocument && !error}
                isDocumentProcessing={isDocumentProcessing}
                isGeneratingJSON={isGeneratingJSON}

                //Data
                documentData={documentData}
                documentModel={documentModel}
                documentPages={documentPages}
                documentMeta={documentMeta}

                //Events
                onViewJSON={handleViewJSON}
            >
                <DocumentEditor />
                <DocumentViewer />
            </DocumentProvider>
        </div>
    );
}

