import { __assign } from 'tslib';
import React, { useMemo } from 'react';

// Cache for processed images
var processedImageCache = new Map();
var hexToRgb = function (hex) {
    var cleanHex = hex.replace("#", "");
    return [
        parseInt(cleanHex.substr(0, 2), 16),
        parseInt(cleanHex.substr(2, 2), 16),
        parseInt(cleanHex.substr(4, 2), 16),
    ];
};
var processImage = function (src, fromColorRGB, toColorRGB, threshold) {
    // Generate cache key
    var cacheKey = "".concat(src, "-").concat(fromColorRGB.join(), "-").concat(toColorRGB.join(), "-").concat(threshold);
    // Check cache first
    if (processedImageCache.has(cacheKey)) {
        return Promise.resolve(processedImageCache.get(cacheKey));
    }
    return new Promise(function (resolve, reject) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var image = new Image();
        image.crossOrigin = "Anonymous";
        image.onload = function () {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(image, 0, 0);
            var imageData = ctx === null || ctx === void 0 ? void 0 : ctx.getImageData(0, 0, canvas.width, canvas.height);
            if (!imageData)
                return reject('Could not get image data');
            var data = imageData.data;
            var isMatchingColor = function (r, g, b) {
                var targetR = fromColorRGB[0], targetG = fromColorRGB[1], targetB = fromColorRGB[2];
                var distance = Math.sqrt(Math.pow(r - targetR, 2) +
                    Math.pow(g - targetG, 2) +
                    Math.pow(b - targetB, 2));
                return distance < (threshold * 441.67) / 100;
            };
            for (var i = 0; i < data.length; i += 4) {
                if (isMatchingColor(data[i], data[i + 1], data[i + 2])) {
                    data[i] = toColorRGB[0];
                    data[i + 1] = toColorRGB[1];
                    data[i + 2] = toColorRGB[2];
                }
            }
            ctx === null || ctx === void 0 ? void 0 : ctx.putImageData(imageData, 0, 0);
            var processedSrc = canvas.toDataURL();
            // Store in cache
            processedImageCache.set(cacheKey, processedSrc);
            resolve(processedSrc);
        };
        image.onerror = function () { return reject('Error loading image'); };
        image.src = src;
    });
};
var ImageWithColorSwap = function (_a) {
    var src = _a.src, fromColor = _a.fromColor, toColor = _a.toColor, _b = _a.threshold, threshold = _b === void 0 ? 60 : _b, _c = _a.alt, alt = _c === void 0 ? "Processed image" : _c, className = _a.className, style = _a.style, _d = _a.width, width = _d === void 0 ? 500 : _d;
    var processedSrc = useMemo(function () {
        var fromColorRGB = hexToRgb(fromColor);
        var toColorRGB = hexToRgb(toColor);
        // Start processing and return a placeholder while processing
        processImage(src, fromColorRGB, toColorRGB, threshold)
            .then(function (newSrc) {
            var img = document.querySelector("[data-src=\"".concat(src, "\"]"));
            if (img)
                img.src = newSrc;
        })
            .catch(console.error);
        // Return cached version if available
        var cacheKey = "".concat(src, "-").concat(fromColorRGB.join(), "-").concat(toColorRGB.join(), "-").concat(threshold);
        return processedImageCache.get(cacheKey) || src;
    }, [src, fromColor, toColor, threshold]);
    return (React.createElement("div", { style: { width: width, aspectRatio: '1' } },
        React.createElement("img", { "data-src": src, src: processedSrc, alt: alt, className: className, style: __assign(__assign({}, style), { width: '100%', height: '100%', objectFit: 'contain' }) })));
};

export { ImageWithColorSwap };
//# sourceMappingURL=index.esm.js.map
