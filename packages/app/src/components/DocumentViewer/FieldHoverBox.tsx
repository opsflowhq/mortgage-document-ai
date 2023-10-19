import { DocumentData, DocumentFieldValue, Page } from "@urla1003/types";
import Image from 'next/image'
import { RefObject, useState } from "react";
import { Svg, Distance, Circle } from 'react-svg-path';
import { FieldHoverEvent } from "./BoundingBoxCanvas";
import { useDocumentContext } from "../DocumentProvider";


interface FieldHoverBoxProps {
    // pageNumber: number;
    // pageData: DocumentData;
    // hoveredField: null | FieldHoverEvent;
    documentViewerRef: RefObject<HTMLDivElement>;
    onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function FieldHoverBox({ onMouseLeave, documentViewerRef }: FieldHoverBoxProps) {

    const { documentModel, hoveredField, documentData } = useDocumentContext();

    let fieldHoverBox: JSX.Element | null = null;
    // const isHovered = hoveredField?.pageNumber === pageNumber

    const fieldId = `${hoveredField?.entityKey}.${hoveredField?.fieldKey}`;
    const boundingBoxSvg = document.querySelector(`polygon[data-field-id="${fieldId}"`); //Defined at BoundingBox.tsx
    const documentViewerContainer = documentViewerRef.current;

    console.log({boundingBoxSvg, documentViewerContainer})

    if (boundingBoxSvg && documentViewerContainer) {
        const boundingBoxRect = boundingBoxSvg.getBoundingClientRect();
        const containerRect = documentViewerContainer.getBoundingClientRect();

        const offsetX = boundingBoxRect.left - containerRect.left;
        const offsetY = boundingBoxRect.top - containerRect.top + boundingBoxRect.height;

        console.log({boundingBoxRect, containerRect});




        if (hoveredField && documentData) fieldHoverBox = (
            <div
                className="absolute bg-white shadow-md p-4 border-blue-500 border field-hover-box"
                style={{ top: offsetY, left: offsetX }}
                onMouseLeave={onMouseLeave}
                data-field-id={`${hoveredField.entityKey}.${hoveredField.fieldKey}`}
            >
                <div className="font-bold text-sm">
                    {documentModel[hoveredField.entityKey].fields[hoveredField.fieldKey].label}
                </div>
                <div>
                    {documentData[hoveredField.entityKey][hoveredField.fieldKey].value}
                </div>
            </div>
        );
    }

    return (fieldHoverBox);
}