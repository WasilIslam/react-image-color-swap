import React from "react";
import { useEffect, useRef, useState } from "react";

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

type RGB = [number, number, number];

const ImageWithColorSwap: React.FC<ImageWithColorSwapProps> = ({ 
  src, 
  fromColor, 
  toColor, 
  threshold = 60, 
  alt = "Processed image",
  className,
  style,
  loadingElement = <p>...</p>
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hexToRgb = (hex: string): RGB => {
    const cleanHex = hex.replace("#", "");
    return [parseInt(cleanHex.substr(0, 2), 16), parseInt(cleanHex.substr(2, 2), 16), parseInt(cleanHex.substr(4, 2), 16)];
  };

  const [fromColorRGB, toColorRGB]: [RGB, RGB] = [hexToRgb(fromColor), hexToRgb(toColor)];

  useEffect(() => {
    if (!src) return;

    setIsLoading(true);
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = src;

    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const isMatchingColor = (r: number, g: number, b: number): boolean => {
        const [targetR, targetG, targetB] = fromColorRGB;
        const distance = Math.sqrt(Math.pow(r - targetR, 2) + Math.pow(g - targetG, 2) + Math.pow(b - targetB, 2));
        return distance < (threshold * 441.67) / 100;
      };

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (isMatchingColor(r, g, b)) {
          data[i] = toColorRGB[0];
          data[i + 1] = toColorRGB[1];
          data[i + 2] = toColorRGB[2];
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessedSrc(canvas.toDataURL());
      setIsLoading(false);
    };

    image.onerror = () => {
      console.error("Error loading image");
      setIsLoading(false);
    };

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [src, fromColorRGB, toColorRGB, threshold]);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {isLoading ? loadingElement : processedSrc && (
        <img 
          src={processedSrc} 
          alt={alt}
          className={className}
          style={style}
        />
      )}
    </>
  );
};

export default ImageWithColorSwap;
