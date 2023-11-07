import { SVGProps } from 'react';
import clsx from 'clsx';

import styles from './CircleLoader.module.css';

const circleLoaderVariants = {
    primary: {
        circle: "stroke-secondary",
        bg: "stroke-background-secondary"
    },
    white: {
        circle: "stroke-white",
        bg: "stroke-none",
    }
};
interface CircleLoaderProps extends SVGProps<SVGSVGElement> {
    variant?: keyof typeof circleLoaderVariants;
}

export default function CircleLoader({ className, variant = 'primary', ...props }: CircleLoaderProps) {
    return (
        <svg className={clsx(styles.circularLoader, className)} viewBox="25 25 50 50" {...props}>
            <circle className={clsx(styles.loaderPathBg, circleLoaderVariants[variant].bg)} cx="50" cy="50" r="20" fill="none"></circle>
            <circle className={clsx(styles.loaderPath, circleLoaderVariants[variant].circle)} cx="50" cy="50" r="20" fill="none"></circle>
        </svg>
    );
}