import { DocumentData, DocumentFieldValue, Page } from "@urla1003/types";
import Image from 'next/image'
import { RefObject, useEffect, useRef, useState } from "react";
import { Svg, Distance, Circle } from 'react-svg-path';
import { FieldHoverEvent } from "./BoundingBoxCanvas";
import { HoveredField, useDocumentContext } from "../DocumentProvider";
import { getFieldModelByPath } from "@/utils";


interface FieldHoverBoxProps {
    // pageNumber: number;
    // pageData: DocumentData;
    isHovered: boolean;
    hoveredField: HoveredField;
    // documentViewerRef: RefObject<HTMLDivElement>;
    onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function FieldHoverBox({ onMouseLeave, hoveredField, isHovered }: FieldHoverBoxProps) {

    const { flatDocumentData, documentModel } = useDocumentContext();
    const elementRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {

        if (isHovered && elementRef.current) {
            // elementRef.current?.scrollIntoView({behavior: "smooth", block: 'center'});

            const element = elementRef.current;
            const rect = element.getBoundingClientRect();

            // Check if the element is partially or entirely outside of the viewport
            if (
                rect.bottom > window.innerHeight ||
                rect.top < 0 ||
                rect.right > window.innerWidth ||
                rect.left < 0
            ) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [isHovered])

    let fieldHoverBox: JSX.Element | null = null;
    // const isHovered = hoveredField?.pageNumber === pageNumber

    // const fieldId = `${hoveredField?.entityKey}.${hoveredField?.fieldKey}`;
    const boundingBoxSvg = document.querySelector(`polygon[data-field-id="${hoveredField}"`); //Defined at BoundingBox.tsx
    // const documentViewerContainer = documentViewerRef.current;
    const documentViewerContainer = boundingBoxSvg?.parentElement;

    console.log({ boundingBoxSvg, documentViewerContainer })

    if (boundingBoxSvg && documentViewerContainer) {
        const boundingBoxRect = boundingBoxSvg.getBoundingClientRect();
        const containerRect = documentViewerContainer.getBoundingClientRect();

        const offsetX = boundingBoxRect.left - containerRect.left;
        const offsetY = boundingBoxRect.top - containerRect.top + boundingBoxRect.height;

        console.log({ boundingBoxRect, containerRect });




        if (hoveredField && flatDocumentData) fieldHoverBox = (
            <div
                className="absolute bg-white shadow-md p-4 border-secondary border rounded field-hover-box"
                style={{ top: offsetY, left: offsetX }}
                onMouseLeave={onMouseLeave}
                data-field-id={hoveredField}
                ref={elementRef}
            >
                <div className="font-semibold text-sm mb-1">
                    {getFieldModelByPath(documentModel, hoveredField)?.label}
                </div>
                <div className="text-sm">
                    {flatDocumentData[hoveredField].value}
                </div>
            </div>
        );
    }

    return (fieldHoverBox);
}