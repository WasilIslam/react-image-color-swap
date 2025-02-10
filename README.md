# react-image-color-swap

A lightweight React component for real-time image color manipulation. Easily replace any color in your images with another color.

## Installation

```bash
npm install react-image-color-swap
```

## ImageWithColorSwap Component

A versatile component that lets you replace any color in an image with another color in real-time. Perfect for:
- Changing brand colors in logos
- Adjusting UI elements to match your theme
- Creating color variations of icons
- Experimenting with different color schemes

### Try it Live! 
🎨 [Try the color swapping tool online](https://cuthours.vercel.app/tools/image-color-change)

### Example

![Color Swap Example](https://iili.io/2bub95X.md.png)

```tsx
import { ImageWithColorSwap } from 'react-image-color-swap';

function App() {
  return (
    <ImageWithColorSwap
      src="path/to/image.png"
      width={200}
      fromColor="#ff0000"  // The color you want to replace
      toColor="#00ff00"    // The new color
      threshold={60}       // How strict the color matching should be
      alt="Color swapped image"
      style={{ marginRight: '10px' }}
    />
  );
}
```

### How It Works

1. **Color Detection**: The component analyzes each pixel of your image
2. **Smart Matching**: Uses a sophisticated color-matching algorithm with adjustable threshold
3. **Real-time Processing**: Changes happen instantly as you adjust parameters
4. **Preserves Quality**: Maintains image quality while changing colors

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| src | string | required | URL of the image to process |
| fromColor | string | required | Original color to replace (hex format, e.g., "#ff0000") |
| toColor | string | required | New color to apply (hex format, e.g., "#00ff00") |
| threshold | number | 60 | Color matching sensitivity (0-100). Higher values match more shades of the color |
| alt | string | "Processed image" | Alt text for accessibility |
| className | string | undefined | Custom CSS class name |
| style | CSSProperties | undefined | Inline CSS styles |
| width | number | 500 | Width of the container in pixels |

### Usage Tips

1. **Color Matching**:
   - Use lower threshold (20-40) for exact color matches
   - Use higher threshold (60-80) to include similar shades
   - Experiment with values to get the best results

2. **Performance**:
   - Component automatically handles image loading
   - Processing happens on the client side
   - Results are cached for better performance

3. **Examples**:
   ```tsx
   // Basic usage with width
   <ImageWithColorSwap
     src="logo.png"
     fromColor="#ff0000"
     toColor="#00ff00"
     threshold={30}
     width={400}
   />

   // With custom styling
   <ImageWithColorSwap
     src="logo.png"
     fromColor="#ff0000"
     toColor="#00ff00"
     threshold={70}
     width={600}
     style={{ border: '1px solid #ccc' }}
   />
   ```

## Features

- 🎨 Replace any color with any other color
- 🔧 Adjustable color matching sensitivity
- 🎯 Precise color targeting
- ⚡ Real-time processing
- 📱 Responsive design
- 🖼️ Preserves image quality
- ♿ Accessibility friendly

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build
```

## License

ISC © Muhammad Wasil Islam

---

Try the live demo at [Color Swap Tool](https://cuthours.vercel.app/tools/image-color-change) to see it in action!
