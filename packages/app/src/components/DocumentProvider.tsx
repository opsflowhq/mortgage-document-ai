import { DocumentData, Form1003, Page } from '@urla1003/types';
import React, { createContext, useContext, useState } from 'react';
import { FieldHoverEvent } from './DocumentViewer/BoundingBoxCanvas';


interface DocumentProviderProps extends DocumentContextDefaultData {
    children: JSX.Element | JSX.Element[],
    
};

interface DocumentContextDefaultData {
    isLoading: boolean;
    documentModel: Form1003.DocumentModel;
    documentData?: DocumentData;
    documentPages?: Page[];
}

interface DocumentContextData extends DocumentContextDefaultData {
    hoveredField: null | FieldHoverEvent;
    setHoveredField: React.Dispatch<React.SetStateAction<null | FieldHoverEvent>>;
}

const DocumentContext = createContext<DocumentContextData>({} as DocumentContextData);

export function DocumentProvider({ children, ...defaultContextData }: DocumentProviderProps) {

    const [hoveredField, setHoveredField] = useState<null | FieldHoverEvent>(null);

    return (
        <DocumentContext.Provider value={{ ...defaultContextData, hoveredField, setHoveredField }}>
            {children}
        </DocumentContext.Provider>
    );
};

export const useDocumentContext = () => {
    return useContext(DocumentContext);
};