import { DocumentData, DocumentFieldValue, FlatDocumentData, Page } from "@urla1003/types";
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
    flatPageData: FlatDocumentData;
}

function BoundingBoxCanvas({ flatPageData, pageNumber }: BoundingBoxCanvasProps) {

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

    let isHoverBoxVisible = false;

    for (const fieldKey in flatPageData) {

        const field = flatPageData[fieldKey];

        if (fieldKey === hoveredField) isHoverBoxVisible = true;

        polygons.push(
            <BoundingBox
                id={fieldKey}
                field={field}
                key={fieldKey}
                // onClick={() => alert(fieldKey)}
                onMouseEnter={(e) => {
                    // const boundingBoxSvg = e.currentTarget;
                    // const parent = boundingBoxSvg.parentElement;

                    // if (parent) {
                    //     // const svgRect = parent.getBoundingClientRect();
                    //     // const elementRect = boundingBoxSvg.getBoundingClientRect();



                    // const offsetX = elementRect.left - svgRect.left;
                    // const offsetY = elementRect.top - svgRect.top + elementRect.height;


                    //TODO: Refactor
                    setHoveredField(fieldKey);
                    // // }
                }}
                onMouseLeave={mouseLeaveHandler}
            />
        );


    }

    // let fieldHoverBox = null;
    // if (isHoverBoxVisible) fieldHoverBox = (

    // );

    return (
        <div className="w-full h-full absolute ">
            <svg width={'100%'} height={'100%'} viewBox="0 0 100 100" preserveAspectRatio="none" >
                {polygons}
            </svg>
            {/* {fieldHoverBox} */}
            <FieldHoverBox
                isHovered={isHoverBoxVisible}
                hoveredField={hoveredField}
                onMouseLeave={mouseLeaveHandler}
            // documentViewerRef={documentViewerRef}
            />
        </div>
    );
}

export default memo(BoundingBoxCanvas);