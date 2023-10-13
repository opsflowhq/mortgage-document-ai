'use client';

import { Document, NestedFormFieldsMap, Page, ProcessedDocument } from "@urla1003/types";
import { useCallback, useEffect, useState } from "react";
import Image from 'next/image'

import useSWR from "swr";
import DocumentViewer from "@/components/DocumentViewer/DocumentViewer";


const processDocument = async (rawDocument: Document) => {
    const formData = new FormData();
    formData.append('document', new File([rawDocument.base64], rawDocument.name));

    const response = await fetch("http://localhost:3001/document/process", {
        method: "POST",
        body: formData
    });

    console.log('PAID REQUEST TO THE SERVER');

    const data = await response.json() as ProcessedDocument;

    return data;
}



export default function DocumentPage({ params }: { params: { documentId: string } }) {
    const documentId = params.documentId;
    const [rawDocument, setRawDocument] = useState<null | Document>(null);
    const { data: processedDocument, error, isLoading } = useSWR(rawDocument, processDocument);
    
    useEffect(() => {
        const documentJson = localStorage.getItem(documentId);
        if (documentJson) setRawDocument(JSON.parse(documentJson));
    }, []);



    return (
        <div style={{ display: 'grid', gridTemplateColumns: "450px auto", height: '100vh' }}>
            <div style={{ background: "grey" }}>
                fs
            </div>
            <div className="">
                <DocumentViewer 
                    isLoading={isLoading}
                    pages={processedDocument?.pages}
                    fields={processedDocument?.fields}
                />
            </div>
        </div>
    );
}

