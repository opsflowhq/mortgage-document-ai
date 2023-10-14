'use client';

import { Document, Form1003, ProcessedDocument } from "@urla1003/types";
import { useCallback, useEffect, useState } from "react";
import Image from 'next/image'

import useSWR from "swr";
import DocumentViewer from "@/components/DocumentViewer/DocumentViewer";
import DocumentEditor from "@/components/DocumentEditor/DocumentEditor";


const processDocument = async (rawDocument: Document) => {
    const formData = new FormData();
    formData.append('document', new File([rawDocument.base64], rawDocument.name));

    const response = await fetch("http://localhost:3001/document/process", {
        method: "POST",
        body: formData
    });

    console.log('PAID REQUEST TO THE SERVER');

    const data = await response.json() as ProcessedDocument;
    console.log(data)
    return data;
}



export default function DocumentPage({ params }: { params: { documentId: string } }) {
    const documentId = params.documentId;
    const [rawDocument, setRawDocument] = useState<null | Document>(null);
    const { data: processedDocument, error, isLoading } = useSWR(rawDocument, processDocument);


    const documentModel = Form1003.documentModel;
    const documentData = processedDocument?.data;
    const documentPages = processedDocument?.pages;

    useEffect(() => {
        const documentJson = localStorage.getItem(documentId);
        if (documentJson) setRawDocument(JSON.parse(documentJson));
    }, []);



    return (
        <div className="grid grid-cols-[450px,1fr] h-screen">
            <DocumentEditor
                isLoading={isLoading}
                documentModel={documentModel}
                documentData={documentData}
            />
            <DocumentViewer
                isLoading={isLoading}
                documentPages={documentPages}
                documentData={documentData}
                hoveredField={'borrower.name'}
            />
        </div>
    );
}

