import ArrowUpRight from "@/assets/images/icons/arrow-up-right";
import Link from "next/link";
import React, { ReactElement, ReactNode, SVGProps } from "react";
import Image from "next/image";

interface ButtonProps {
    href?: string;
    children: string;
    icon?: string | React.ComponentType<SVGProps<SVGSVGElement>>;
    onClick?: () => void;
}

export default function Button({ href, children, icon, onClick }: ButtonProps) {
    const IconComponent = icon;
    let image;

    if (IconComponent && typeof IconComponent != 'string') image = <IconComponent className="h-4 w-4 " />


    let button = (
        <div className="text-sm gap-2 items-center border-b inline-flex text-secondary hover:text-secondary-light cursor-pointer" onClick={onClick}>
            <span>{children}</span>
            {image && image}
            {/* {icon instanceof Function? <icon className="h-4 w-4" /> : null} */}
        </div>
    );

    if (href) button = (<Link href={href}>{button}</Link>)

    return (
        button
    );
};