import { memo } from "react";
import { DocumentData, DocumentFieldValue, FlatDocumentData, Page } from "@urla1003/types";
import Image from 'next/image'
import { Svg, Distance, Circle } from 'react-svg-path';
import BoundingBoxCanvas, { FieldHoverEvent, FieldHoverEventHandler } from "./BoundingBoxCanvas";


interface DocumentPageProps {
    page: Page;
    flatPageData: FlatDocumentData;
    // onFieldHover: FieldHoverEventHandler;
    // hoveredField: FieldHoverEvent | null;
}

function DocumentPage({ page, flatPageData }: DocumentPageProps) {
    //Need to check actuall response type from the GDOCAI
    // const buffer = page.image.content.data;
    const buffer = page.image.content;
    const base64Data = Buffer.from(buffer).toString('base64');
    const imageDataURL = `data:${page.image.mimeType};base64,${base64Data}`;


    // console.log('Page rerender', page.pageNumber);
    return (
        <div className="mb-6 shadow-xl relative">
            <BoundingBoxCanvas
                pageNumber={page.pageNumber}
                flatPageData={flatPageData}
            // onFieldHover={onFieldHover}
            // hoveredField={hoveredField}
            />
            <Image
                src={imageDataURL}
                width={0}
                height={0}
                style={{ maxWidth: page.image.width < 1200 ? page.image.width : 1200, minWidth: 700 }}
                alt="DocumentPage"
                className="h-auto max-w-none w-full"
            />
        </div>
    );
}

export default memo(DocumentPage);