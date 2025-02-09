import React, { useRef, useState, useEffect } from 'react';

var ImageWithColorSwap = function (_a) {
    var src = _a.src, fromColor = _a.fromColor, toColor = _a.toColor, _b = _a.threshold, threshold = _b === void 0 ? 60 : _b, _c = _a.alt, alt = _c === void 0 ? "Processed image" : _c, className = _a.className, style = _a.style, _d = _a.loadingElement, loadingElement = _d === void 0 ? React.createElement("p", null, "...") : _d;
    var canvasRef = useRef(null);
    var _e = useState(null), processedSrc = _e[0], setProcessedSrc = _e[1];
    var _f = useState(true), isLoading = _f[0], setIsLoading = _f[1];
    var hexToRgb = function (hex) {
        var cleanHex = hex.replace("#", "");
        return [parseInt(cleanHex.substr(0, 2), 16), parseInt(cleanHex.substr(2, 2), 16), parseInt(cleanHex.substr(4, 2), 16)];
    };
    var _g = [hexToRgb(fromColor), hexToRgb(toColor)], fromColorRGB = _g[0], toColorRGB = _g[1];
    useEffect(function () {
        if (!src)
            return;
        setIsLoading(true);
        var image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = src;
        image.onload = function () {
            var canvas = canvasRef.current;
            if (!canvas)
                return;
            var ctx = canvas.getContext("2d");
            if (!ctx)
                return;
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var data = imageData.data;
            var isMatchingColor = function (r, g, b) {
                var targetR = fromColorRGB[0], targetG = fromColorRGB[1], targetB = fromColorRGB[2];
                var distance = Math.sqrt(Math.pow(r - targetR, 2) + Math.pow(g - targetG, 2) + Math.pow(b - targetB, 2));
                return distance < (threshold * 441.67) / 100;
            };
            for (var i = 0; i < data.length; i += 4) {
                var r = data[i];
                var g = data[i + 1];
                var b = data[i + 2];
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
        image.onerror = function () {
            console.error("Error loading image");
            setIsLoading(false);
        };
        return function () {
            image.onload = null;
            image.onerror = null;
        };
    }, [src, fromColorRGB, toColorRGB, threshold]);
    return (React.createElement(React.Fragment, null,
        React.createElement("canvas", { ref: canvasRef, style: { display: "none" } }),
        isLoading ? loadingElement : processedSrc && (React.createElement("img", { src: processedSrc, alt: alt, className: className, style: style }))));
};

export { ImageWithColorSwap };
//# sourceMappingURL=index.esm.js.map
