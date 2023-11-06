import { useEffect, useRef } from "react";
import { HoveredField, useDocumentContext } from "../DocumentProvider";
import { getFieldModelByPath } from "@/utils";


interface FieldHoverBoxProps {
    isHovered: boolean;
    hoveredField: HoveredField;
    onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function FieldHoverBox({ onMouseLeave, hoveredField, isHovered }: FieldHoverBoxProps) {

    const { flatDocumentData, documentModel } = useDocumentContext();
    const elementRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {

        if (isHovered && elementRef.current) {
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

    const boundingBoxSvg = document.querySelector(`polygon[data-field-id="${hoveredField}"`); //Defined at BoundingBox.tsx
    const documentViewerContainer = boundingBoxSvg?.parentElement;

    if (boundingBoxSvg && documentViewerContainer) {
        const boundingBoxRect = boundingBoxSvg.getBoundingClientRect();
        const containerRect = documentViewerContainer.getBoundingClientRect();

        const offsetX = boundingBoxRect.left - containerRect.left;
        const offsetY = boundingBoxRect.top - containerRect.top + boundingBoxRect.height;




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