# Map SDK

A unified map SDK that supports multiple map providers (AMap, Google Maps, OpenLayers, etc.)

## Installation

```bash
npm install map-sdk
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

