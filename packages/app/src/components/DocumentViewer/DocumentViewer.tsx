import DocumentPage from "./DocumentPage";
import { DocumentData, DocumentFieldValue, Page } from "@urla1003/types";
import { FC, RefObject, memo, useRef } from "react";
import { FieldHoverEvent, FieldHoverEventHandler } from "./BoundingBoxCanvas";
import { useDocumentContext } from "../DocumentProvider";
import FieldHoverBox from "./FieldHoverBox";
import DocumentPageSkeleton from "./DocumentPageSkeleton";


interface DocumentViewerProps {
    // isLoading: boolean,
    // documentPages?: Page[],
    // documentData?: DocumentData,
    // hoveredField: FieldHoverEvent | null;
    // onFieldHover: FieldHoverEventHandler;
}

function DocumentViewer({ }: DocumentViewerProps) {

    const { documentData, documentPages, isLoading } = useDocumentContext();
    const documentViewerRef: RefObject<HTMLDivElement> = useRef(null);

    console.log('Document Viewer Render');

    // console.log('Skeleton -> ', DocumentPage.type.Skeleton);

    return (
        <div className="bg-background-dark bg-dotted-spacing-4 bg-dotted-gray-400 h-full w-full  overflow-auto" >
            <div className="relative w-fit p-20 m-auto" ref={documentViewerRef}>
                {isLoading && <DocumentPageSkeleton />}
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


