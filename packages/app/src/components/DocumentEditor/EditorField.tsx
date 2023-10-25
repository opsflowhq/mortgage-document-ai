import { useEffect, useRef } from "react";
import { Page } from "@urla1003/types";
import clsx from "clsx";

import CheckImg from '@/assets/images/icons/check';
import ExclamationTriangleImg from '@/assets/images/icons/exclamation-triangle';


interface EditorFieldProps {
    label: string;
    value?: string | null;
    confidence?: number;
    isHovering: boolean;
    isEditing: boolean;
    onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}


export default function DocumentField({ label, value, isHovering, isEditing, onMouseEnter, onMouseLeave, confidence }: EditorFieldProps) {

    const elementRef = useRef<HTMLDivElement | null>(null);



    const styleVariants = {
        plain: 'bg-white',
        hovered: 'bg-purple-200',
        editing: 'shadow-xl relative border',
    };

    let variant: keyof typeof styleVariants

    variant = 'plain';
    if (isHovering) variant = 'hovered';
    if (isEditing) variant = 'editing';

    useEffect(() => {

        if (isHovering && elementRef.current) {
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
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [isHovering])


    const confidenceBadge = {
        icon: confidence && confidence < 95 ? ExclamationTriangleImg : CheckImg,
        toolTipText: `${confidence}% confidence`
    };
   
    // if () {
    //     confidenceBadge.icon = ExclamationTriangleImg;
    //     confidenceBadge.toolTipText = `Low confidence. `
    // }

    return (

        <div
            className={clsx("flex flex-row h-12 px-4", styleVariants[variant])}
            ref={elementRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="flex items-center justify-center pr-1 has-tooltip relative">
                {confidenceBadge.icon}
                <span className="tooltip bg-black/70 left-0 p-1 -top-5 text-white w-max rounded">{confidenceBadge.toolTipText}</span>
            </div>
            <div className="flex items-center">
                {label}
            </div>
            <div className="flex items-center grow justify-end">
                {value}
            </div>
        </div>

    );
}