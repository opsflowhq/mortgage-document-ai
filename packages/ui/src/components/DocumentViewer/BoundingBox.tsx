import { DocumentFieldValue } from "@mortgage-document-ai/models";

interface BoundingBoxProps {
    id: string,
    field: DocumentFieldValue;
    onClick?: () => void;
    onMouseEnter?: (e: React.MouseEvent<SVGPolygonElement>) => void;
    onMouseLeave?: (e: React.MouseEvent<SVGPolygonElement>) => void;
}

export default function BoundingBox({ field, onClick, onMouseEnter, onMouseLeave, id }: BoundingBoxProps) {

    if (!field.pageAnchor) return null;
    const pointsString = field.pageAnchor[0].boundingPoly.map(p => `${p.x * 100},${p.y * 100}`).join(' ');

    return (
        <polygon
            points={pointsString}
            className="fill-blue-500/50 stroke-blue-700/40 stroke-2 hover:cursor-pointer"
            vectorEffect={"non-scaling-stroke"}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            data-field-id={id}
        />
    );
}