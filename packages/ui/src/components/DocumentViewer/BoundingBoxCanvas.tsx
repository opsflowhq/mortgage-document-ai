import { memo } from "react";

import { FlatDocumentData } from "@mortgage-document-ai/models";

import BoundingBox from "./BoundingBox";
import { useDocumentContext } from "../DocumentProvider";
import FieldHoverBox from "./FieldHoverBox";



interface BoundingBoxCanvasProps {
    flatPageData: FlatDocumentData;
}

function BoundingBoxCanvas({ flatPageData }: BoundingBoxCanvasProps) {

    const { setHoveredField, hoveredField } = useDocumentContext();

    const mouseLeaveHandler = (e: React.MouseEvent<SVGPolygonElement | HTMLDivElement>) => {
        let isLeavingOnTheSameField = false;
        if (e.relatedTarget && e.relatedTarget instanceof Element) {
            const currentTargetId = e.currentTarget.getAttribute('data-field-id');
            const relatedTargetId = e.relatedTarget.getAttribute('data-field-id');

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
                onMouseEnter={() => setHoveredField(fieldKey)}
                onMouseLeave={mouseLeaveHandler}
            />
        );


    }



    return (
        <div className="w-full h-full absolute ">
            <svg width={'100%'} height={'100%'} viewBox="0 0 100 100" preserveAspectRatio="none" >
                {polygons}
            </svg>
            <FieldHoverBox
                isHovered={isHoverBoxVisible}
                hoveredField={hoveredField}
                onMouseLeave={mouseLeaveHandler}
            />
        </div>
    );
}

export default memo(BoundingBoxCanvas);