import React, { SVGProps } from "react";
import clsx from "clsx";
import Link from "next/link";

import CircleLoader from "./CircleLoader/CircleLoader";

interface ButtonProps {
    href?: string;
    target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target'],
    children: string;
    icon?: string | React.ComponentType<SVGProps<SVGSVGElement>>;
    onClick?: () => void;
    style: keyof typeof buttonStyleVariants;
    stretch?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
}

const buttonStyleVariants = {
    underline: 'border-b border-current inline-flex text-secondary hover:text-secondary-light',
    primary: 'rounded-md bg-primary px-3 py-1.5 font-semibold leading-6 text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
};

export default function Button({ href, target, children, icon, onClick, style, stretch, disabled, isLoading }: ButtonProps) {
    const IconComponent = icon;
    const isDisabled = isLoading || disabled;

    let image;

    if (IconComponent && typeof IconComponent != 'string') image = <IconComponent className="h-4 w-4" />

    if (isLoading) image = <CircleLoader
        className="h-4 w-4"
        variant="white"
    />;


    let buttonElement = (
        <button
            className={clsx(
                "text-sm gap-2 items-center cursor-pointer flex ",
                buttonStyleVariants[style],
                stretch && "w-full justify-center",
                isDisabled && "pointer-events-none"
            )}
            onClick={onClick}
            disabled={isDisabled}
        >
            <span>{children}</span>
            {image && image}
        </button>
    );

    if (href) buttonElement = (
        <Link
            href={href}
            target={target}
            className={clsx(
                "inline-block",
                isDisabled && "pointer-events-none"
            )}
        >
            {buttonElement}
        </Link>
    );

    return (
        <div className={clsx("inline-block", isDisabled && "cursor-not-allowed opacity-70")}>
            {buttonElement}
        </div>
    );
};