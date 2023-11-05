import { DocumentData, DocumentMeta, FlatDocumentData, Form1003, Page } from '@urla1003/types';
import React, { createContext, useContext, useState } from 'react';
import { FieldHoverEvent } from './DocumentViewer/BoundingBoxCanvas';
import { flattenDocument } from '@/utils';


interface DocumentProviderProps extends DocumentContextDefaultData {
    children: JSX.Element | JSX.Element[],

};

interface DocumentContextDefaultData {
    isLoading: boolean;
    isDocumentProcessing: boolean;
    documentModel: Form1003.DocumentModel;
    documentData?: DocumentData;
    flatDocumentData?: FlatDocumentData;
    documentPages?: Page[];
    documentMeta?: DocumentMeta;
}

export type HoveredField = null | string; //Path to the field e.g. otherIncome.sources.1.monthlyIncome

interface DocumentContextData extends DocumentContextDefaultData {
    hoveredField: HoveredField
    setHoveredField: React.Dispatch<React.SetStateAction<HoveredField>>;
}


const DocumentContext = createContext<DocumentContextData>({ isLoading: true } as DocumentContextData);

export function DocumentProvider({ children, ...defaultContextData }: DocumentProviderProps) {

    const [hoveredField, setHoveredField] = useState<HoveredField>(null);
    const flatDocumentData = defaultContextData.documentData && flattenDocument(defaultContextData.documentData);


    return (
        <DocumentContext.Provider value={{ ...defaultContextData, flatDocumentData, hoveredField, setHoveredField }}>
            {children}
        </DocumentContext.Provider>
    );
};

export const useDocumentContext = () => {
    return useContext(DocumentContext);
};