import React, { ReactNode } from "react"
import ContentLoader from "react-content-loader"

interface SkeletonLoaderProps {
    width: number | string;
    height: number | string;
    children?: ReactNode;
    isLoading?: boolean;
}

export default function SkeletonLoader({ width, height, children, isLoading }: SkeletonLoaderProps) {
    
    if (isLoading === false) return children;

    return (
        <ContentLoader
            speed={2}
            width={width}
            height={height}
            // viewBox={`0 0 ${width} ${height}`}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
        </ContentLoader>
    );
}

