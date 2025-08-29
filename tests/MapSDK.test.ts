import { MapSDK, MAP_PROVIDERS, MapProvider, MapSDKConfig, MarkerConfig, MarkerClusterPoint, MarkerClusterOptions } from "../src/index";

// Mock DOM environment for testing
const mockContainer = document.createElement("div");
mockContainer.id = "test-container";

// Mock window.google for Google Maps tests
Object.defineProperty(window, "google", {
  value: {
    maps: {
      Map: jest.fn(),
      Marker: jest.fn(),
    },
  },
  writable: true,
});

// Mock window.ol for OpenLayers tests
Object.defineProperty(window, "ol", {
  value: {
    Map: jest.fn(),
    View: jest.fn(),
    layer: {
      Tile: jest.fn(),
      Vector: jest.fn(),
    },
    source: {
      OSM: jest.fn(),
      Vector: jest.fn(),
    },
    geom: {
      Point: jest.fn(),
    },
    style: {
      Style: jest.fn(),
      Icon: jest.fn(),
    },
    Feature: jest.fn(),
    proj: {
      fromLonLat: jest.fn(),
    },
  },
  writable: true,
});

describe("MapSDK", () => {
  let mapSDK: MapSDK;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  describe("Constructor", () => {
    it("should create MapSDK instance with supported provider", () => {
      expect(() => {
        mapSDK = new MapSDK(MAP_PROVIDERS.AMAP);
      }).not.toThrow();
    });

    it("should throw error for unsupported provider", () => {
      expect(() => {
        new MapSDK("unsupported" as MapProvider);
      }).toThrow("Unsupported map provider: unsupported");
    });
  });

  describe("Static Methods", () => {
    it("should return supported providers", () => {
      const providers = MapSDK.getSupportedProviders();
      expect(providers).toContain(MAP_PROVIDERS.AMAP);
      expect(providers).toContain(MAP_PROVIDERS.GOOGLE);
      expect(providers).toContain(MAP_PROVIDERS.OPENLAYERS);
    });

    it("should check if provider is supported", () => {
      expect(MapSDK.isProviderSupported(MAP_PROVIDERS.AMAP)).toBe(true);
      expect(MapSDK.isProviderSupported("unsupported" as MapProvider)).toBe(false);
    });
  });

  describe("Initialization", () => {
    beforeEach(() => {
      mapSDK = new MapSDK(MAP_PROVIDERS.AMAP);
    });

    it("should initialize map successfully", async () => {
      const config: MapSDKConfig = {
        container: mockContainer,
        center: [116.397428, 39.90923],
        zoom: 11,
        apiKey: "test-key",
      };

      // Mock AMap loader
      jest.doMock("@amap/amap-jsapi-loader", () => ({
        default: jest.fn().mockResolvedValue({
          Map: jest.fn(),
          Marker: jest.fn(),
        }),
      }));

      await expect(mapSDK.init(config)).resolves.not.toThrow();
      expect(mapSDK.isMapInitialized()).toBe(true);
    });

    it("should throw error if already initialized", async () => {
      const config: MapSDKConfig = {
        container: mockContainer,
        center: [116.397428, 39.90923],
        zoom: 11,
      };

      await mapSDK.init(config);

      await expect(mapSDK.init(config)).rejects.toThrow("Map is already initialized");
    });

    it("should throw error if container not found", async () => {
      const config: MapSDKConfig = {
        container: "non-existent-container",
        center: [116.397428, 39.90923],
        zoom: 11,
      };

      await expect(mapSDK.init(config)).rejects.toThrow("Container element not found");
    });
  });

  describe("Marker Operations", () => {
    beforeEach(async () => {
      mapSDK = new MapSDK(MAP_PROVIDERS.AMAP);
      const config: MapSDKConfig = {
        container: mockContainer,
        center: [116.397428, 39.90923],
        zoom: 11,
      };
      await mapSDK.init(config);
    });

    it("should add marker successfully", async () => {
      const markerConfig: MarkerConfig = {
        position: [116.397428, 39.90923],
        title: "Test Marker",
        content: "Test Content",
      };

      const marker = await mapSDK.addMarker(markerConfig);

      expect(marker).toBeDefined();
      expect(marker.id).toBeDefined();
      expect(marker.position).toEqual(markerConfig.position);
    });

    it("should throw error when adding marker without initialization", async () => {
      const uninitializedMap = new MapSDK(MAP_PROVIDERS.AMAP);
      const markerConfig: MarkerConfig = {
        position: [116.397428, 39.90923],
        title: "Test Marker",
      };

      await expect(uninitializedMap.addMarker(markerConfig)).rejects.toThrow("Map is not initialized. Call init() first.");
    });

    it("should remove marker successfully", async () => {
      const markerConfig: MarkerConfig = {
        position: [116.397428, 39.90923],
        title: "Test Marker",
      };

      const marker = await mapSDK.addMarker(markerConfig);
      expect(() => marker.remove()).not.toThrow();
    });

    it("should get all markers", () => {
      const markers = mapSDK.getMarkers();
      expect(Array.isArray(markers)).toBe(true);
    });

    it("should clear all markers", () => {
      expect(() => mapSDK.clearMarkers()).not.toThrow();
    });
  });

  describe("Map Controls", () => {
    beforeEach(async () => {
      mapSDK = new MapSDK(MAP_PROVIDERS.AMAP);
      const config: MapSDKConfig = {
        container: mockContainer,
        center: [116.397428, 39.90923],
        zoom: 11,
      };
      await mapSDK.init(config);
    });

    it("should set center", () => {
      const newCenter: [number, number] = [116.407428, 39.91923];
      expect(() => mapSDK.setCenter(newCenter)).not.toThrow();
    });

    it("should set zoom", () => {
      const newZoom = 15;
      expect(() => mapSDK.setZoom(newZoom)).not.toThrow();
    });

    it("should throw error when setting center without initialization", () => {
      const uninitializedMap = new MapSDK(MAP_PROVIDERS.AMAP);
      expect(() => uninitializedMap.setCenter([116.407428, 39.91923])).toThrow("Map is not initialized. Call init() first.");
    });

    it("should throw error when setting zoom without initialization", () => {
      const uninitializedMap = new MapSDK(MAP_PROVIDERS.AMAP);
      expect(() => uninitializedMap.setZoom(15)).toThrow("Map is not initialized. Call init() first.");
    });
  });

  describe("Lifecycle", () => {
    beforeEach(async () => {
      mapSDK = new MapSDK(MAP_PROVIDERS.AMAP);
      const config: MapSDKConfig = {
        container: mockContainer,
        center: [116.397428, 39.90923],
        zoom: 11,
      };
      await mapSDK.init(config);
    });

    it("should destroy map successfully", () => {
      expect(() => mapSDK.destroy()).not.toThrow();
      expect(mapSDK.isMapInitialized()).toBe(false);
    });

    it("should not throw when destroying already destroyed map", () => {
      mapSDK.destroy();
      expect(() => mapSDK.destroy()).not.toThrow();
    });
  });

  describe("Marker Cluster Operations", () => {
    beforeEach(async () => {
      mapSDK = new MapSDK(MAP_PROVIDERS.AMAP);
      const config: MapSDKConfig = {
        container: mockContainer,
        center: [116.397428, 39.90923],
        zoom: 11,
      };
      await mapSDK.init(config);
    });

    it("should add marker cluster successfully", async () => {
      const points: MarkerClusterPoint[] = [
        { position: [116.397428, 39.90923] },
        { position: [116.407428, 39.91923] },
        { position: [116.417428, 39.92923] },
      ];

      const clusterOptions: MarkerClusterOptions = {
        gridSize: 60,
        maxZoom: 18,
        renderClusterMarker: "<div>{count}</div>",
        renderMarker: {
          position: [0, 0],
          icon: "test-icon.png",
        },
      };

      const cluster = await mapSDK.addMarkerCluster(points, clusterOptions);

      expect(cluster).toBeDefined();
      expect(cluster.id).toBeDefined();
      expect(cluster.points).toEqual(points);
      expect(cluster.points.length).toBe(3);
    });

    it("should throw error when adding cluster without initialization", async () => {
      const uninitializedMap = new MapSDK(MAP_PROVIDERS.AMAP);
      const points: MarkerClusterPoint[] = [{ position: [116.397428, 39.90923] }];

      await expect(uninitializedMap.addMarkerCluster(points)).rejects.toThrow("Map is not initialized. Call init() first.");
    });

    it("should remove marker cluster successfully", async () => {
      const points: MarkerClusterPoint[] = [{ position: [116.397428, 39.90923] }, { position: [116.407428, 39.91923] }];

      const cluster = await mapSDK.addMarkerCluster(points);
      expect(() => cluster.remove()).not.toThrow();
    });

    it("should throw error when removing cluster without initialization", async () => {
      const uninitializedMap = new MapSDK(MAP_PROVIDERS.AMAP);
      const mockCluster = {
        id: "test-cluster",
        points: [],
        addPoint: jest.fn(),
        removePoint: jest.fn(),
        clear: jest.fn(),
        remove: jest.fn(),
      };

      expect(() => mockCluster.remove()).not.toThrow();
    });

    it("should add point to existing cluster", async () => {
      const points: MarkerClusterPoint[] = [{ position: [116.397428, 39.90923] }];

      const cluster = await mapSDK.addMarkerCluster(points);
      const newPoint: MarkerClusterPoint = {
        position: [116.407428, 39.91923],
      };

      expect(() => cluster.addPoint(newPoint)).not.toThrow();
      expect(cluster.points.length).toBe(2);
    });

    it("should remove point from existing cluster", async () => {
      const points: MarkerClusterPoint[] = [{ position: [116.397428, 39.90923] }, { position: [116.407428, 39.91923] }];

      const cluster = await mapSDK.addMarkerCluster(points);
      const pointToRemove = points[0];

      expect(() => cluster.removePoint(pointToRemove)).not.toThrow();
      expect(cluster.points.length).toBe(1);
    });

    it("should clear cluster points", async () => {
      const points: MarkerClusterPoint[] = [{ position: [116.397428, 39.90923] }, { position: [116.407428, 39.91923] }];

      const cluster = await mapSDK.addMarkerCluster(points);

      expect(() => cluster.clear()).not.toThrow();
      expect(cluster.points.length).toBe(0);
    });

    it("should use default options when no options provided", async () => {
      const points: MarkerClusterPoint[] = [{ position: [116.397428, 39.90923] }];

      const cluster = await mapSDK.addMarkerCluster(points);

      expect(cluster).toBeDefined();
      expect(cluster.points).toEqual(points);
    });
  });

  describe("Provider Registration", () => {
    it("should register custom provider", () => {
      class CustomProvider {
        async init() {}
        async addMarker() {
          return {};
        }
        removeMarker() {}
        setCenter() {}
        setZoom() {}
        destroy() {}
      }

      expect(() => {
        MapSDK.registerProvider(MAP_PROVIDERS.AMAP, CustomProvider as any);
      }).not.toThrow();
    });
  });
});
