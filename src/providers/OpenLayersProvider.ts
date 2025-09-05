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
import { toLonLat } from "ol/proj";
import { Extent } from "ol/extent";
import { merge } from "lodash-es";
import { BaseMapProvider } from "./BaseMapProvider";
import { createDomContent, createAnimation } from "../utils";
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
import { Observer } from "../utils";

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
    const mergedOptions = merge(defaultOptions, config);

    const container =
      typeof mergedOptions.container === "string" ? document.getElementById(mergedOptions.container) : mergedOptions.container;

    if (!container) {
      throw new Error("Container element not found");
    }
    console.log(`%c yqm mergedOptions::: `, "color: pink;", mergedOptions);
    const tileLayer = new TileLayer({
      source: new XYZ({
        // url: mergedOptions.url, // testtt
        url: defaultOptions.url,
      }),
    });

    // 创建矢量图层用于放置markers
    this.vectorLayer = new VectorLayer({
      source: new VectorSource(),
    });

    const view = new View({
      center: mergedOptions.center as unknown as [number, number],
      projection: "EPSG:4326",
      zoom: mergedOptions.zoom,
      minZoom: 6, // 最小缩放级别
      maxZoom: 18, // 最大缩放级别
    });

    this.map = new Map({
      layers: [tileLayer, this.vectorLayer],
      view,
      target: container,
      controls: [],
    });

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
    const mergedOptions = merge(defaultOptions, config);
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

  setCenter(position: [number, number], immediately: boolean = false): void {
    if (!this.map) return;
    this.map.getView().setCenter(position, immediately);
  }

  setZoom(zoom: number): void {
    if (!this.map) return;
    this.map.getView().setZoom(zoom);
  }

  setZoomAndCenter(zoom: number, center: [number, number]): void {
    if (!this.map) return;
    this.setZoom(zoom);
    this.setCenter(center);
  }

  async setFitView(options?: { padding?: number; maxZoom?: number }): Promise<void> {
    const defaultOptions = {
      padding: [100, 100, 100, 100],
      maxZoom: 18,
    };
    const mergedOptions = merge(defaultOptions, options);
    // 获取所有矢量图层的 extent
    const getAllVectorLayersExtent = () => {
      let allExtents: Extent[] = [];
      // 遍历所有图层
      this.map.getLayers().forEach((layer: any) => {
        // 判断图层是否为矢量图层
        if (layer instanceof VectorLayer) {
          // 获取矢量图层的数据源
          const vectorSource = layer.getSource();
          // 获取数据源的 extent
          const extent: Extent = vectorSource.getExtent();
          // 将 extent 添加到数组
          allExtents.push(extent);
        }
      });

      // 合并所有 extents
      const mergedExtent = allExtents.reduce((acc: any, extent) => {
        return acc ? this.ol.extentExtend(acc, extent) : extent;
      }, null);

      return mergedExtent;
    };

    const allLayerExtent = getAllVectorLayersExtent();
    try {
      const safeExtent = await this.calculateSafeExtent(allLayerExtent);
      if (!safeExtent) {
        return;
      }
      this.map.getView().fit(safeExtent, { padding: mergedOptions.padding });
    } catch (error) {
      console.error("Error setting fit view:", error);
    }
  }

  /**
   * 检查范围是否有效
   */
  isEmptyExtent(extent: number[]): boolean {
    const [minX, minY, maxX, maxY] = extent;
    return isNaN(minX) || isNaN(minY) || isNaN(maxX) || isNaN(maxY) || minX === maxX || minY === maxY;
  }

  async calculateSafeExtent(layersExtent): Promise<number[] | null> {
    return new Promise((resolve) => {
      // setTimeout(() => {
      try {
        const extent = layersExtent;
        resolve(extent && !this.isEmptyExtent(extent) ? extent : null);
      } catch (error) {
        console.error("Error calculating extent:", error);
        resolve(null);
      }
      // }, 100); // 给地图一点时间加载
    });
  }

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
    const mergedOptions = merge(defaultOptions, options);

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

    this.addInfoWindowToCollection(infoWindow);

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
      opacity: 0.8,
      width: 3,
      clickable: true,
      draggable: false,
      editable: false,
      zIndex: 1,
    };
    const mergedOptions = merge(defaultOptions, options);
    const lineString = new LineString(mergedOptions.path.map((item) => [item[0], item[1]]));
    const olPolyline = new Feature({
      type: "route",
      geometry: lineString,
    });
    const polylineStyle = new Style({
      stroke: new Stroke({
        color: mergedOptions.color,
        width: mergedOptions.width,
      }),
    });
    olPolyline.setStyle(polylineStyle);
    this.vectorLayer.getSource().addFeature(olPolyline);
    const polyline: IPolyline = {
      id: polylineId,
      // path: mergedOptions.path.map((p) => [...p] as [number, number]),
      olPolyline,
      setPath: (path: [number, number][]) => {
        const geometry = olPolyline.getGeometry() as any;
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
        olPolyline.setStyle(newStyle);
      },
      setEditable: (editable: boolean) => {
        // OpenLayers polyline editing implementation
        if (editable) {
          olPolyline.setStyle(
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
          olPolyline.setStyle(
            new Style({
              stroke: new Stroke({
                color: mergedOptions.color,
              }),
            })
          );
        }
      },
      remove: () => {
        this.vectorLayer.getSource().removeFeature(olPolyline);
        this.removePolylineFromCollection(polyline);
      },
    };
    this.addPolylinesToCollection(polyline);
    return polyline;
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
    const mergedOptions = merge(defaultOptions, config);
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
    const defaultOptions = {
      animation: {
        duration: 5000,
        autoStart: false,
        loop: false,
        setCenterRealTime: true,
        startTimer: 700,
        startZoom: 18,
      },
    };
    const mergedOptions = merge(defaultOptions, config);
    const allLineArr = mergedOptions.line.path;
    if (!allLineArr || !Array.isArray(allLineArr) || allLineArr?.length === 0) throw new Error("Animation path is required");
    this.addPolyline(mergedOptions.line);
    // this.addPolyline(mergedOptions.line);
    const passedLine = (await this.addPolyline(mergedOptions.passedLine)).olPolyline;
    const marker = await this.addMarker(mergedOptions.marker as MarkerConfig);
    let currentPoint = {
      betweenTwoPoint: false,
      path: [allLineArr[0]], // 取线路的第一个点
      pathWithRInfo: [allLineArr[0]], // 取线路的第一个点
      allPath: allLineArr, // 线路
      animationPath: allLineArr, // 线路
      shouldConcatBefore: false,
      oldPath: [],
      animationStatus: AnimationStatus.IDLE,
      duration: mergedOptions.animation.duration,
      directResume: true,
    };
    let startAnimationTimeout: any;
    const animationObserver = new Observer();

    animationObserver.on("moving", (e) => {
      // 移动过程中
      // 从当前点开始运功，但是需要加上之前的轨迹
      let passedPath;
      if (currentPoint.shouldConcatBefore === true) {
        currentPoint = {
          ...currentPoint,
          betweenTwoPoint: true,
          path: [...currentPoint.oldPath].concat(e.passedPathWithR.slice(0, e.passedPathWithR.length - 1)).filter((item) => item[2] !== 0),
          pathWithRInfo: [...currentPoint.oldPath].concat(e.passedPathWithR).filter((item) => item[2] !== 0),
        };
        passedPath = [...currentPoint.oldPath].concat(e.passedPath).filter((item) => item[2] !== 0);
      } else {
        currentPoint = {
          ...currentPoint,
          betweenTwoPoint: true,
          path: e.passedPathWithR.slice(0, e.passedPathWithR.length - 1),
          pathWithRInfo: e.passedPathWithR,
        };
        passedPath = e.passedPath;
      }
      (passedLine as any).getGeometry().setCoordinates(passedPath);
      this.setCenter(e.target.getPosition(), true);
      typeof mergedOptions.onMoving === "function" && mergedOptions.onMoving(e);
    });
    animationObserver.on("moveend", (e) => {
      // 每走完一个point，就会执行moveend
      typeof mergedOptions.onComplete === "function" && mergedOptions.onComplete();
    });
    animationObserver.on("movealong", () => {
      currentPoint.shouldConcatBefore = false;
      currentPoint.animationStatus = AnimationStatus.COMPLETED;
      typeof mergedOptions.onStepEnd === "function" && mergedOptions.onStepEnd();
    });

    const animation: IAnimation = {
      id: animationId,
      start: () => {
        const timeoutTimer = mergedOptions.animation.startTimer;
        if (!mergedOptions.line.path || mergedOptions.line.path.length === 0) return;
        if (startAnimationTimeout) clearTimeout(startAnimationTimeout);

        startAnimationTimeout = setTimeout(() => {
          animationMarker._moveAlong(mergedOptions.line.path, {
            duration: currentPoint.duration,
            autoRotation: false,
          });
          currentPoint = {
            ...currentPoint,
            animationStatus: AnimationStatus.PLAYING,
          };
          console.log(
            `%c yqm mergedOptions.line.path[0]::: `,
            "color: pink;",
            mergedOptions.animation.startZoom,
            mergedOptions.line.path[0]
          );
          this.setZoomAndCenter(mergedOptions.animation.startZoom, [...mergedOptions.line.path[0]]);
        }, timeoutTimer);
        typeof mergedOptions.onStart === "function" && mergedOptions.onStart();
      },
      pause: () => {
        animationMarker._pauseMove();
        currentPoint = {
          ...currentPoint,
          oldPath: currentPoint.path,
          animationStatus: AnimationStatus.PAUSED,
        };
      },
      resume: () => {
        let animationPath;
        const pathWithRInfo = currentPoint.pathWithRInfo;
        const pathWithRInfoLen = pathWithRInfo.length;
        if (currentPoint.betweenTwoPoint) {
          let firstPos;
          const otherPos = currentPoint.allPath.slice(pathWithRInfo.length - 1);
          if (pathWithRInfo && !Array.isArray(pathWithRInfo[pathWithRInfoLen - 1])) {
            firstPos = [
              // @ts-ignore
              pathWithRInfo[pathWithRInfoLen - 1].lng,
              // @ts-ignore
              pathWithRInfo[pathWithRInfoLen - 1].lat,
              0,
            ];
            animationPath = [firstPos].concat(otherPos);
          } else {
            animationPath = otherPos;
          }
        } else {
          const firstPos = [pathWithRInfo[pathWithRInfoLen - 1][0], pathWithRInfo[pathWithRInfoLen - 1][1], 0];
          const otherPos = currentPoint.allPath.slice(pathWithRInfoLen);
          animationPath = [firstPos].concat(otherPos);
        }
        currentPoint = {
          ...currentPoint,
          animationPath,
          shouldConcatBefore: true,
        };
        animationMarker._moveAlong(animationPath, {
          duration: currentPoint.duration,
          autoRotation: false,
        });
        currentPoint = {
          ...currentPoint,
          directResume: true,
          animationStatus: AnimationStatus.RESUMED,
        };
        typeof mergedOptions.onResume === "function" &&
          mergedOptions.onResume({
            path: currentPoint.animationPath,
            status: currentPoint.animationStatus,
          });
      },
      stop: () => {
        animationMarker._stopMove();
      },
      changeSteps: (step: number, callback?: (params: any) => void) => {
        if (step === 0) return;
        // marker.pause();
        animation.pause();

        const allLen = allLineArr.length;
        const len = currentPoint.path.length;
        let stepPassedPath;
        const currentLen = len + step;
        if (step > 0) {
          stepPassedPath = allLineArr.slice(0, currentLen);
          if (currentLen > allLen) {
            stepPassedPath = allLineArr;
          }
        } else {
          if (currentPoint.betweenTwoPoint) {
            stepPassedPath = allLineArr.slice(0, currentLen + 1);
          } else {
            stepPassedPath = allLineArr.slice(0, currentLen);
          }
          if (currentLen === 0) {
            stepPassedPath = [allLineArr[0]];
          }
        }
        currentPoint = {
          ...currentPoint,
          shouldConcatBefore: true,
          betweenTwoPoint: false,
          path: stepPassedPath,
          pathWithRInfo: stepPassedPath,
          oldPath: stepPassedPath,
          directResume: false,
        };
        if (stepPassedPath.length === allLen) {
          currentPoint = {
            ...currentPoint,
            animationStatus: AnimationStatus.COMPLETED,
            shouldConcatBefore: false,
          };
          if (startAnimationTimeout) clearTimeout(startAnimationTimeout);
        }
        if (stepPassedPath.length === 1) {
          currentPoint = {
            ...currentPoint,
            animationStatus: AnimationStatus.IDLE,
            shouldConcatBefore: false,
          };
          if (startAnimationTimeout) clearTimeout(startAnimationTimeout);
        }
        if (stepPassedPath.length > 0) {
          (passedLine as any).getGeometry().setCoordinates(stepPassedPath);
          const markerPosition = stepPassedPath[stepPassedPath.length - 1];
          // marker.olMarker.getGeometry().setCoordinates(markerPosition);
          (marker.olMarker as any).setPosition(markerPosition);
          this.setCenter(markerPosition, true);
        }
        if (typeof callback === "function")
          callback({
            step,
            path: currentPoint.path,
            animationStatus: currentPoint.animationStatus,
          });
      },
      changeSpeed: (duration: number) => {
        currentPoint = {
          ...currentPoint,
          directResume: false,
          duration,
          shouldConcatBefore: true,
          oldPath: currentPoint.path,
        };
        if (currentPoint.animationStatus === AnimationStatus.PLAYING || currentPoint.animationStatus === AnimationStatus.RESUMED) {
          // marker.pause();
          animation.pause();
          animation.resume();
        }
      },
      getInfo: (): AnimationInfo => {
        return {
          path: currentPoint.path,
          status: currentPoint.animationStatus,
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
    const changePosition = (position: [number, number]) => {
      (marker.olMarker as any).setPosition(position);
    };
    const animationMarker = createAnimation(marker, animationObserver, getDistance, changePosition);
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
