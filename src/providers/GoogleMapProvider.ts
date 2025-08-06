import { BaseMapProvider } from "./BaseMapProvider";
import { IMarker, MapConfig, MarkerConfig, MarkerClusterPoint, MarkerClusterOptions, IMarkerCluster } from "../types";
import { createDivContent } from "../utils";
import { Loader } from "@googlemaps/js-api-loader";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

interface GoogleMarker extends IMarker {
  googleMarker: any;
}

interface GoogleMarkerCluster extends IMarkerCluster {
  markerClusterer: any;
  googleMarkers: any[];
}

export class GoogleMapProvider extends BaseMapProvider {
  private google: any;

  /**
   * 动态加载Google Maps SDK
   * @param key Google Maps API密钥
   */
  private async loadGoogleMapsSDK(key?: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // 检查是否已经加载
      if (window.google && window.google.maps) {
        resolve();
        return;
      }
      const loader = new Loader({
        apiKey: key || "",
      });

      await loader.load();
      resolve();
    });
  }

  async init(config: MapConfig): Promise<void> {
    this.config = config;

    // 动态加载Google Maps SDK
    if (typeof window !== "undefined" && !this.google) {
      try {
        // 检查是否已经加载了Google Maps SDK
        if (!window.google || !window.google.maps) {
          await this.loadGoogleMapsSDK(config.key);
        }
        this.google = window.google;
      } catch (error) {
        throw new Error(`Failed to load Google Maps SDK: ${error}`);
      }
    }

    const container = typeof config.container === "string" ? document.getElementById(config.container) : config.container;

    if (!container) {
      throw new Error("Container element not found");
    }

    const { Map } = await this.google.maps.importLibrary("maps");
    this.map = new Map(container, {
      center: {
        lat: Number(config.center?.[1]) || 39.90923,
        lng: Number(config.center?.[0]) || 116.397428,
      },
      zoom: config.zoom || 11,
      mapId: config.id,
    });
  }

  setCenter(position: [number, number]): void {
    if (this.map) {
      this.map.setCenter({
        lat: position[1],
        lng: position[0],
      });
    }
  }

  setZoom(zoom: number): void {
    if (this.map) {
      this.map.setZoom(zoom);
    }
  }

  destroy(): void {
    if (this.map) {
      // Google Maps doesn't have a destroy method
      // Just clear the map reference
      this.map = null;
    }
    this.clearMarkers();
    this.clearMarkerClusters();
  }

  async addMarker(config: MarkerConfig): Promise<IMarker> {
    console.log(`%c yqm log, config::: `, "color: pink;", config);
    if (!this.map) {
      throw new Error("Map not initialized");
    }

    const markerId = this.generateMarkerId();

    const { position, ...otherConfig } = config;
    const { AdvancedMarkerElement } = await this.google.maps.importLibrary("marker");
    const googleMarker = new AdvancedMarkerElement({
      position: {
        lat: position[1],
        lng: position[0],
      },
      title: config.title,
      // icon: config.icon,
      // clickable: config.clickable !== false,
      // draggable: config.draggable || false,
      map: this.map,
      content: createDivContent(config.content || ""),
      // ...otherConfig,
    });
    console.log(`%c yqm log, googleMarker::: `, "color: pink;", googleMarker);

    const marker: GoogleMarker = {
      id: markerId,
      position: config.position,
      googleMarker,
      setPosition: (position: [number, number]) => {
        googleMarker.setPosition({
          lat: position[1],
          lng: position[0],
        });
        marker.position = position;
      },
      setTitle: (title: string) => {
        googleMarker.setTitle(title);
      },
      setContent: (content: string) => {
        // Google Maps markers don't have a direct setContent method
        // You might want to use InfoWindow instead
        console.warn("setContent is not supported for Google Maps markers");
      },
      remove: () => {
        googleMarker.setMap(null);
        this.removeMarkerFromCollection(markerId);
      },
    };

    this.addMarkerToCollection(marker);
    return marker;
  }

  async addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<any> {
    if (!this.map) {
      throw new Error("Map not initialized");
    }

    const clusterId = this.generateClusterId();
    const defaultOptions: MarkerClusterOptions = {
      gridSize: 60,
      maxZoom: 18,
      renderClusterMarker:
        '<div style="background-color: #ff6b6b; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold;">{count}</div>',
      renderMarker: {
        position: [0, 0], // 占位符，实际位置会从 point 中获取
        icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
      },
      ...options,
    };

    // 创建标记点数组
    const markers: any[] = [];
    points.forEach((point, index) => {
      const { position: _, ...renderMarkerConfig } = defaultOptions.renderMarker!;
      let { position: pointPosition, ...pointConfig } = point;
      if (!pointPosition) {
        pointPosition = points[index].position;
      }
      const marker = this.addMarker({
        position: [Number(pointPosition[1]), Number(pointPosition[0])],
        map: this.map,
        ...renderMarkerConfig,
        ...pointConfig,
      });
      markers.push(marker);
    });

    // 创建聚合器
    // let markerClusterer: any;
    // if ((window as any)["markerClusterer"] && (window as any)["markerClusterer"].MarkerClusterer) {
    //   // 某些CDN小写
    //   markerClusterer = new (window as any)["markerClusterer"].MarkerClusterer({
    //     map: this.map,
    //     markers: markers,
    //     gridSize: defaultOptions.gridSize,
    //     maxZoom: defaultOptions.maxZoom,
    //     renderer: {
    //       render: ({ count, position }: any) => {
    //         const div = document.createElement("div");
    //         div.innerHTML = defaultOptions.renderClusterMarker!.replace("{count}", count.toString());
    //         const element = div.firstChild as HTMLElement;
    //         element.style.position = "absolute";
    //         element.style.transform = "translate(-50%, -50%)";
    //         return element;
    //       },
    //     },
    //   });
    // } else if ((window as any)["markerClusterer"] && typeof (window as any)["markerClusterer"] === "function") {
    //   markerClusterer = new (window as any)["markerClusterer"]({
    //     map: this.map,
    //     markers: markers,
    //     gridSize: defaultOptions.gridSize,
    //     maxZoom: defaultOptions.maxZoom,
    //     renderer: {
    //       render: ({ count, position }: any) => {
    //         const div = document.createElement("div");
    //         div.innerHTML = defaultOptions.renderClusterMarker!.replace("{count}", count.toString());
    //         const element = div.firstChild as HTMLElement;
    //         element.style.position = "absolute";
    //         element.style.transform = "translate(-50%, -50%)";
    //         return element;
    //       },
    //     },
    //   });
    // } else {
    //   throw new Error("MarkerClusterer is not loaded.");
    // }

    const markerCluster = new MarkerClusterer({
      markers,
      map: this.map,
    });

    // const markerCluster: GoogleMarkerCluster = {
    //   id: clusterId,
    //   points: [...points],
    //   markerClusterer,
    //   googleMarkers: markers,
    //   addPoint: (point: MarkerClusterPoint) => {
    //     const { position: _, ...renderMarkerConfig } =
    //       defaultOptions.renderMarker!;
    //     const { position: pointPosition, ...pointConfig } = point;
    //     const marker = this.addMarker({
    //       position: [pointPosition[1], pointPosition[0]],
    //       map: this.map,
    //       ...renderMarkerConfig,
    //       ...pointConfig,
    //     });
    //     markers.push(marker);
    //     markerCluster.points.push(point);
    //     markerClusterer.addMarker(marker);
    //   },
    //   removePoint: (point: MarkerClusterPoint) => {
    //     const index = markerCluster.points.findIndex(
    //       (p) =>
    //         p.position[0] === point.position[0] &&
    //         p.position[1] === point.position[1]
    //     );
    //     if (index !== -1) {
    //       const marker = markers[index];
    //       markerClusterer.removeMarker(marker);
    //       markers.splice(index, 1);
    //       markerCluster.points.splice(index, 1);
    //     }
    //   },
    //   clear: () => {
    //     markers.forEach((marker) => markerClusterer.removeMarker(marker));
    //     markers.length = 0;
    //     markerCluster.points.length = 0;
    //   },
    //   remove: () => {
    //     markerClusterer.clearMarkers();
    //     this.removeClusterFromCollection(clusterId);
    //   },
    // };

    // this.addClusterToCollection(markerCluster);

    // return markerCluster;
  }

  removeMarker(marker: IMarker): void {
    const googleMarker = (marker as GoogleMarker).googleMarker;
    if (googleMarker) {
      googleMarker.setMap(null);
      this.removeMarkerFromCollection(marker.id);
    }
  }

  removeMarkerCluster(cluster: IMarkerCluster): void {
    const markerClusterer = (cluster as GoogleMarkerCluster).markerClusterer;
    if (markerClusterer) {
      markerClusterer.clearMarkers();
      this.removeClusterFromCollection(cluster.id);
    }
  }

  removeMarkerFromCollection(markerId: string): void {
    this.markers.delete(markerId);
  }

  addMarkerToCollection(marker: GoogleMarker): void {
    this.markers.set(marker.id, marker);
  }

  generateMarkerId(): string {
    return `marker_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  generateClusterId(): string {
    return `cluster_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  addClusterToCollection(cluster: GoogleMarkerCluster): void {
    this.markerClusters.set(cluster.id, cluster);
  }

  removeClusterFromCollection(clusterId: string): void {
    this.markerClusters.delete(clusterId);
  }
}

// 扩展window对象以包含Google Maps和MarkerClusterer
declare global {
  interface Window {
    google?: {
      maps: any;
    };
    MarkerClusterer?: any;
  }
}
