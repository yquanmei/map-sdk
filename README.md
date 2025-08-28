# Map SDK

A unified map SDK that supports multiple map providers (AMap, Google Maps, OpenLayers, etc.)

## Installation

```bash
npm install map-sdk
```

## CSS Import

The SDK includes CSS files that need to be imported for proper styling:

### Method 1: Import CSS in your main CSS file

```css
@import "map-sdk/dist/index.css";
```

### Method 2: Import CSS in your JavaScript/TypeScript

```typescript
import "map-sdk/dist/index.css";
```

### Method 3: Include CSS in HTML

```html
<link rel="stylesheet" href="node_modules/map-sdk/dist/index.css" />
```

## Usage

```typescript
import { MapSDK, MapProvider } from "map-sdk";

// Initialize map
const mapSDK = new MapSDK();
await mapSDK.init({
  container: "map-container",
  provider: MapProvider.GOOGLE,
  center: [116.397428, 39.90923],
  zoom: 11,
  apiKey: "your-api-key",
});

// Add marker
await mapSDK.addMarker({
  position: [116.397428, 39.90923],
  title: "Beijing",
});
```

## Build Output

- `dist/index.js` - ES module format
- `dist/index.cjs` - CommonJS format
- `dist/index.css` - Bundled CSS styles
- `dist/index.d.ts` - TypeScript definitions

## Development

```bash
npm run dev    # Watch mode
npm run build  # Production build
npm run test   # Run tests
npm run lint   # Lint code
```
