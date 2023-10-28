import ArrowUpRight from "@/assets/images/icons/arrow-up-right";
import Link from "next/link";
import React, { ReactElement, ReactNode, SVGProps } from "react";
import Image from "next/image";
import clsx from "clsx";


interface ButtonProps {
    href?: string;
    target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target'],
    children: string;
    icon?: string | React.ComponentType<SVGProps<SVGSVGElement>>;
    onClick?: () => void;
    style: keyof typeof buttonStyleVariants;
    stretch?: boolean;
    disabled?: boolean;
}

const buttonStyleVariants = {
    underline: 'border-b border-current inline-flex text-secondary hover:text-secondary-light',
    primary: 'rounded-md bg-primary px-3 py-1.5 font-semibold leading-6 text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
};

export default function Button({ href, target, children, icon, onClick, style, stretch, disabled }: ButtonProps) {
    const IconComponent = icon;
    let image;

    if (IconComponent && typeof IconComponent != 'string') image = <IconComponent className="h-4 w-4" />




    let buttonElement = (
        <button
            className={clsx(
                "text-sm gap-2 items-center cursor-pointer flex",
                buttonStyleVariants[style],
                stretch && "w-full justify-center",
                disabled && "pointer-events-none"
            )}
            onClick={onClick}
            disabled={disabled}
        >
            <span>{children}</span>
            {image && image}
            {/* {icon instanceof Function? <icon className="h-4 w-4" /> : null} */}
        </button>
    );

    if (href) buttonElement = (
        <Link
            href={href}
            target={target}
            className={clsx(
                "inline-block",
                disabled && "pointer-events-none "
            )}
        >
            {buttonElement}
        </Link>
    );

    return (
        <div className={clsx("inline-block", disabled && "cursor-not-allowed opacity-70")}>
            {buttonElement}
        </div>
    );
};