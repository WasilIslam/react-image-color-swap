import React from "react";
interface ImageWithColorSwapProps {
    src: string;
    fromColor: string;
    toColor: string;
    threshold?: number;
    alt?: string;
    className?: string;
    style?: React.CSSProperties;
    width?: number;
}
declare const ImageWithColorSwap: React.FC<ImageWithColorSwapProps>;
export default ImageWithColorSwap;
