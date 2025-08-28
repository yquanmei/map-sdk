import { BaseMapProvider } from "./BaseMapProvider";
import {
  IMarker,
  MapConfig,
  MarkerConfig,
  MarkerClusterPoint,
  MarkerClusterOptions,
  IMarkerCluster,
  PolygonConfig,
  IPolygon,
  AnimationConfig,
  IAnimation,
  CoveringType,
} from "../types";

interface AMapMarker extends IMarker {
  amapMarker: any;
}

interface AMapMarkerCluster extends IMarkerCluster {
  amapCluster: any;
  amapMarkers: any[];
}

export class AMapProvider extends BaseMapProvider {
  private AMap: any;

  /**
   * 动态加载高德地图SDK
   * @param apiKey 高德地图API密钥
   */
  private async loadAMapSDK(apiKey?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // 检查是否已经加载
      if (window.AMap) {
        resolve();
        return;
      }

      // 创建script标签
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${apiKey || ""}&plugin=AMap.Marker,AMap.MarkerCluster`;
      script.async = true;
      script.defer = true;

      // 加载成功回调
      script.onload = () => {
        if (window.AMap) {
          resolve();
        } else {
          reject(new Error("AMap SDK failed to load"));
        }
      };

      // 加载失败回调
      script.onerror = () => {
        reject(new Error("Failed to load AMap SDK"));
      };

      // 添加到页面
      document.head.appendChild(script);
    });
  }

  async init(config: MapConfig): Promise<void> {
    this.config = config;

    // 动态加载高德地图SDK
    if (typeof window !== "undefined" && !this.AMap) {
      try {
        // 检查是否已经加载了高德地图SDK
        if (!window.AMap) {
          // 动态加载高德地图SDK
          await this.loadAMapSDK(config.apiKey);
        }
        this.AMap = window.AMap;
      } catch (error) {
        throw new Error(`Failed to load AMap SDK: ${error}`);
      }
    }

    const container = typeof config.container === "string" ? document.getElementById(config.container) : config.container;

    if (!container) {
      throw new Error("Container element not found");
    }

    this.map = new this.AMap.Map(container, {
      center: config.center || [116.397428, 39.90923],
      zoom: config.zoom || 11,
      ...config,
    });
  }

  async addMarker(config: MarkerConfig): Promise<IMarker> {
    if (!this.map) {
      throw new Error("Map not initialized");
    }

    const markerId = this.generateId(CoveringType.MARKER);

    const { position, ...otherConfig } = config;
    const amapMarker = new this.AMap.Marker({
      position,
      title: config.title,
      content: config.content,
      icon: config.icon,
      clickable: config.clickable !== false,
      draggable: config.draggable || false,
      ...otherConfig,
    });

    this.map.add(amapMarker);

    const marker: AMapMarker = {
      id: markerId,
      position: config.position,
      amapMarker,
      setPosition: (position: [number, number]) => {
        amapMarker.setPosition(position);
        marker.position = position;
      },
      setTitle: (title: string) => {
        amapMarker.setTitle(title);
      },
      setContent: (content: string) => {
        amapMarker.setContent(content);
      },
      remove: () => {
        this.map.remove(amapMarker);
        this.removeMarkerFromCollection(markerId);
      },
    };

    this.addMarkerToCollection(marker);
    return marker;
  }

  async addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster> {
    if (!this.map) {
      throw new Error("Map not initialized");
    }

    const clusterId = this.generateId(CoveringType.CLUSTER);
    const defaultOptions: MarkerClusterOptions = {
      gridSize: 60,
      maxZoom: 18,
      renderClusterMarker:
        '<div style="background-color: #ff6b6b; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold;">{count}</div>',
      renderMarker: {
        position: [0, 0], // 占位符，实际位置会从 point 中获取
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
      },
      ...options,
    };

    // 创建标记点数组
    const markers: any[] = [];
    points.forEach((point) => {
      const { position: _, ...renderMarkerConfig } = defaultOptions.renderMarker!;
      const { position: pointPosition, ...pointConfig } = point;
      const marker = new this.AMap.Marker({
        position: pointPosition,
        ...renderMarkerConfig,
        ...pointConfig,
      });
      markers.push(marker);
    });

    // 创建聚合插件
    const cluster = new this.AMap.MarkerCluster(this.map, markers, {
      gridSize: defaultOptions.gridSize,
      maxZoom: defaultOptions.maxZoom,
      renderClusterMarker: (context: any) => {
        const count = context.count;
        const div = document.createElement("div");
        div.innerHTML = defaultOptions.renderClusterMarker!.replace("{count}", count.toString());
        return div.firstChild as HTMLElement;
      },
    });

    const markerCluster: AMapMarkerCluster = {
      id: clusterId,
      points: [...points],
      amapCluster: cluster,
      amapMarkers: markers,
      addPoint: (point: MarkerClusterPoint) => {
        const { position: _, ...renderMarkerConfig } = defaultOptions.renderMarker!;
        const { position: pointPosition, ...pointConfig } = point;
        const marker = new this.AMap.Marker({
          position: pointPosition,
          ...renderMarkerConfig,
          ...pointConfig,
        });
        markers.push(marker);
        markerCluster.points.push(point);
        cluster.addMarker(marker);
      },
      removePoint: (point: MarkerClusterPoint) => {
        const index = markerCluster.points.findIndex((p) => p.position[0] === point.position[0] && p.position[1] === point.position[1]);
        if (index !== -1) {
          const marker = markers[index];
          cluster.removeMarker(marker);
          markers.splice(index, 1);
          markerCluster.points.splice(index, 1);
        }
      },
      clear: () => {
        markers.forEach((marker) => cluster.removeMarker(marker));
        markers.length = 0;
        markerCluster.points.length = 0;
      },
      remove: () => {
        cluster.setMap(null);
        this.removeClusterFromCollection(clusterId);
      },
    };

    this.addClusterToCollection(markerCluster);
    return markerCluster;
  }

  removeMarker(marker: IMarker): void {
    const amapMarker = (marker as AMapMarker).amapMarker;
    if (amapMarker) {
      this.map.remove(amapMarker);
      this.removeMarkerFromCollection(marker.id);
    }
  }

  removeMarkerCluster(cluster: IMarkerCluster): void {
    const amapCluster = (cluster as AMapMarkerCluster).amapCluster;
    if (amapCluster) {
      amapCluster.setMap(null);
      this.removeClusterFromCollection(cluster.id);
    }
  }

  setCenter(position: [number, number]): void {
    if (this.map) {
      this.map.setCenter(position);
    }
  }

  setZoom(zoom: number): void {
    if (this.map) {
      this.map.setZoom(zoom);
    }
  }

  destroy(): void {
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }
    this.clearMarkers();
    this.clearMarkerClusters();
  }

  getZoom(): number {
    if (this.map) {
      return this.map.getZoom();
    }
    return 11;
  }

  clearMarkers(params?: { type?: string; markers?: Array<IMarker> }): void {
    if (!this.map) return;
    const typeToClear = params?.type;
    const explicitMarkers = params?.markers || [];
    if (!typeToClear && explicitMarkers.length === 0) {
      this.clearAllMarkers();
      return;
    }
    if (typeToClear) {
      this.getMarkers().forEach((marker) => {
        if ((marker as any)?.type === typeToClear) {
          marker.remove();
        }
      });
    }
    explicitMarkers.forEach((marker) => {
      marker.remove();
    });
  }

  clearMarkerClusters(params?: { type?: string; clusters?: Array<IMarkerCluster> }): void {
    if (!this.map) return;
    const typeToClear = params?.type;
    const explicitClusters = params?.clusters || [];
    if (!typeToClear && explicitClusters.length === 0) {
      this.clearAllMarkerClusters();
      return;
    }
    if (typeToClear) {
      this.getMarkerClusters().forEach((cluster) => {
        if ((cluster as any)?.type === typeToClear) {
          cluster.remove();
        }
      });
    }
    explicitClusters.forEach((cluster) => {
      cluster.remove();
    });
  }

  clearPolylines(params?: { type?: string; polylines?: any[] }): void {
    if (!this.map) return;
    const typeToClear = params?.type;
    const explicitPolylines = params?.polylines || [];
    if (!typeToClear && explicitPolylines.length === 0) {
      this.clearAllPolylines();
      return;
    }
    if (typeToClear) {
      this.polylines.forEach((polyline: any) => {
        if (polyline?.type === typeToClear) {
          if (polyline.setMap) {
            polyline.setMap(null);
          }
          this.removePolylineFromCollection(polyline);
        }
      });
    }
    explicitPolylines.forEach((polyline) => {
      if (polyline.setMap) {
        polyline.setMap(null);
      }
      this.removePolylineFromCollection(polyline);
    });
  }

  async addPolygon(config: PolygonConfig): Promise<IPolygon> {
    if (!this.map) {
      throw new Error("Map not initialized");
    }
    const polygonId = this.generateId(CoveringType.POLYGON);
    const defaultOptions = {
      id: polygonId,
      path: [],
      strokeColor: "#FF0000",
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.3,
      clickable: true,
      draggable: false,
      editable: false,
      zIndex: 1,
    };
    const mergedOptions = { ...defaultOptions, ...config };
    const polygon = new this.AMap.Polygon({
      path: mergedOptions.path,
      strokeColor: mergedOptions.strokeColor,
      strokeOpacity: mergedOptions.strokeOpacity,
      strokeWeight: mergedOptions.strokeWeight,
      fillColor: mergedOptions.fillColor,
      fillOpacity: mergedOptions.fillOpacity,
      clickable: mergedOptions.clickable,
      draggable: mergedOptions.draggable,
      editable: mergedOptions.editable,
      zIndex: mergedOptions.zIndex,
    });
    this.map.add(polygon);
    const amapPolygon: IPolygon = {
      id: polygonId,
      path: mergedOptions.path,
      googlePolygon: polygon,
      setPath: (path: [number, number][]) => {
        polygon.setPath(path);
        amapPolygon.path = path;
      },
      setOptions: (options: any) => {
        polygon.setOptions(options);
      },
      setEditable: (editable: boolean) => {
        polygon.setOptions({ editable });
      },
      setDraggable: (draggable: boolean) => {
        polygon.setOptions({ draggable });
      },
      getBounds: () => {
        return polygon.getBounds();
      },
      contains: (point: [number, number]) => {
        return polygon.contains(point);
      },
      getArea: () => {
        return polygon.getArea();
      },
      show: () => {
        polygon.show();
      },
      hide: () => {
        polygon.hide();
      },
      remove: () => {
        this.map.remove(polygon);
        this.removePolygonFromCollection(polygonId);
      },
      clear: () => {
        this.map.remove(polygon);
        this.removePolygonFromCollection(polygonId);
      },
    };
    this.addPolygonToCollection(amapPolygon);
    return amapPolygon;
  }

  clearPolygons(params?: { type?: string; polygons?: Array<IPolygon> }): void {
    if (!this.map) return;

    const typeToClear = params?.type;
    const explicitPolygons = params?.polygons || [];

    if (!typeToClear && explicitPolygons.length === 0) {
      this.clearAllPolygons();
      return;
    }

    if (typeToClear) {
      this.getPolygons().forEach((polygon) => {
        if ((polygon as any)?.type === typeToClear) {
          polygon.remove();
        }
      });
    }

    explicitPolygons.forEach((polygon) => {
      polygon.remove();
    });
  }

  clearPathPlannings(params?: { type?: string; pathPlannings?: any[] }): void {
    if (!this.map) return;

    const typeToClear = params?.type;
    const explicitPathPlannings = params?.pathPlannings || [];

    if (!typeToClear && explicitPathPlannings.length === 0) {
      this.clearAllPathPlannings();
      return;
    }

    if (typeToClear) {
      this.getPathPlannings().forEach((planning: any) => {
        if (planning?.type === typeToClear) {
          if (planning?.remove) {
            planning.remove();
          }
        }
      });
    }

    explicitPathPlannings.forEach((planning) => {
      if (planning?.remove) {
        planning.remove();
      }
      this.removePathPlanningFromCollection(planning);
    });
  }

  clearInfoWindow(params?: { type?: string; infoWindows?: any[] }): void {
    if (!this.map) return;

    const typeToClear = params?.type;
    const explicitInfoWindows = params?.infoWindows || [];

    if (!typeToClear && explicitInfoWindows.length === 0) {
      this.clearAllInfoWindows();
      return;
    }

    if (typeToClear) {
      this.getInfoWindows().forEach((infoWindow: any) => {
        if (infoWindow?.type === typeToClear) {
          if (infoWindow?.remove) {
            infoWindow.remove();
          }
        }
      });
    }

    explicitInfoWindows.forEach((infoWindow) => {
      if (infoWindow?.remove) {
        infoWindow.remove();
      }
      this.removeInfoWindowFromCollection(infoWindow);
    });
  }

  async clearMap(): Promise<void> {
    this.clearMarkers();
    this.clearMarkerClusters();
    this.clearPolylines();
    this.clearPolygons();
    this.clearPathPlannings();
    this.clearInfoWindow();
    this.clearAnimations();
  }

  async addAnimation(config: AnimationConfig): Promise<IAnimation> {
    const animationId = this.generateId(CoveringType.ANIMATION);
    const animation: IAnimation = {
      id: animationId,
      start: () => {
        console.warn("AMap does not support trajectory animation");
      },
      pause: () => {
        console.warn("AMap does not support trajectory animation");
      },
      resume: () => {
        console.warn("AMap does not support trajectory animation");
      },
      stop: () => {
        console.warn("AMap does not support trajectory animation");
      },
      next: () => {
        console.warn("AMap does not support trajectory animation");
      },
      previous: () => {
        console.warn("AMap does not support trajectory animation");
      },
      seek: (progress: number) => {
        console.warn("AMap does not support trajectory animation");
      },
      setSpeed: (speed: number) => {
        console.warn("AMap does not support trajectory animation");
      },
      getCurrentPosition: (): [number, number] => {
        return [0, 0];
      },
      getProgress: (): number => {
        return 0;
      },
      getStatus: (): "idle" | "playing" | "paused" | "stopped" | "completed" => {
        return "idle";
      },
      remove: () => {
        this.removeAnimationFromCollection(animationId);
      },
      clear: () => {
        this.removeAnimationFromCollection(animationId);
      },
    };
    this.addAnimationToCollection(animation);
    return animation;
  }

  clearAnimations(params?: { type?: string; animations?: Array<IAnimation> }): void {
    const typeToClear = params?.type;
    const explicitAnimations = params?.animations || [];

    if (!typeToClear && explicitAnimations.length === 0) {
      this.clearAllAnimations();
      return;
    }

    if (typeToClear) {
      this.getAnimations().forEach((animation) => {
        if ((animation as any)?.type === typeToClear) {
          animation.remove();
        }
      });
    }

    explicitAnimations.forEach((animation) => {
      animation.remove();
    });
  }
}

// 扩展window对象以包含AMap
declare global {
  interface Window {
    AMap?: any;
  }
}
