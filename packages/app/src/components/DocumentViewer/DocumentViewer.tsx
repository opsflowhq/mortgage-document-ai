import DocumentPage from "./DocumentPage";
import { DocumentData, DocumentEntityData, DocumentFieldValue, FlatDocumentData, Page } from "@urla1003/types";
import { FC, RefObject, memo, useRef } from "react";
import { FieldHoverEvent, FieldHoverEventHandler } from "./BoundingBoxCanvas";
import { useDocumentContext } from "../DocumentProvider";
import FieldHoverBox from "./FieldHoverBox";
import DocumentPageSkeleton from "./DocumentPageSkeleton";
import { filterFlatDocumentByPage } from "@/utils";


interface DocumentViewerProps {
    // isLoading: boolean,
    // documentPages?: Page[],
    // documentData?: DocumentData,
    // hoveredField: FieldHoverEvent | null;
    // onFieldHover: FieldHoverEventHandler;
}

function DocumentViewer({ }: DocumentViewerProps) {

    const { documentData, flatDocumentData, documentPages, isLoading } = useDocumentContext();
    const documentViewerRef: RefObject<HTMLDivElement> = useRef(null);

    // console.log('Document Viewer Render');
    // console.log('FLATTEN', {
    //     nested: documentData,
    //     flat: flattenObj(documentData)
    // });


    // console.log('Skeleton -> ', DocumentPage.type.Skeleton);

    return (
        <div className="bg-background-dark bg-dotted-spacing-4 bg-dotted-gray-400 h-full w-full  overflow-auto" >
            <div className="relative w-fit p-20 m-auto" ref={documentViewerRef}>
                {isLoading && <DocumentPageSkeleton />}
                {flatDocumentData && documentPages?.map((p, i) => {

                    const flatPageData = filterFlatDocumentByPage(flatDocumentData, i);

                    return (
                        <DocumentPage
                            key={p.pageNumber}
                            page={p}
                            flatPageData={flatPageData}
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



