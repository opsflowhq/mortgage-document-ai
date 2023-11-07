import React, { createContext, useContext, useState } from 'react';

import { DocumentData, DocumentMeta, DocumentModel, FlatDocumentData, Page } from '@mortgage-document-ai/models';
import { flattenDocument } from '@mortgage-document-ai/models/utils';


interface DocumentProviderProps extends DocumentContextDefaultData {
    children: JSX.Element | JSX.Element[],

};

interface DocumentContextDefaultData {
    isLoading: boolean;
    isDocumentProcessing: boolean;
    isGeneratingJSON: boolean;
    documentModel: DocumentModel;
    documentData?: DocumentData;
    flatDocumentData?: FlatDocumentData;
    documentPages?: Page[];
    documentMeta?: DocumentMeta;
    onViewJSON?: () => void;
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