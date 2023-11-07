import { memo } from "react";
import Image from 'next/image'

import { FlatDocumentData, Page } from "@mortgage-document-ai/models";

import BoundingBoxCanvas from "./BoundingBoxCanvas";


interface DocumentPageProps {
    page: Page;
    flatPageData: FlatDocumentData;
}

function DocumentPage({ page, flatPageData }: DocumentPageProps) {
    const buffer = page.image.content;
    const base64Data = Buffer.from(buffer).toString('base64');
    const imageDataURL = `data:${page.image.mimeType};base64,${base64Data}`;


    return (
        <div className="mb-6 shadow-xl relative">
            <BoundingBoxCanvas
                flatPageData={flatPageData}
            />
            <Image
                src={imageDataURL}
                width={0}
                height={0}
                style={{ maxWidth: page.image.width < 1200 ? page.image.width : 1000, minWidth: 700 }}
                alt="DocumentPage"
                className="h-auto max-w-none w-full"
            />
        </div>
    );
}

export default memo(DocumentPage);