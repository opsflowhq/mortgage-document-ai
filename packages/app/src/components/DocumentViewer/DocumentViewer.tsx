import DocumentPage from "./DocumentPage";
import { DocumentData, DocumentEntityData, DocumentFieldValue, FlatDocumentData, Page } from "@urla1003/types";
import { FC, RefObject, memo, useRef } from "react";
import { FieldHoverEvent, FieldHoverEventHandler } from "./BoundingBoxCanvas";
import { useDocumentContext } from "../DocumentProvider";
import FieldHoverBox from "./FieldHoverBox";
import DocumentPageSkeleton from "./DocumentPageSkeleton";
import { filterFlatDocumentByPage } from "@/utils";
import Button from "../UI/Button";
import ExclamationCircle from "@/assets/images/icons/exclamation-circle";
import Alert from "../UI/Alert";
import Link from "next/link";


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

                {flatDocumentData &&
                    <Alert
                        style="info-white"
                        title="Demo limitations"
                        maxWidth={1000}
                    >
                        <p>This tool was built for demo purposes and has limitations listed below. If you need help addressing these limitations please feel free to <Link href={'https://www.mortgageflow.io/book-a-demo'} target="_blank" className="font-semibold">contact us</Link>.</p>
                        <ul className="list-disc list-inside">
                            <li>Data is extracted only from the first 3 pages</li>
                            <li>Radio buttons (circles with dots) aren&apos;t extracted</li>
                            <li>Model has low precision due to training on a limited dataset</li>
                        </ul>
                    </Alert>
                }
            </div>
        </div>
    );
}

export default memo(DocumentViewer);



