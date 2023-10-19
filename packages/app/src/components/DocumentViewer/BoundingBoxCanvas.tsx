import { DocumentData, DocumentFieldValue, Page } from "@urla1003/types";
import Image from 'next/image'
import { memo, useState } from "react";
import { Svg, Distance, Circle } from 'react-svg-path';
import BoundingBox from "./BoundingBox";
import { useDocumentContext } from "../DocumentProvider";
import FieldHoverBox from "./FieldHoverBox";


export interface FieldHoverEvent {
    entityKey: string;
    fieldKey: string;
    // pageNumber: Page['pageNumber'];
    // fieldPageAnchor: {
    //     x: number,
    //     y: number
    // }
}

export type FieldHoverEventHandler = (e: FieldHoverEvent | null) => void;

interface BoundingBoxCanvasProps {
    pageNumber: Page['pageNumber'];
    pageData: DocumentData;
}

function BoundingBoxCanvas({ pageData, pageNumber }: BoundingBoxCanvasProps) {

    const { setHoveredField, hoveredField } = useDocumentContext();

    const mouseLeaveHandler = (e: React.MouseEvent<SVGPolygonElement | HTMLDivElement>) => {
        let isLeavingOnTheSameField = false;
        if (e.relatedTarget && e.relatedTarget instanceof Element) {
            const currentTargetId = e.currentTarget.getAttribute('data-field-id');
            const relatedTargetId = e.relatedTarget.getAttribute('data-field-id');

            console.log({ currentTargetId, relatedTargetId })

            if (currentTargetId === relatedTargetId) isLeavingOnTheSameField = true;
        }

        if (!isLeavingOnTheSameField) setHoveredField(null)
    };

    const polygons: JSX.Element[] = [];

    for (const entityKey in pageData) {
        const entity = pageData[entityKey];

        for (const fieldKey in entity) {
            const field = entity[fieldKey];


            polygons.push(
                <BoundingBox
                    id={`${entityKey}.${fieldKey}`}
                    field={field}
                    key={`${entityKey}.${fieldKey}`}
                    onClick={() => alert(`${entityKey}.${fieldKey}`)}
                    onMouseEnter={(e) => {
                        // const boundingBoxSvg = e.currentTarget;
                        // const parent = boundingBoxSvg.parentElement;

                        if (parent) {
                            // const svgRect = parent.getBoundingClientRect();
                            // const elementRect = boundingBoxSvg.getBoundingClientRect();



                            // const offsetX = elementRect.left - svgRect.left;
                            // const offsetY = elementRect.top - svgRect.top + elementRect.height;

                            if (!hoveredField) setHoveredField({
                                entityKey,
                                fieldKey,
                                // pageNumber,
                                // fieldPageAnchor: {
                                //     x: offsetX,
                                //     y: offsetY,
                                // }
                            })
                        }
                    }}
                    onMouseLeave={mouseLeaveHandler}
                />
            );

        }
    }

    return (
        <div className="w-full h-full absolute ">
            <svg width={'100%'} height={'100%'} viewBox="0 0 100 100" preserveAspectRatio="none" >
                {polygons}
            </svg>
        </div>
    );
}

export default memo(BoundingBoxCanvas);