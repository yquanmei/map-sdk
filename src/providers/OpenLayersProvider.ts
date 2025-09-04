import "ol/ol.css";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import XYZ from "ol/source/XYZ";
// 图标
import Feature from "ol/Feature";
import { Icon, Style, Stroke, Fill } from "ol/style";
import { Vector as VectorSource } from "ol/source";
import Overlay from "ol/Overlay";
import { Point, LineString, Polygon } from "ol/geom";
import { extend as extentExtend } from "ol/extent";
import { getDistance, getArea } from "ol/sphere";
import * as ol from "ol";
import { fromLonLat, toLonLat } from "ol/proj";
import { BaseMapProvider } from "./BaseMapProvider";
import { createDomContent } from "../utils";
import {
  IMarker,
  MapConfig,
  MarkerConfig,
  MarkerClusterPoint,
  MarkerClusterOptions,
  IMarkerCluster,
  PolygonConfig,
  PolylineConfig,
  IPolyline,
  IPolygon,
  AnimationConfig,
  IAnimation,
  COVERING_TYPES,
  AnimationInfo,
  AnimationStatus,
} from "../types";

interface OpenLayersMarker extends IMarker {
  olMarker: any;
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
    return new Promise((resolve) => {
      // 检查是否已经加载
      // if ((window as any).ol) {
      //   resolve();
      //   return;
      // }
      resolve();
    });
  }

  async init(config: MapConfig): Promise<void> {
    // 动态加载OpenLayers SDK
    if (typeof window !== "undefined" && !this.ol) {
      try {
        // 检查是否已经加载了OpenLayers SDK
        if (!ol) {
          // 动态加载OpenLayers SDK
          await this.loadOpenLayersSDK();
        }
        // this.ol = (window as any).ol;
        this.ol = ol;
      } catch (error) {
        throw new Error(`Failed to load OpenLayers SDK: ${error}`);
      }
    }

    const defaultOptions = {
      container: "container",
      zoom: 18,
      center: [104.06, 30.67],
      url: "http://webrd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
    };
    const mergedOptions = { ...defaultOptions, ...config };

    const container =
      typeof mergedOptions.container === "string" ? document.getElementById(mergedOptions.container) : mergedOptions.container;

    if (!container) {
      throw new Error("Container element not found");
    }
    console.log(`%c yqm this.ol::: `, "color: pink;", this.ol);

    const openStreetMapLayer = new TileLayer({
      source: new XYZ({
        // url: mergedOptions.url, // testtt
        url: defaultOptions.url,
      }),
    });

    this.map = new Map({
      layers: [openStreetMapLayer],
      view: new View({
        center: mergedOptions.center as unknown as [number, number],
        projection: "EPSG:4326",
        zoom: mergedOptions.zoom,
        minZoom: 6, // 最小缩放级别
        maxZoom: 18, // 最大缩放级别
      }),
      target: container,
      controls: [],
    });

    // // 创建矢量图层用于放置markers
    // this.vectorLayer = new VectorLayer({
    //   source: new VectorSource(),
    // });

    // this.map = new Map({
    //   target: container,
    //   layers: [
    //     new TileLayer({
    //       source: new OSM(),
    //     }),
    //     this.vectorLayer,
    //   ],
    //   view: new View({
    //     center: fromLonLat(config.center || [116.397428, 39.90923]),
    //     zoom: config.zoom || 11,
    //   }),
    //   // ...config,
    // });
  }

  async addMarker(config: MarkerConfig): Promise<IMarker> {
    // if (!this.map || !this.vectorLayer) {
    if (!this.map) {
      throw new Error("Map not initialized");
    }

    const markerId = this.generateId(COVERING_TYPES.MARKER);
    const defaultOptions = {
      id: markerId,
    };
    const mergedOptions = { ...defaultOptions, ...config };
    const olMarker = new Overlay({
      position: [...mergedOptions.position], // 例如，经纬度 [5, 48]
      element: createDomContent(mergedOptions.content || ""),
      positioning: "bottom-center", // 可以调整定位方式，例如 'top-left' 等
      stopEvent: false,
      // offset: [0, -10], // 可选，调整偏移量以调整位置
    });
    this.map.addOverlay(olMarker);

    if (typeof mergedOptions.onClick === "function") {
      olMarker.getElement()?.addEventListener("click", (event) => {
        const pixel = this.map.getEventPixel(event);
        const coordinate = this.map.getCoordinateFromPixel(pixel);
        const position = toLonLat(coordinate);
        event.stopPropagation(); // 阻止事件冒泡到地图
        event.preventDefault(); // 阻止默认行为
        const data = mergedOptions.data;
        // mergedOptions.onClick?.({ event, content, data, position, marker });
        mergedOptions.onClick?.({ event, content: olMarker.getElement()!, data, position: position as [number, number] });
      });
    }
    if (typeof mergedOptions.onMouseover === "function") {
      olMarker.getElement()?.addEventListener("mouseover", (event) => {
        const data = mergedOptions.data;
        mergedOptions.onMouseover?.({ event, content: olMarker.getElement()!, data });
      });
    }
    if (typeof mergedOptions.onMouseout === "function") {
      olMarker.getElement()?.addEventListener("mouseout", (event) => {
        const data = mergedOptions.data;
        mergedOptions.onMouseout?.({ event, content: olMarker.getElement()!, data });
      });
    }

    const marker: OpenLayersMarker = {
      id: mergedOptions.id,
      // position: [...position] as [number, number],
      olMarker: olMarker,
      setPosition: (newPosition: [number, number]) => {
        olMarker.setPosition([...newPosition]);
        // marker.position = newPosition;
      },
      setTitle: (title: string) => {
        olMarker.set("title", title);
      },
      setContent: (content: string) => {
        olMarker.set("content", content);
      },
      remove: () => {
        const element = olMarker.getElement();
        if (element) {
          const clone = element.cloneNode(true); // 移除事件监听
          olMarker.setElement(clone as HTMLElement);
        }
        this.map.removeOverlay(olMarker);
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
    const clusterSource = new VectorSource();

    // 创建要素数组
    const features: any[] = [];
    points.forEach((point) => {
      const feature = new Feature({
        geometry: new Point([...point.position]),
      });

      // 设置样式
      const markerStyle = new Style({
        image: new Icon({
          scale: 1,
        }),
      });
      feature.setStyle(markerStyle);

      features.push(feature);
      clusterSource.addFeature(feature);
    });

    // 创建聚合图层
    const clusterLayer = new VectorLayer({
      source: clusterSource,
      style: (feature: any) => {
        const features = feature.get("features");
        if (features && features.length > 1) {
          // 聚合样式
          const count = features.length;
          const div = document.createElement("div");
          div.innerHTML = defaultOptions.renderClusterMarker!.replace("{count}", count.toString());
          const element = div.firstChild as HTMLElement;

          return new Style({
            image: new Icon({
              src: "data:image/svg+xml;utf8," + element.outerHTML,
              scale: 1,
            }),
          });
        } else {
          // 单个标记点样式
          return new Style({
            image: new Icon({
              src:
                String(defaultOptions.renderMarker?.icon) ||
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
        const feature = new Feature({
          geometry: new Point([...point.position]),
        });

        const markerStyle = new Style({
          image: new Icon({
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
      // if (olMarker && this.vectorLayer) {
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
    if (!this.map) return;
    this.map.getView().setCenter(position);
  }

  setZoom(zoom: number): void {
    if (!this.map) return;
    this.map.getView().setZoom(zoom);
  }

  setZoomAndCenter(zoom: number, center: [number, number]): void {
    if (!this.map) return;
    this.map.getView().setZoom(zoom);
    this.map.getView().setCenter(center);
  }

  setFitView(options?: { padding?: number; maxZoom?: number }): void {
    if (!this.map) return;
    this.map.fitView(options);
  }

  // setFitView1() {
  //   // 获取所有矢量图层的 extent
  //   const getAllVectorLayersExtent = () => {
  //     let allExtents: ol.Extent[] = [];
  //     // 遍历所有图层
  //     this.map.getLayers().forEach((layer) => {
  //       // 判断图层是否为矢量图层
  //       if (layer instanceof VectorLayer) {
  //         // 获取矢量图层的数据源
  //         const vectorSource = layer.getSource();
  //         // 获取数据源的 extent
  //         const extent: ol.Extent = vectorSource.getExtent();
  //         // 将 extent 添加到数组
  //         allExtents.push(extent);
  //       }
  //     });

  //     // 合并所有 extents
  //     const mergedExtent = allExtents.reduce((acc: any, extent) => {
  //       return acc ? this.ol.extentExtend(acc, extent) : extent;
  //     }, null);

  //     return mergedExtent;
  //   };

  //   const allLayerExtent = getAllVectorLayersExtent();
  //   this.map.getView().fit(allLayerExtent, { padding: [100, 100, 100, 100] });
  // }

  async addInfoWindow(options: { content: string | HTMLElement; position: [number, number]; open?: boolean }): Promise<any> {
    if (!this.map) {
      throw new Error("Map not initialized");
    }

    const id = this.generateId(COVERING_TYPES.INFO_WINDOW);
    const defaultOptions = {
      id,
      content: "",
      position: [0, 0],
      open: false,
    };
    const mergedOptions = { ...defaultOptions, ...options };

    const olInfoWindow = new Overlay({
      position: mergedOptions.position,
      element: createDomContent(mergedOptions.content),
      positioning: "bottom-center",
      stopEvent: false,
    });

    this.map.addOverlay(olInfoWindow);
    if (mergedOptions.open) {
      olInfoWindow.setPosition(mergedOptions.position);
    }

    // 为overlay添加open、close、remove方法
    const infoWindow = {
      olInfoWindow,
      open: (position?: [number, number]) => {
        if (this.map) {
          olInfoWindow.setPosition(position || mergedOptions.position);
        }
      },
      close: () => {
        olInfoWindow.setPosition(undefined);
      },
      remove: () => {
        this.map.removeOverlay(olInfoWindow);
        olInfoWindow.setPosition(undefined);
        this.removeInfoWindowFromCollection(olInfoWindow);
      },
    };

    this.addInfoWindowToCollection(olInfoWindow);

    return infoWindow;
  }

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

  async addPolyline(options: PolylineConfig): Promise<IPolyline> {
    if (!this.map || !this.vectorLayer) {
      throw new Error("Map not initialized");
    }
    const polylineId = this.generateId(COVERING_TYPES.POLYLINE);
    const defaultOptions = {
      id: polylineId,
      path: [],
      color: "#FF0000",
      opacity: 1,
      width: 2,
      clickable: true,
      draggable: false,
      editable: false,
      zIndex: 1,
    };
    const mergedOptions = { ...defaultOptions, ...options };
    const polylineFeature = new Feature({
      geometry: new LineString(mergedOptions.path.map((point: any) => [point[0], point[1]])),
    });
    const polylineStyle = new Style({
      stroke: new Stroke({
        color: mergedOptions.color,
        width: mergedOptions.width,
      }),
    });
    polylineFeature.setStyle(polylineStyle);
    this.vectorLayer.getSource().addFeature(polylineFeature);
    const olPolyline: IPolyline = {
      id: polylineId,
      // path: mergedOptions.path.map((p) => [...p] as [number, number]),
      googlePolyline: polylineFeature,
      setPath: (path: [number, number][]) => {
        const geometry = polylineFeature.getGeometry() as any;
        geometry.setCoordinates(path.map(([lng, lat]) => [lng, lat]));
        // olPolyline.path = path;
      },
      setOptions: (options: any) => {
        const newStyle = new Style({
          stroke: new Stroke({
            color: options.color || mergedOptions.color,
            width: options.width || mergedOptions.width,
          }),
        });
        polylineFeature.setStyle(newStyle);
      },
      setEditable: (editable: boolean) => {
        // OpenLayers polyline editing implementation
        if (editable) {
          polylineFeature.setStyle(
            new Style({
              stroke: new Stroke({
                color: mergedOptions.color,
                width: mergedOptions.width,
              }),
            })
          );
        }
      },
      setDraggable: (draggable: boolean) => {
        // OpenLayers polyline dragging implementation
        if (draggable) {
          polylineFeature.setStyle(
            new Style({
              stroke: new Stroke({
                color: mergedOptions.color,
              }),
            })
          );
        }
      },
      remove: () => {
        this.vectorLayer.getSource().removeFeature(polylineFeature);
        this.removePolylineFromCollection(olPolyline);
      },
    };
    this.addPolylinesToCollection(olPolyline);
    return olPolyline;
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
    const polygonFeature = new Feature({
      geometry: new Polygon([mergedOptions.path.map((point: any) => [point[0], point[1]])]),
    });
    const polygonStyle = new Style({
      fill: new Fill({
        color: `rgba(${this.hexToRgb(mergedOptions.fillColor)}, ${mergedOptions.fillOpacity})`,
      }),
      stroke: new Stroke({
        color: mergedOptions.strokeColor,
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
        geometry.setCoordinates([path.map(([lng, lat]) => [lng, lat])]);
        olPolygon.path = path;
      },
      setOptions: (options: any) => {
        const newStyle = new Style({
          fill: new Fill({
            color: `rgba(${this.hexToRgb(options.fillColor || mergedOptions.fillColor)}, ${
              options.fillOpacity || mergedOptions.fillOpacity
            })`,
          }),
          stroke: new Stroke({
            color: options.strokeColor || mergedOptions.strokeColor,
            width: options.strokeWeight || mergedOptions.strokeWeight,
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
        return geometry.intersectsCoordinate(point);
      },
      getArea: () => {
        const geometry = polygonFeature.getGeometry();
        return getArea(geometry);
      },
      show: () => {
        polygonFeature.setStyle(polygonStyle);
      },
      hide: () => {
        polygonFeature.setStyle(new Style({}));
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
      changeSteps: (step: number, callback?: (params: any) => void) => {
        if (typeof callback === "function") {
          callback({
            path: [0, 0],
            status: "status",
          });
        }
      },
      changeSpeed: (duration: number) => {
        console.warn("OpenLayers does not support trajectory animation");
      },
      getInfo: (): AnimationInfo => {
        return {
          path: [0, 0] as unknown as [number, number][],
          status: AnimationStatus.IDLE,
        };
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
