import React from "react";
interface ImageWithColorSwapProps {
    src: string;
    fromColor: string;
    toColor: string;
    threshold?: number;
    alt?: string;
    className?: string;
    style?: React.CSSProperties;
    loadingElement?: React.ReactNode;
}
declare const ImageWithColorSwap: React.FC<ImageWithColorSwapProps>;
export default ImageWithColorSwap;
