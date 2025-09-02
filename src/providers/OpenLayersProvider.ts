import { BaseMapProvider } from "./BaseMapProvider";
import { createDomContent } from "../utils";import {
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
  COVERING_TYPES,
} from "../types";

interface OpenLayersMarker extends IMarker {
  olMarker: any;
  olFeature: any;
}

interface OpenLayersMarkerCluster extends IMarkerCluster {
  olClusterSource: any;
  olClusterLayer: any;
  olFeatures: any[];
}

export class OpenLayersProvider extends BaseMapProvider {
  private ol: any;
  private vectorLayer: any;
  private clusterLayer: any;

  /**
   * 动态加载OpenLayers SDK
   */
  private async loadOpenLayersSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      // 检查是否已经加载
      if ((window as any).ol) {
        resolve();
        return;
      }

      // 创建script标签
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://cdn.jsdelivr.net/npm/ol@v7.4.0/dist/ol.js";
      script.async = true;
      script.defer = true;

      // 加载成功回调
      script.onload = () => {
        if ((window as any).ol) {
          resolve();
        } else {
          reject(new Error("OpenLayers SDK failed to load"));
        }
      };

      // 加载失败回调
      script.onerror = () => {
        reject(new Error("Failed to load OpenLayers SDK"));
      };

      // 添加到页面
      document.head.appendChild(script);
    });
  }

  async init(config: MapConfig): Promise<void> {
    this.config = config;

    // 动态加载OpenLayers SDK
    if (typeof window !== "undefined" && !this.ol) {
      try {
        // 检查是否已经加载了OpenLayers SDK
        if (!(window as any).ol) {
          // 动态加载OpenLayers SDK
          await this.loadOpenLayersSDK();
        }
        this.ol = (window as any).ol;
      } catch (error) {
        throw new Error(`Failed to load OpenLayers SDK: ${error}`);
      }
    }

    const container = typeof config.container === "string" ? document.getElementById(config.container) : config.container;

    if (!container) {
      throw new Error("Container element not found");
    }

    // 创建矢量图层用于放置markers
    this.vectorLayer = new this.ol.layer.Vector({
      source: new this.ol.source.Vector(),
    });

    this.map = new this.ol.Map({
      target: container,
      layers: [
        new this.ol.layer.Tile({
          source: new this.ol.source.OSM(),
        }),
        this.vectorLayer,
      ],
      view: new this.ol.View({
        center: this.ol.proj.fromLonLat(config.center || [116.397428, 39.90923]),
        zoom: config.zoom || 11,
      }),
      ...config,
    });
  }

  async addMarker(config: MarkerConfig): Promise<IMarker> {
    if (!this.map || !this.vectorLayer) {
      throw new Error("Map not initialized");
    }

    const markerId = this.generateId(COVERING_TYPES.MARKER);
    const { position, ...otherConfig } = config;

    // 创建marker要素
    const feature = new this.ol.Feature({
      geometry: new this.ol.geom.Point(this.ol.proj.fromLonLat(position)),
    });

    // 创建marker样式
    const markerStyle = new this.ol.style.Style({
      image: new this.ol.style.Icon({
        src:
          config.icon ||
          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill="red"/></svg>',
        scale: 1,
      }),
    });

    feature.setStyle(markerStyle);

    // 添加到矢量图层
    this.vectorLayer.getSource().addFeature(feature);

    const marker: OpenLayersMarker = {
      id: markerId,
      position: [...position] as [number, number],
      olMarker: feature,
      olFeature: feature,
      setPosition: (newPosition: [number, number]) => {
        feature.getGeometry().setCoordinates(this.ol.proj.fromLonLat(newPosition));
        marker.position = newPosition;
      },
      setTitle: (title: string) => {
        feature.set("title", title);
      },
      setContent: (content: string) => {
        feature.set("content", content);
      },
      remove: () => {
        this.vectorLayer.getSource().removeFeature(feature);
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

    const clusterId = this.generateId(COVERING_TYPES.CLUSTER);
    const defaultOptions: MarkerClusterOptions = {
      gridSize: 60,
      maxZoom: 18,
      renderClusterMarker:
        '<div style="background-color: #ff6b6b; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold;">{count}</div>',
      renderMarker: {
        position: [0, 0], // 占位符
        icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill="red"/></svg>',
      },
      ...options,
    };

    // 创建聚合源
    const clusterSource = new this.ol.source.Vector();

    // 创建要素数组
    const features: any[] = [];
    points.forEach((point) => {
      const feature = new this.ol.Feature({
        geometry: new this.ol.geom.Point(this.ol.proj.fromLonLat(point.position)),
      });

      // 设置样式
      const markerStyle = new this.ol.style.Style({
        image: new this.ol.style.Icon({
          src:
            defaultOptions.renderMarker?.icon ||
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill="red"/></svg>',
          scale: 1,
        }),
      });
      feature.setStyle(markerStyle);

      features.push(feature);
      clusterSource.addFeature(feature);
    });

    // 创建聚合图层
    const clusterLayer = new this.ol.layer.Vector({
      source: clusterSource,
      style: (feature: any) => {
        const features = feature.get("features");
        if (features && features.length > 1) {
          // 聚合样式
          const count = features.length;
          const div = document.createElement("div");
          div.innerHTML = defaultOptions.renderClusterMarker!.replace("{count}", count.toString());
          const element = div.firstChild as HTMLElement;

          return new this.ol.style.Style({
            image: new this.ol.style.Icon({
              src: "data:image/svg+xml;utf8," + element.outerHTML,
              scale: 1,
            }),
          });
        } else {
          // 单个标记点样式
          return new this.ol.style.Style({
            image: new this.ol.style.Icon({
              src:
                defaultOptions.renderMarker?.icon ||
                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill="red"/></svg>',
              scale: 1,
            }),
          });
        }
      },
    });

    // 添加到地图
    this.map.addLayer(clusterLayer);

    const markerCluster: OpenLayersMarkerCluster = {
      id: clusterId,
      points: [...points],
      olClusterSource: clusterSource,
      olClusterLayer: clusterLayer,
      olFeatures: features,
      addPoint: (point: MarkerClusterPoint) => {
        const feature = new this.ol.Feature({
          geometry: new this.ol.geom.Point(this.ol.proj.fromLonLat(point.position)),
        });

        const markerStyle = new this.ol.style.Style({
          image: new this.ol.style.Icon({
            src:
              defaultOptions.renderMarker?.icon ||
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill="red"/></svg>',
            scale: 1,
          }),
        });
        feature.setStyle(markerStyle);

        features.push(feature);
        markerCluster.points.push(point);
        clusterSource.addFeature(feature);
      },
      removePoint: (point: MarkerClusterPoint) => {
        const index = markerCluster.points.findIndex((p) => p.position[0] === point.position[0] && p.position[1] === point.position[1]);
        if (index !== -1) {
          const feature = features[index];
          clusterSource.removeFeature(feature);
          features.splice(index, 1);
          markerCluster.points.splice(index, 1);
        }
      },
      // clear: () => {
      //   features.forEach((feature) => clusterSource.removeFeature(feature));
      //   features.length = 0;
      //   markerCluster.points.length = 0;
      // },
      remove: () => {
        this.map.removeLayer(clusterLayer);
        features.forEach((feature) => clusterSource.removeFeature(feature));
        features.length = 0;
        markerCluster.points.length = 0;
        this.removeClusterFromCollection(clusterId);
      },
    };

    this.addClusterToCollection(markerCluster);
    return markerCluster;
  }

  removeMarker(marker: IMarker): void {
    const olMarker = (marker as OpenLayersMarker).olFeature;
    if (olMarker && this.vectorLayer) {
      this.vectorLayer.getSource().removeFeature(olMarker);
      this.removeMarkerFromCollection(marker.id);
    }
  }

  removeMarkerCluster(cluster: IMarkerCluster): void {
    const olCluster = (cluster as OpenLayersMarkerCluster).olClusterLayer;
    if (olCluster) {
      this.map.removeLayer(olCluster);
      this.removeClusterFromCollection(cluster.id);
    }
  }

  setCenter(position: [number, number]): void {
    if (this.map) {
      this.map.getView().setCenter(this.ol.proj.fromLonLat(position));
    }
  }

  setZoom(zoom: number): void {
    if (this.map) {
      this.map.getView().setZoom(zoom);
    }
  }

  setZoomAndCenter(zoom: number, center: [number, number]): void {
    if (this.map) {
      this.map.getView().setZoom(zoom);
      this.map.getView().setCenter(this.ol.proj.fromLonLat(center));
    }
  }

  async addInfoWindow(options: { content: string | HTMLElement; position: [number, number]; open?: boolean }): Promise<any> {
    if (!this.map) {
      throw new Error("Map not initialized");
    }

    const overlay = new this.ol.Overlay({
      element: typeof options.content === "string" ? createDomContent(options.content) : options.content,
      position: this.ol.proj.fromLonLat(options.position),
      positioning: "bottom-center",
      stopEvent: false,
    });

    this.map.addOverlay(overlay);
    this.addInfoWindowToCollection(overlay);
    
    // 为overlay添加open方法
    const overlayWithOpen = {
      ...overlay,
      open: (position?: [number, number]) => {
        if (this.map) {
          overlay.setPosition(this.ol.proj.fromLonLat(position || options.position));
        }
      }
    };
    
    return overlayWithOpen;  }

  destroy(): void {
    if (this.map) {
      this.map.setTarget(undefined);
      this.map = null;
    }
    this.clearMarkers();
    this.clearMarkerClusters();
  }

  getZoom(): number {
    if (this.map) {
      return Math.round(this.map.getView().getZoom());
    }
    return 11;
  }

  clearMarkers(params?: { type?: string; markers?: Array<IMarker> }): void {
    if (!this.map || !this.vectorLayer) return;
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
    if (!this.map || !this.vectorLayer) {
      throw new Error("Map not initialized");
    }
    const polygonId = this.generateId(COVERING_TYPES.POLYGON);
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
    const polygonFeature = new this.ol.Feature({
      geometry: new this.ol.geom.Polygon([mergedOptions.path.map((point: any) => this.ol.proj.fromLonLat([point[0], point[1]]))]),
    });
    const polygonStyle = new this.ol.style.Style({
      fill: new this.ol.style.Fill({
        color: `rgba(${this.hexToRgb(mergedOptions.fillColor)}, ${mergedOptions.fillOpacity})`,
      }),
      stroke: new this.ol.style.Stroke({
        color: mergedOptions.strokeColor,
        width: mergedOptions.strokeWeight,
        opacity: mergedOptions.strokeOpacity,
      }),
    });
    polygonFeature.setStyle(polygonStyle);
    this.vectorLayer.getSource().addFeature(polygonFeature);
    const olPolygon: IPolygon = {
      id: polygonId,
      path: mergedOptions.path.map((p) => [...p] as [number, number]),
      googlePolygon: polygonFeature,
      setPath: (path: [number, number][]) => {
        const geometry = polygonFeature.getGeometry() as any;
        geometry.setCoordinates([path.map(([lng, lat]) => this.ol.proj.fromLonLat([lng, lat]))]);
        olPolygon.path = path;
      },
      setOptions: (options: any) => {
        const newStyle = new this.ol.style.Style({
          fill: new this.ol.style.Fill({
            color: `rgba(${this.hexToRgb(options.fillColor || mergedOptions.fillColor)}, ${
              options.fillOpacity || mergedOptions.fillOpacity
            })`,
          }),
          stroke: new this.ol.style.Stroke({
            color: options.strokeColor || mergedOptions.strokeColor,
            width: options.strokeWeight || mergedOptions.strokeWeight,
            opacity: options.strokeOpacity || mergedOptions.strokeOpacity,
          }),
        });
        polygonFeature.setStyle(newStyle);
      },
      setEditable: (editable: boolean) => {
        // OpenLayers editable implementation would be complex
        console.warn("OpenLayers polygon editing not implemented");
      },
      setDraggable: (draggable: boolean) => {
        // OpenLayers draggable implementation would be complex
        console.warn("OpenLayers polygon dragging not implemented");
      },
      getBounds: () => {
        return polygonFeature.getGeometry().getExtent();
      },
      contains: (point: [number, number]) => {
        const geometry = polygonFeature.getGeometry();
        return geometry.intersectsCoordinate(this.ol.proj.fromLonLat(point));
      },
      getArea: () => {
        const geometry = polygonFeature.getGeometry();
        return this.ol.Sphere.getArea(geometry);
      },
      show: () => {
        polygonFeature.setStyle(polygonStyle);
      },
      hide: () => {
        polygonFeature.setStyle(new this.ol.style.Style({}));
      },
      remove: () => {
        this.vectorLayer.getSource().removeFeature(polygonFeature);
        this.removePolygonFromCollection(polygonId);
      },
      // clear: () => {
      //   this.vectorLayer.getSource().removeFeature(polygonFeature);
      //   this.removePolygonFromCollection(polygonId);
      // },
    };
    this.addPolygonToCollection(olPolygon);
    return olPolygon;
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

  clearInfoWindows(params?: { type?: string; infoWindows?: any[] }): void {
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
    this.clearInfoWindows();
    this.clearAnimations();
  }

  async addAnimation(config: AnimationConfig): Promise<IAnimation> {
    const animationId = this.generateId(COVERING_TYPES.ANIMATION);
    const animation: IAnimation = {
      id: animationId,
      start: () => {
        console.warn("OpenLayers does not support trajectory animation");
      },
      pause: () => {
        console.warn("OpenLayers does not support trajectory animation");
      },
      resume: () => {
        console.warn("OpenLayers does not support trajectory animation");
      },
      stop: () => {
        console.warn("OpenLayers does not support trajectory animation");
      },
      next: () => {
        console.warn("OpenLayers does not support trajectory animation");
      },
      previous: () => {
        console.warn("OpenLayers does not support trajectory animation");
      },
      seek: (progress: number) => {
        console.warn("OpenLayers does not support trajectory animation");
      },
      setSpeed: (speed: number) => {
        console.warn("OpenLayers does not support trajectory animation");
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
      // clear: () => {
      //   this.removeAnimationFromCollection(animationId);
      // },
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

  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "255, 0, 0";
  }
}

// 扩展window对象以包含OpenLayers
