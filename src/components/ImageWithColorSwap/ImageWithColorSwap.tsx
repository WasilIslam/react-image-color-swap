import React, { useMemo } from "react";

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

type RGB = [number, number, number];

// Cache for processed images
const processedImageCache = new Map<string, string>();

const hexToRgb = (hex: string): RGB => {
  const cleanHex = hex.replace("#", "");
  return [
    parseInt(cleanHex.substr(0, 2), 16),
    parseInt(cleanHex.substr(2, 2), 16),
    parseInt(cleanHex.substr(4, 2), 16),
  ];
};

const processImage = (
  src: string,
  fromColorRGB: RGB,
  toColorRGB: RGB,
  threshold: number
): Promise<string> => {
  // Generate cache key
  const cacheKey = `${src}-${fromColorRGB.join()}-${toColorRGB.join()}-${threshold}`;
  
  // Check cache first
  if (processedImageCache.has(cacheKey)) {
    return Promise.resolve(processedImageCache.get(cacheKey)!);
  }

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.crossOrigin = "Anonymous";

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx?.drawImage(image, 0, 0);

      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (!imageData) return reject('Could not get image data');

      const data = imageData.data;
      const isMatchingColor = (r: number, g: number, b: number): boolean => {
        const [targetR, targetG, targetB] = fromColorRGB;
        const distance = Math.sqrt(
          Math.pow(r - targetR, 2) + 
          Math.pow(g - targetG, 2) + 
          Math.pow(b - targetB, 2)
        );
        return distance < (threshold * 441.67) / 100;
      };

      for (let i = 0; i < data.length; i += 4) {
        if (isMatchingColor(data[i], data[i + 1], data[i + 2])) {
          data[i] = toColorRGB[0];
          data[i + 1] = toColorRGB[1];
          data[i + 2] = toColorRGB[2];
        }
      }

      ctx?.putImageData(imageData, 0, 0);
      const processedSrc = canvas.toDataURL();
      
      // Store in cache
      processedImageCache.set(cacheKey, processedSrc);
      resolve(processedSrc);
    };

    image.onerror = () => reject('Error loading image');
    image.src = src;
  });
};

const ImageWithColorSwap: React.FC<ImageWithColorSwapProps> = ({
  src,
  fromColor,
  toColor,
  threshold = 60,
  alt = "Processed image",
  className,
  style,
  width = 500,
}) => {
  const processedSrc = useMemo(() => {
    const fromColorRGB = hexToRgb(fromColor);
    const toColorRGB = hexToRgb(toColor);
    
    // Start processing and return a placeholder while processing
    processImage(src, fromColorRGB, toColorRGB, threshold)
      .then(newSrc => {
        const img = document.querySelector(`[data-src="${src}"]`) as HTMLImageElement;
        if (img) img.src = newSrc;
      })
      .catch(console.error);

    // Return cached version if available
    const cacheKey = `${src}-${fromColorRGB.join()}-${toColorRGB.join()}-${threshold}`;
    return processedImageCache.get(cacheKey) || src;
  }, [src, fromColor, toColor, threshold]);

  return (
    <div style={{ width: width, aspectRatio: '1' }}>
      <img
        data-src={src}
        src={processedSrc}
        alt={alt}
        className={className}
        style={{ ...style, width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
};

export default ImageWithColorSwap;
