import DocumentPage from "./DocumentPage";
import { DocumentData, DocumentFieldValue, Page } from "@urla1003/types";
import { FC } from "react";


interface DocumentViewerProps {
    isLoading: boolean,
    documentPages?: Page[],
    documentData?: DocumentData,
    hoveredField?: string, //{entityKey}.{fieldKey}
}

export default function DocumentViewer({documentPages, documentData}: DocumentViewerProps) {
    // console.log("pages >", pages)
    // console.log('fields', fields);
    // const flatFields: DocumentFieldValue[] = [];

    

    // console.log(flatFields);

    return (
        <div className="bg-gray-300 h-full w-full p-20 overflow-auto">
            {documentData && documentPages?.map((p, i) => {

                // const pageData = ;

                // const fields = flatFields.filter(f => f.pageAnchor?.some(pa => pa.page == i));
                const pageData = filterDocumentDataByPage(documentData, i);
                console.log('PAGE DATA ->', pageData);

                return (
                    <DocumentPage 
                        key={p.pageNumber} 
                        page={p}
                        pageData={pageData}
                    />
                );
            })}
        </div>
    );
}

function filterDocumentDataByPage(documentData: DocumentData, pageIndex: string | number) {
    const pageData: DocumentData = {};

    for (const entityKey in documentData) {
        const entity = documentData[entityKey];
        
        for (const fieldKey in entity) {
            const field = entity[fieldKey];
            const isFieldOnThePage = field.pageAnchor?.some(pa => pa.page == pageIndex);
            const isEntityExistOnThePage = !!pageData[entityKey];
            
            
            if (isFieldOnThePage) {
                if (!isEntityExistOnThePage) pageData[entityKey] = {};
                pageData[entityKey][fieldKey] = field;
            }
        }
    }

    return pageData;

}
  

