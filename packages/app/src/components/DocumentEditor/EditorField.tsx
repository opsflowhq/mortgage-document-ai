import { useEffect, useRef } from "react";
import { Page } from "@urla1003/types";
import clsx from "clsx";

import Check from '@/assets/images/icons/check';
import ExclamationTriangle from '@/assets/images/icons/exclamation-triangle';
import SkeletonLoader from "@/components/UI/SkeletonLoader";


interface EditorFieldProps {
    label: string;
    value?: string | null;
    confidence?: number;
    isHovering: boolean;
    isEditing: boolean;
    isLoading?: boolean;
    onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}


export default function DocumentField({ label, value, isHovering, isEditing, isLoading, onMouseEnter, onMouseLeave, confidence }: EditorFieldProps) {

    const elementRef = useRef<HTMLDivElement | null>(null);



    const styleVariants = {
        plain: 'bg-white',
        hovered: 'bg-background-secondary',
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
        icon: confidence && confidence < 95 ? <ExclamationTriangle className="w-4 h-4 stroke-warning stroke-2" /> : <Check className="w-4 h-4 stroke-success stroke-2" />,
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
            <div className="flex items-center font-medium">
                {label}
            </div>
            <div className="flex items-center grow justify-end text-primary-light">
                <SkeletonLoader
                    height={14}
                    width={`${Math.floor(Math.random() * 31) + 30}%`}
                    isLoading={isLoading}
                >
                    {value}
                </SkeletonLoader>
            </div>
        </div>

    );
}