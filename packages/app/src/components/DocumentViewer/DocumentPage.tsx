import { memo } from "react" ;
import {DocumentData, DocumentFieldValue, Page } from "@urla1003/types";
import Image from 'next/image'
import {Svg, Distance, Circle} from 'react-svg-path';
import BoundingBoxCanvas, { FieldHoverEvent, FieldHoverEventHandler } from "./BoundingBoxCanvas";


interface DocumentPageProps {
    page: Page;
    pageData: DocumentData;
    // onFieldHover: FieldHoverEventHandler;
    // hoveredField: FieldHoverEvent | null;
}

function DocumentPage({ page, pageData }: DocumentPageProps) {
    //Need to check actuall response type from the GDOCAI
    const buffer = page.image.content.data;
    const base64Data = Buffer.from(buffer).toString('base64');
    const imageDataURL = `data:${page.image.mimeType};base64,${base64Data}`;


    // console.log('Page rerender', page.pageNumber);
    return (
        <div className="w-full mb-6 shadow-xl relative">
            <BoundingBoxCanvas 
                pageNumber={page.pageNumber}
                pageData={pageData}
                // onFieldHover={onFieldHover}
                // hoveredField={hoveredField}
            />
            <Image 
                src={imageDataURL} 
                width={0}
                height={0}
                alt="DocumentPage" 
                className="w-full h-auto" 
            />
        </div>
    );
}

export default memo(DocumentPage);