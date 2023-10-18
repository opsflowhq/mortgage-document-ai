import DocumentPage from "./DocumentPage";
import { DocumentData, DocumentFieldValue, Page } from "@urla1003/types";
import { FC, memo } from "react";
import { FieldHoverEvent, FieldHoverEventHandler } from "./BoundingBoxCanvas";
import { useDocumentContext } from "../DocumentProvider";


interface DocumentViewerProps {
    // isLoading: boolean,
    // documentPages?: Page[],
    // documentData?: DocumentData,
    // hoveredField: FieldHoverEvent | null;
    // onFieldHover: FieldHoverEventHandler;
}

function DocumentViewer({}: DocumentViewerProps) {

    const {documentData, documentPages} = useDocumentContext();
    console.log('Document Viewer Render');

    return (
        <div className="bg-gray-300 h-full w-full p-20 overflow-auto">
            {documentData && documentPages?.map((p, i) => {

                const pageData = filterDocumentDataByPage(documentData, i);

                return (
                    <DocumentPage 
                        key={p.pageNumber} 
                        page={p}
                        pageData={pageData}
                        // onFieldHover={onFieldHover}
                        // hoveredField={hoveredField}
                    />
                );
            })}
        </div>
    );
}

export default memo(DocumentViewer);


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
  

