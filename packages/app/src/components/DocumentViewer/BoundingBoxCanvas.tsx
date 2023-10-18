import { DocumentData, DocumentFieldValue, Page } from "@urla1003/types";
import Image from 'next/image'
import { memo, useState } from "react";
import { Svg, Distance, Circle } from 'react-svg-path';
import BoundingBox from "./BoundingBox";
import { useDocumentContext } from "../DocumentProvider";


export interface FieldHoverEvent {
    entityKey: string;
    fieldKey: string;
    pageNumber: Page['pageNumber'];
}

export type FieldHoverEventHandler = (e: FieldHoverEvent | null) => void;

interface BoundingBoxCanvasProps {
    pageNumber: Page['pageNumber'];
    pageData: DocumentData;


}

function BoundingBoxCanvas({ pageData,pageNumber }: BoundingBoxCanvasProps) {

    // const [isNoteVisible, setNoteVisible] = useState(false);
    const {setHoveredField, hoveredField} = useDocumentContext();


    const polygons: JSX.Element[] = [];

    for (const entityKey in pageData) {
        const entity = pageData[entityKey];

        for (const fieldKey in entity) {
            const field = entity[fieldKey];


            polygons.push(
                <BoundingBox 
                    field={field}
                    key={`${entityKey}.${fieldKey}`}
                    onClick={() => alert(`${entityKey}.${fieldKey}`)}
                    onMouseEnter={() => setHoveredField({entityKey, fieldKey, pageNumber})}
                    onMouseLeave={() => setHoveredField(null)}
                />
            );

        }
    }

    let fieldHoverBox: JSX.Element | null = null;
    const isHovered = hoveredField?.pageNumber === pageNumber

    console.log('Hover field', hoveredField);
    if(isHovered) fieldHoverBox = (
            <div className="absolute" style={{top: 3}}>
                <div></div>
                <div>{pageData[hoveredField.entityKey][hoveredField.fieldKey].value}</div>
            </div>
    );


    return (
        <div className="w-full h-full absolute">
            <svg width={'100%'} height={'100%'} viewBox="0 0 100 100" preserveAspectRatio="none" >
                {polygons}
            </svg>
            {fieldHoverBox}
        </div>
    );
}

export default memo(BoundingBoxCanvas);