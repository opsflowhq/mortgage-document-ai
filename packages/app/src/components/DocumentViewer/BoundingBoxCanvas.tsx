import { DocumentData, DocumentFieldValue, Page } from "@urla1003/types";
import Image from 'next/image'
import { useState } from "react";
import { Svg, Distance, Circle } from 'react-svg-path';


interface BoundingBoxCanvasProps {
    pageData: DocumentData,
}

export default function BoundingBoxCanvas({ pageData }: BoundingBoxCanvasProps) {

    const [isNoteVisible, setNoteVisible] = useState(false);

    const polygons: JSX.Element[] = [];

    for (const entityKey in pageData) {
        const entity = pageData[entityKey];

        for (const fieldKey in entity) {
            const field = entity[fieldKey];


            //TODO: Refactor Polygon
            const pointsString = field.pageAnchor[0].boundingPoly.map(p => `${p.x * 100},${p.y * 100}`).join(' ');
            polygons.push(
                <polygon
                    key={`${entityKey}.${fieldKey}`}
                    points={pointsString}
                    className="fill-blue-500/50 stroke-blue-700/40 stroke-2 hover:cursor-pointer"
                    vectorEffect={"non-scaling-stroke"}
                    onClick={() => alert(`Content: ${field.value}, Confidence: ${field.confidence}, Key: ${entityKey}.${fieldKey}`)}
                    onMouseEnter={(e) => {
                        setNoteVisible(true);
                    }}
                    onMouseLeave={(e) => {
                        setNoteVisible(false);
                    }}
                />
            );

        }
    }



    return (
        <div className="w-full h-full absolute">
            <svg width={'100%'} height={'100%'} viewBox="0 0 100 100" preserveAspectRatio="none" >
                {polygons}
            </svg>
            <div className="absolute" style={{}}>
                note
            </div>
        </div>
    );
}