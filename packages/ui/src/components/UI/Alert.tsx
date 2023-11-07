import { ReactNode } from "react";
import clsx from "clsx";

import ExclamationCircle from "@/assets/images/icons/exclamation-circle";

const alertVariants = {
    info: {
        style: "text-primary-light bg-background",
        icon: <ExclamationCircle className="w-6 h-6" />,
    },
    'info-white': {
        style: "bg-white shadow-xl",
        icon: <ExclamationCircle className="w-6 h-6" />,
    },
};

interface AlertProps {
    style: keyof typeof alertVariants;
    children: ReactNode;
    title?: string;
    maxWidth?: number;
}

export default function Alert({ style, children, title, maxWidth }: AlertProps) {

    const variant = alertVariants[style];


    return (
        <div
            className={clsx(
                "text-sm  p-4 rounded flex gap-4 w-full",
                variant.style,
            )}
            style={{ maxWidth }}
        >
            <div className="w-6">
                {variant.icon}
            </div>
            <div>
                {title && <h3 className="font-bold mb-2">{title}</h3>}
                <div className="flex flex-col gap-2 text-primary-light">
                    {children}
                </div>
            </div>
        </div>
    );
}