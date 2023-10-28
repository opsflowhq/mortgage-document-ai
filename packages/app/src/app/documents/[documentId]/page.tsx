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


const processDocument = async (rawDocument: Document) => {
    try {
        const file = await get('b8c646e9-90ed-4dd9-9af3-d99c2338c7ce');
        console.log({file})
        if (file.processDocument) return file.processDocument as ProcessedDocument; //TODO: Type File

        const formData = new FormData();
        formData.append('document', file.source);

        const response = await fetch("http://localhost:3001/document/process", {
            method: "POST",
            body: formData
        });

        console.log('PAID REQUEST TO THE SERVER');

        const processDocument = await response.json() as ProcessedDocument;
        await set('b8c646e9-90ed-4dd9-9af3-d99c2338c7ce', {...file, processDocument})

        return processDocument;
    } catch (e) {
        console.log(e)
    }
}



export default function DocumentPage({ params }: { params: { documentId: string } }) {
    const documentId = params.documentId;
    const [rawDocument, setRawDocument] = useState<null | Document>(null);
    // const [hoveredField, setHoveredField] = useState<null | FieldHoverEvent>(null);

    const { data: processedDocument, error, isLoading: isDocumentProcessing } = useSWR(rawDocument, processDocument, {});

    const documentModel = Form1003.documentModel;
    const documentData = processedDocument?.data;
    const documentPages = processedDocument?.pages;
    const documentMeta = processedDocument?.meta;

    useEffect(() => {
        const documentJson = localStorage.getItem(documentId);
        if (documentJson) setRawDocument(JSON.parse(documentJson));
    }, []);

    // console.log('Hovered field ->', hoveredField);


    return (
        <div className="grid grid-cols-[450px,1fr] h-screen">
            <DocumentProvider
                isLoading={!processedDocument && !error}
                // isLoading={!processedDocument && !error}
                isDocumentProcessing={isDocumentProcessing}
                documentData={documentData}
                documentModel={documentModel}
                documentPages={documentPages}
                documentMeta={documentMeta}

            >
                <DocumentEditor
                // isLoading={isLoading}
                // documentModel={documentModel}
                // documentData={documentData}
                // hoveredField={hoveredField}
                />
                <DocumentViewer

                //Document data
                // isLoading={isLoading}
                // documentPages={documentPages}
                // documentData={documentData}

                //Field hover
                // onFieldHover={(e) => setHoveredField(e)}
                // hoveredField={hoveredField}
                />
            </DocumentProvider>
        </div>
    );
}

