import { useEffect, useRef } from "react";
import { Page } from "@urla1003/types";
import clsx from "clsx";


interface EditorFieldProps {
    label: string;
    value?: string | null;
    isHovered: boolean;
    onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}


export default function DocumentField({ label, value, isHovered, onMouseEnter, onMouseLeave }: EditorFieldProps) {

    const elementRef = useRef<HTMLDivElement | null>(null);

    const variant = isHovered ? "hovered" : "plain";

    const styleVariants = {
        plain: 'bg-white',
        hovered: 'bg-purple-200'
    };

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
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [isHovered])

    return (
        <div
            className={clsx("flex flex-row h-12 px-4", styleVariants[variant])}
            ref={elementRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className=" flex items-center justify-center pr-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
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