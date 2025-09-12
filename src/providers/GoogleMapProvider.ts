import { Loader } from "@googlemaps/js-api-loader";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { merge } from "lodash-es";
import { BaseMapProvider } from "./BaseMapProvider";
import {
  IMarker,
  MapConfig,
  MarkerConfig,
  MarkerClusterPoint,
  MarkerClusterOptions,
  IMarkerCluster,
  COVERING_TYPES,
  IAnimation,
  AnimationConfig,
  PolygonConfig,
  IPolygon,
  PolylineConfig,
  IPolyline,
  AnimationStatus,
  AnimationInfo,
} from "../types";
import { createDomContent } from "../utils";
import "../css/google.css";

interface GoogleMarker extends IMarker {
  googleMarker: any;
  // 覆盖readonly属性为可写
  position: [number, number];
}

interface GoogleMarkerCluster extends IMarkerCluster {
  markerClusterer: any;
  googleMarkers: any[];
  // 覆盖readonly属性为可写
  points: MarkerClusterPoint[];
}

interface GooglePolygon extends IPolygon {
  googlePolygon: any;
  // 覆盖readonly属性为可写
  // path: [number, number][];
}

export class GoogleMapProvider extends BaseMapProvider {
  private google: any;
  /**
   * 动态加载Google Maps SDK
   * @param key Google Maps API密钥
   */
  private async loadGoogleMapsSDK(key?: string): Promise<void> {
    return new Promise(async (resolve) => {
      // 检查是否已经加载
      if ((window as any).google && (window as any).google.maps) {
        resolve();
        return;
      }
      const loader = new Loader({
        apiKey: key || "",
        version: "weekly",
      });

      await loader.load();
      resolve();
    });
  }

  async init(config: MapConfig): Promise<void> {
    // this.config = config;

    // 动态加载Google Maps SDK
    if (typeof window !== "undefined" && !this.google) {
      try {
        // 检查是否已经加载了Google Maps SDK
        if (!(window as any).google || !(window as any).google.maps) {
          await this.loadGoogleMapsSDK(config.key as string);
        }
        this.google = (window as any).google;
      } catch (error) {
        throw new Error(`Failed to load Google Maps SDK: ${error}`);
      }
    }

    const defaultOptions = {
      zoom: 11,
      center: [116.397428, 39.90923],
    };
    const mergedOptions = merge(defaultOptions, config) as any;

    const container =
      typeof mergedOptions.container === "string" ? document.getElementById(mergedOptions.container) : mergedOptions.container;

    if (!container) {
      throw new Error("Container element not found");
    }
    const { Map } = await this.google.maps.importLibrary("maps");
    this.map = new Map(container, {
      center: {
        lat: Number(mergedOptions.center?.[1]),
        lng: Number(mergedOptions.center?.[0]),
      },
      zoom: mergedOptions.zoom,
      mapId: mergedOptions.container,
    });

    // 添加地图点击事件处理
    if (typeof mergedOptions.onClick === "function") {
      this.map.addListener("click", (event) => {
        const position = [event.latLng.lng(), event.latLng.lat()] as [number, number];
        mergedOptions.onClick({
          event: event.domEvent,
          position: position,
        });
      });
    }
  }

  setCenter(position: [number, number]): void {
    if (!this.map) return;
    this.map.setCenter({
      lat: position[1],
      lng: position[0],
    });
  }

  setZoom(zoom: number): void {
    if (!this.map) return;
    this.map.setZoom(zoom);
  }

  getZoom() {
    if (!this.map) return;
    return this.map.getZoom();
  }

  setZoomAndCenter(zoom: number, center: [number, number]): void {
    if (!this.map) return;
    this.map.setZoom(zoom);
    this.map.setCenter({
      lat: center[1],
      lng: center[0],
    });
  }

  setFitView(options?: { padding?: number; maxZoom?: number }): void {
    if (!this.map) return;
    this.map.fitView(options);
  }

  destroy(): void {
    if (!this.map) return;
    // Google Maps doesn't have a destroy method
    // Just clear the map reference
    this.map = null;
  }

  async addMarker(config: MarkerConfig, type?: string): Promise<IMarker> {
    if (!this.map) {
      throw new Error("Map not initialized");
    }

    const id = this.generateId(COVERING_TYPES.MARKER);
    const defaultOptions = {
      map: true,
      clickable: true,
      draggable: false,
      // icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    };
    const mergedOptions = merge(defaultOptions, config) as any;
    const { AdvancedMarkerElement } = await this.google.maps.importLibrary("marker");
    const content = createDomContent(mergedOptions.content || "");
    const { position } = mergedOptions;

    const googleMarker = new AdvancedMarkerElement({
      map: this.map,
      position: {
        lat: position[1],
        lng: position[0],
      },
      content,
    });
    if (typeof mergedOptions.onClick === "function") {
      googleMarker.addListener("click", ({ domEvent, latLng }: { domEvent: any; latLng: any }) => {
        const data = mergedOptions.data;
        const position: [number, number] = [latLng.lng(), latLng.lat()];
        // mergedOptions.onClick?.({ event: domEvent, content, data, position, marker });
        mergedOptions.onClick?.({ event: domEvent, content, data, position });
      });
    }
    if (typeof mergedOptions.onMouseover === "function") {
      content.addEventListener("mouseover", (event) => {
        const data = mergedOptions.data;
        mergedOptions.onMouseover?.({ event, content, data });
      });
    }
    if (typeof mergedOptions.onMouseout === "function") {
      content.addEventListener("mouseout", (event) => {
        const data = mergedOptions.data;
        mergedOptions.onMouseout?.({ event, content, data });
      });
    }
    const marker: GoogleMarker = {
      id,
      position: [...mergedOptions.position] as [number, number],
      googleMarker,
      data: mergedOptions.data,
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
        this.removeMarkerFromCollection(id);
      },
      // clear: () => {
      //   googleMarker.setMap(null);
      //   this.removeMarkerFromCollection(markerId);
      // },
    };
    if (type !== COVERING_TYPES.CLUSTER) {
      this.addMarkerToCollection(marker);
    }
    return marker;
  }

  async addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<any> {
    if (!this.map) {
      throw new Error("Map not initialized");
    }
    const id = this.generateId(COVERING_TYPES.CLUSTER);
    const defaultOptions = {
      data: {},
      gridSize: 60,
      maxZoom: 18,
      renderClusterMarker:
        '<div class="testtt" style="background-color: #ff6b6b; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold;">{count}</div>',
      renderMarker: (index: number) => ({
        position: [0, 0], // 占位符，实际位置会从 point 中获取
        // icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        content: `index: ${index}`,
      }),
    };
    const mergedOptions: any = {
      ...defaultOptions,
      ...options,
    };
    // 创建标记点数组（等待全部创建完成再进行聚合）
    const markerPromises = points.map(async (point, index) => {
      // const { position: _, ...renderMarkerConfig } = defaultOptions.renderMarker!
      // let { position: pointPosition, ...pointConfig } = point;
      let { position: pointPosition } = point;
      if (!pointPosition) {
        pointPosition = points[index].position;
      }
      // pointPosition = [locations[index].lng, locations[index].lat] // testtt
      const markerOptions = mergedOptions.renderMarker(index);
      const marker = await this.addMarker(
        {
          map: true,
          position: [Number(pointPosition[0]), Number(pointPosition[1])],
          content: markerOptions.content,
          onClick: markerOptions.onClick,
          data: markerOptions.data,
        },
        COVERING_TYPES.CLUSTER
      );
      return marker.googleMarker;
    });
    const markers = await Promise.all(markerPromises);

    const zoom = this.getZoom();
    // const { MarkerClusterer } = await this.google.maps.importLibrary("marker") as any;
    const googleMarkerClusterer = new MarkerClusterer({
      markers: markers as any,
      map: this.map as any,
      // renderer: {
      //   // render: ({ count, position }: any) => {
      //   //   console.log(`%c count::: `, 'color: pink;', count)
      //   //   const div = document.createElement("div");
      //   //   div.innerHTML = mergedOptions.renderClusterMarker!.replace("{count}", count.toString());
      //   //   const element = div.firstChild as HTMLElement;
      //   //   element.style.position = "absolute";
      //   //   element.style.transform = "translate(-50%, -50%)";
      //   //   return element;
      //   // },
      //   render: ({ count, position }) => createCustomClusterIcon(count)
      // },
      // 其他配置选项
      algorithmOptions: {
        // maxZoom: mergedOptions.maxZoom // 最大聚合缩放级别
        maxZoom: 18, // 最大聚合缩放级别
        // minPoints: 2,       // 最少2个点才聚合
        // gridSize: 6000        // 聚合网格大小
      },
      // algorithm: {
      //   calculate: (__namedParameters: AlgorithmInput) => {
      //     const clusters: Cluster[] = [];
      //     const zoom = this.map.getZoom();

      //     markers.forEach(marker => {
      //       const position = marker.getPosition();
      //       let addedToCluster = false;

      //       for (const cluster of clusters) {
      //         const clusterCenter = cluster.position;
      //         const distance = this.google.maps.geometry.spherical.computeDistanceBetween(
      //           position, clusterCenter
      //         );

      //         // if (distance <= this.maxDistance) {
      //         if (distance <= 1000) {
      //           cluster.markers.push(marker);
      //           addedToCluster = true;
      //           break;
      //         }
      //       }

      //       if (!addedToCluster) {
      //         clusters.push({ markers: [marker], position });
      //       }
      //     });

      //     return clusters;
      //   }
      // }
    });
    const markerCluster = {
      id,
      googleMarkerClusterer,
      data: mergedOptions.data,
      points: points,
      addPoint: (point: MarkerClusterPoint) => {
        // 实现添加点的逻辑
      },
      removePoint: (point: MarkerClusterPoint) => {
        // 实现移除点的逻辑
      },
      remove: () => {
        googleMarkerClusterer.clearMarkers();
        this.removeClusterFromCollection(id);
      },
      // clear: () => {
      //   googleMarkerClusterer.clearMarkers();
      //   this.removeClusterFromCollection(id);
      // },
    };

    this.addClusterToCollection(markerCluster);

    return markerCluster;
  }

  /**
   * 按条件清除标记点
   * - 传入 markers：清除这些标记
   * - 传入 type：清除当前已收集到的、匹配该 type 的标记
   * 两者同时存在时，两类都会被清除
   */
  clearMarkers(params?: { type?: string; markers?: Array<IMarker | GoogleMarker | any> }): void {
    if (!this.map) return;
    const typeToClear = params?.type;
    const explicitMarkers = params?.markers || [];
    // 1) 如果没有传入任何参数，清除所有聚合（内部私有方法）
    if (!typeToClear && explicitMarkers.length === 0) {
      this.clearAllMarkers();
      return;
    }

    // 2) 基于类型清除（从内部收集的 markers Map 里找）
    if (typeToClear) {
      this.getMarkers().forEach((m: any) => {
        if (m?.type === typeToClear) {
          const googleMarker = (m as GoogleMarker).googleMarker || m;
          if (googleMarker && typeof googleMarker.setMap === "function") {
            googleMarker.setMap(null);
          }
          if ((m as IMarker)?.id) {
            this.removeMarkerFromCollection((m as IMarker).id);
          }
          if (typeof (m as any).remove === "function") {
            (m as any).remove();
          }
        }
      });
    }
    // 3) 清除外部显式传入的 markers
    explicitMarkers.forEach((m: any) => {
      const googleMarker = (m as GoogleMarker).googleMarker || m;
      if (googleMarker && typeof googleMarker.setMap === "function") {
        googleMarker.setMap(null);
      }
      if ((m as IMarker)?.id) {
        this.removeMarkerFromCollection((m as IMarker).id);
      }
      if (typeof (m as any).remove === "function") {
        (m as any).remove();
      }
    });
  }

  /**
   * 按条件清除标记点聚合
   * - 传入 clusters：清除这些聚合
   * - 传入 type：清除当前已收集到的、匹配该 type 的聚合
   * 两者同时存在时，两类都会被清除
   * 如果没有参数，则清除所有聚合
   */
  clearMarkerClusters(params?: { type?: string; clusters?: Array<IMarkerCluster | GoogleMarkerCluster | any> }): void {
    if (!this.map) return;

    const typeToClear = params?.type;
    const explicitClusters = params?.clusters || [];
    // 1) 如果没有传入任何参数，清除所有聚合（内部私有方法）
    if (!typeToClear && explicitClusters.length === 0) {
      this.clearAllMarkerClusters();
      return;
    }

    // 2) 基于类型清除（从内部收集的 markerClusters Map 里找）
    if (typeToClear) {
      this.getMarkerClusters().forEach((c: any) => {
        if (c?.type === typeToClear) {
          const markerClusterer = (c as GoogleMarkerCluster).googleMarkerClusterer || c;
          if (markerClusterer && typeof markerClusterer.clearMarkers === "function") {
            markerClusterer.clearMarkers();
          }
          if ((c as IMarkerCluster)?.id) {
            this.removeClusterFromCollection((c as IMarkerCluster).id);
          }
          if (typeof (c as any).remove === "function") {
            (c as any).remove();
          }
        }
      });
    }

    // 3) 清除外部显式传入的 clusters
    explicitClusters.forEach((c: any) => {
      const markerClusterer = (c as GoogleMarkerCluster).googleMarkerClusterer || c;
      if (markerClusterer && typeof markerClusterer.clearMarkers === "function") {
        markerClusterer.clearMarkers();
      }
      if ((c as IMarkerCluster)?.id) {
        this.removeClusterFromCollection((c as IMarkerCluster).id);
      }
      if (typeof (c as any).remove === "function") {
        (c as any).remove();
      }
    });
  }

  // ============================ 信息窗体 =============================
  /**
   * 添加信息窗体（InfoWindow）
   * @param options { content, position: [lng, lat], open? }
   */
  async addInfoWindow(options: { content: string | HTMLElement; position: [number, number]; open?: boolean }): Promise<any> {
    if (!this.map || !this.google) {
      throw new Error("Map not initialized");
    }

    const defaultOptions = { open: false };
    const mergedOptions = merge(defaultOptions, options) as any;
    const { InfoWindow } = await this.google.maps.importLibrary("maps");
    const googleInfoWindow = new InfoWindow({
      content: createDomContent(mergedOptions.content),
      position: { lat: mergedOptions.position[1], lng: mergedOptions.position[0] },
      headerDisabled: true,
    });

    if (mergedOptions.open) {
      googleInfoWindow.open({ map: this.map });
    }

    const infoWindow = {
      googleInfoWindow,
      open: (position?: [number, number]) => {
        googleInfoWindow.setPosition({ lat: (position || mergedOptions.position)[1], lng: (position || mergedOptions.position)[0] });
        googleInfoWindow.open(this.map);
      },
      close: () => {
        googleInfoWindow.close();
      },
      remove: () => {
        googleInfoWindow.close();
      },
    };
    this.addInfoWindowToCollection(infoWindow);

    return infoWindow;
  }

  clearInfoWindows(params?: { type?: string; infoWindows?: any[] }): void {
    if (!this.map) return;

    const typeToClear = params?.type;
    const explicitInfoWindows = params?.infoWindows || [];

    // 如果没有传入任何参数，清除所有信息窗体
    if (!typeToClear && explicitInfoWindows.length === 0) {
      this.getInfoWindows().forEach((infoWindow) => {
        if (infoWindow?.remove) {
          infoWindow.remove();
        }
      });
      this.infoWindows = [];
      return;
    }

    // 1) 清除外部显式传入的 infoWindows
    explicitInfoWindows.forEach((infoWindow) => {
      if (infoWindow?.remove) {
        infoWindow.remove();
      }
      this.removeInfoWindowFromCollection(infoWindow);
    });

    // 2) 基于类型清除（从内部收集的 infoWindows 数组里找）
    if (typeToClear) {
      this.getInfoWindows().forEach((infoWindow: any) => {
        if (infoWindow?.type === typeToClear) {
          if (infoWindow?.remove) {
            infoWindow.remove();
          }
          this.removeInfoWindowFromCollection(infoWindow);
        }
      });
    }
  }

  // ============================ 折线 =============================
  /**
   * 绘制折线（Polyline）
   */
  async addPolyline(options: PolylineConfig): Promise<IPolyline> {
    if (!this.map || !this.google) {
      throw new Error("Map not initialized");
    }
    const { Polyline } = await this.google.maps.importLibrary("maps");
    const id = this.generateId(COVERING_TYPES.POLYLINE);
    const defaultOptions = {
      color: "#f00",
      opacity: 0.8,
      width: 3,
    };
    const mergedOptions = merge(defaultOptions, options) as any;
    const googlePolyline = new Polyline({
      id,
      map: this.map,
      path: mergedOptions.path.map(([lng, lat]) => ({ lat, lng })),
      strokeColor: mergedOptions.color,
      strokeOpacity: mergedOptions.opacity,
      strokeWeight: mergedOptions.width,
    });

    const polyline = {
      id,
      googlePolyline,
      setPath: (path: [number, number][]) => {},
      setEditable: (editable: boolean) => {},
      setDraggable: (draggable: boolean) => {},
      setOptions: (options: any) => {},
    };
    this.addPolylinesToCollection(polyline);

    return polyline;
  }

  clearPolylines(params?: { type?: string; polylines?: any[] }): void {
    if (!this.map) return;

    const typeToClear = params?.type;
    const explicitPolylines = params?.polylines || [];

    // 1)如果没有传入任何参数，清除所有折线
    if (!typeToClear && explicitPolylines.length === 0) {
      this.clearAllPolylines();
      return;
    }

    // 2) 基于类型清除（从内部收集的 polylines 数组里找）
    if (typeToClear) {
      this.getPolylines().forEach((polyline: any) => {
        if (polyline?.type === typeToClear) {
          if (typeof polyline.setMap === "function") {
            polyline.setMap(null);
          }
          this.removePolylineFromCollection(polyline);
        }
      });
    }
    // 3) 清除外部显式传入的 polylines
    explicitPolylines.forEach((polyline) => {
      if (typeof polyline.setMap === "function") {
        polyline.setMap(null);
      }
      this.removePolylineFromCollection(polyline);
    });
  }

  // ============================ 轨迹规划 =============================
  /**
   * 计算路径规划：驾车
   * @param origin 起点坐标 [lng, lat]
   * @param destination 终点坐标 [lng, lat]
   * @param waypoints 途经点坐标数组 [lng, lat][]
   * @param options 其他选项
   * @returns 驾车路线结果
   */
  async addPathPlanning(options: {
    start: [number, number] | string;
    end: [number, number] | string;
    points?: [number, number][];
    optimizeWaypoints?: boolean;
    avoidHighways?: boolean;
    avoidTolls?: boolean;
    avoidFerries?: boolean;
    onChange?: (points: [number, number][]) => void;
  }): Promise<any> {
    if (!this.map || !this.google) {
      throw new Error("Map not initialized");
    }

    try {
      const id = this.generateId(COVERING_TYPES.PATH_PLANNING);
      const defaultOptions = {
        start: [0, 0],
        end: [0, 0],
        points: [],
        suppressMarkers: false, // 显示起点和终点标记
        suppressInfoWindows: false, // 显示信息窗口
        draggable: true,
        travelMode: this.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      };
      const mergedOptions = merge(defaultOptions, options) as any;
      const origin =
        typeof mergedOptions.start === "string"
          ? { query: mergedOptions.start }
          : { lat: mergedOptions.start[1], lng: mergedOptions.start[0] };
      const destination =
        typeof mergedOptions.end === "string" ? { query: mergedOptions.end } : { lat: mergedOptions.end[1], lng: mergedOptions.end[0] };

      const { DirectionsService, DirectionsRenderer } = await this.google.maps.importLibrary("routes");

      const directionsService = new DirectionsService();
      const directionsRenderer = new DirectionsRenderer({
        map: this.map,
        // suppressMarkers: mergedOptions.suppressMarkers, // 显示起点和终点标记
        // suppressInfoWindows: mergedOptions.suppressInfoWindows, // 显示信息窗口
        draggable: mergedOptions.draggable, // 是否可拖动
      });

      // 构建 Google Directions API 请求参数
      const directionsRequest: any = {
        origin,
        destination,
        travelMode: mergedOptions.travelMode,
        optimizeWaypoints: mergedOptions.optimizeWaypoints,
      };

      // 计算路线
      const result = await new Promise<any>((resolve, reject) => {
        directionsService.route(directionsRequest, (res: any, status: any) => {
          if (status === this.google.maps.DirectionsStatus.OK) {
            resolve(res);
          } else {
            reject(new Error(`Directions request failed: ${status}`));
          }
        });
      });

      // 渲染路线
      directionsRenderer.setDirections(result);

      directionsRenderer.addListener("directions_changed", () => {
        const directions = directionsRenderer.getDirections();

        if (directions) {
          const paths = directions.routes[0].overview_path;
          const points = paths.map((path: any) => [path.lng(), path.lat()]);
          if (typeof mergedOptions.onChange === "function") {
            mergedOptions.onChange(points as [number, number][]);
          }
        }
      });
      const planning = {
        id,
        result,
        directionsRenderer,
        clear: () => {
          directionsRenderer.setDirections({ routes: [] });
        },
        remove: () => {
          directionsRenderer.setMap(null);
        },
      };
      this.addPathPlanningToCollection(planning);
      return planning;
    } catch (error) {
      throw new Error(`Failed to calculate driving route: ${error}`);
    }
  }

  clearPathPlannings(params?: { type?: string; pathPlannings?: any[] }): void {
    if (!this.map) return;

    const typeToClear = params?.type;
    const explicitPathPlannings = params?.pathPlannings || [];

    // 1)如果没有传入任何参数，清除所有路径规划
    if (!typeToClear && explicitPathPlannings.length === 0) {
      this.clearAllPathPlannings();
      return;
    }

    // 2) 基于类型清除（从内部收集的 pathPlannings 数组里找）
    if (typeToClear) {
      this.getPathPlannings().forEach((planning: any) => {
        if (planning?.type === typeToClear) {
          if (planning?.remove) {
            planning.remove();
          }
          this.removePathPlanningFromCollection(planning);
        }
      });
    }

    // 3) 清除外部显式传入的 pathPlannings
    explicitPathPlannings.forEach((planning) => {
      if (planning?.remove) {
        planning.remove();
      }
      this.removePathPlanningFromCollection(planning);
    });
  }

  // ============================ 地址 =============================
  /**
   * 通过经纬度获取详细地址信息
   * @param position 坐标 [lng, lat]
   * @returns 地址信息
   */
  async getAddressByLngLat(position: [number, number]): Promise<any> {
    if (!this.map || !this.google) {
      throw new Error("Map not initialized");
    }

    try {
      // const geocoder = new this.google.maps.Geocoder()
      const { Geocoder } = await this.google.maps.importLibrary("geocoding");
      const geocoder = new Geocoder();
      const result = await new Promise<any>((resolve, reject) => {
        geocoder.geocode({ location: { lat: position[1], lng: position[0] } }, (results: any, status: any) => {
          if (status === this.google.maps.GeocoderStatus.OK) {
            if (results && results.length > 0) {
              resolve(results[0]);
            } else {
              resolve("");
            }
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      });

      // 解析地址组件
      const addressComponents = result.address_components;
      const formattedAddress = result.formatted_address;

      // 提取详细的地址信息
      const addressInfo = {
        formattedAddress,
        premise: "",
        streetNumber: "",
        route: "",
        district: "",
        city: "",
        province: "",
        country: "",
        postalCode: "",
        coordinates: position,
        detailedAddress: "",
      };

      // 遍历地址组件，提取详细信息
      addressComponents.forEach((component: any) => {
        const types = component.types;
        const longName = component.long_name;
        // const shortName = component.short_name

        if (types.includes("premise")) {
          addressInfo.premise = longName;
        } else if (types.includes("street_number")) {
          addressInfo.streetNumber = longName;
        } else if (types.includes("route")) {
          addressInfo.route = longName;
        } else if (types.includes("sublocality")) {
          // 区
          addressInfo.district = longName;
        } else if (types.includes("locality")) {
          // 市
          addressInfo.city = longName;
        } else if (types.includes("administrative_area_level_1")) {
          // 省
          addressInfo.province = longName;
        } else if (types.includes("country")) {
          // 国家
          addressInfo.country = longName;
        } else if (types.includes("postal_code")) {
          addressInfo.postalCode = longName;
        }
      });
      addressInfo.detailedAddress = `${addressInfo.country}${addressInfo.province}${addressInfo.city}${addressInfo.district}${addressInfo.route}${addressInfo.streetNumber}`;

      return addressInfo;
    } catch (error) {
      throw new Error(`Failed to get address from position: ${error}`);
    }
  }

  async getAddressList(value: string, config: any): Promise<any> {
    console.warn("待实现");
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

  // ============================ 多边形 =============================
  /**
   * 绘制多边形
   */
  async addPolygon(config: PolygonConfig): Promise<IPolygon> {
    if (!this.map || !this.google) {
      throw new Error("Map not initialized");
    }

    const id = this.generateId(COVERING_TYPES.POLYGON);
    const defaultOptions = {
      fillColor: "#00B2D5",
      fillOpacity: 0.5,
      strokeColor: "#00D3FC",
      strokeOpacity: 0.9,
      strokeWeight: 2,
      editable: false,
      draggable: false,
      clickable: true,
      zIndex: 10,
    };

    const mergedOptions = merge(defaultOptions, config) as any;

    // 创建Google Maps多边形
    const { Polygon } = await this.google.maps.importLibrary("maps");

    // 处理路径，确保至少有2个点
    const paths = mergedOptions.path.map(([lng, lat]: [number, number]) => ({ lat, lng }));

    // 对于预览模式，根据点的数量决定显示效果
    if (paths.length === 2) {
      // 只有2个点时，显示为线段
      const polyline = new this.google.maps.Polyline({
        path: paths,
        strokeColor: mergedOptions.strokeColor,
        strokeOpacity: mergedOptions.strokeOpacity,
        strokeWeight: mergedOptions.strokeWeight,
        map: this.map,
      });

      // 返回一个包装的polyline对象，模拟polygon接口
      const previewPolygon: GooglePolygon = {
        id,
        // path: mergedOptions.path.map((p) => [...p] as [number, number]),
        googlePolygon: polyline,
        setPath: (path: [number, number][]) => {
          polyline.setPath(path.map(([lng, lat]) => ({ lat, lng })));
          // previewPolygon.path = path;
        },
        setOptions: () => {},
        setEditable: () => {},
        setDraggable: () => {},
        getBounds: () => null,
        contains: () => false,
        getArea: () => 0,
        show: () => polyline.setMap(this.map),
        hide: () => polyline.setMap(null),
        remove: () => {
          polyline.setMap(null);
          this.removePolygonFromCollection(id);
        },
        // clear: () => {
        //   polyline.setMap(null);
        //   this.removePolygonFromCollection(polygonId);
        // },
      };

      this.addPolygonToCollection(previewPolygon);
      return previewPolygon;
    }

    // 正常多边形绘制
    const googlePolygon = new Polygon({
      paths: paths,
      fillColor: mergedOptions.fillColor,
      fillOpacity: mergedOptions.fillOpacity,
      strokeColor: mergedOptions.strokeColor,
      strokeOpacity: mergedOptions.strokeOpacity,
      strokeWeight: mergedOptions.strokeWeight,
      clickable: mergedOptions.clickable,
      draggable: mergedOptions.draggable,
      editable: mergedOptions.editable,
      zIndex: mergedOptions.zIndex,
      map: this.map,
    });

    // 绑定事件监听器
    if (typeof mergedOptions.onClick === "function") {
      googlePolygon.addListener("click", (event: any) => {
        const data = mergedOptions.data;
        mergedOptions.onClick!({ event, polygon: polygon, data });
      });
    }

    if (typeof mergedOptions.onMouseover === "function") {
      googlePolygon.addListener("mouseover", (event: any) => {
        const data = mergedOptions.data;
        mergedOptions.onMouseover!({ event, polygon: polygon, data });
      });
    }

    if (typeof mergedOptions.onMouseout === "function") {
      googlePolygon.addListener("mouseout", (event: any) => {
        const data = mergedOptions.data;
        mergedOptions.onMouseout!({ event, polygon: polygon, data });
      });
    }

    if (typeof mergedOptions.onDragEnd === "function") {
      googlePolygon.addListener("dragend", (event: any) => {
        const path = googlePolygon
          .getPaths()
          .getArray()[0]
          .getArray()
          .map((latLng: any) => [latLng.lng(), latLng.lat()]);
        mergedOptions.onDragEnd!({ event, polygon: polygon, path, data: mergedOptions.data });
      });
    }

    if (typeof mergedOptions.onEditEnd === "function") {
      googlePolygon.addListener("mouseup", (event: any) => {
        const path = googlePolygon
          .getPaths()
          .getArray()[0]
          .getArray()
          .map((latLng: any) => [latLng.lng(), latLng.lat()]);
        mergedOptions.onEditEnd!({ event, polygon: polygon, path, data: mergedOptions.data });
      });
    }

    const polygon: GooglePolygon = {
      id,
      // path: mergedOptions.path.map((p) => [...p] as [number, number]),
      googlePolygon,
      setPath: (path: [number, number][]) => {
        googlePolygon.setPaths(path.map(([lng, lat]) => ({ lat, lng })));
        // polygon.path = path;
      },
      setOptions: (options: Partial<PolygonConfig>) => {
        const newOptions = { ...mergedOptions, ...options };
        googlePolygon.setOptions({
          fillColor: newOptions.fillColor,
          fillOpacity: newOptions.fillOpacity,
          strokeColor: newOptions.strokeColor,
          strokeOpacity: newOptions.strokeOpacity,
          strokeWeight: newOptions.strokeWeight,
          clickable: newOptions.clickable,
          draggable: newOptions.draggable,
          editable: newOptions.editable,
          zIndex: newOptions.zIndex,
        });
      },

      setEditable: (editable: boolean) => {
        googlePolygon.setEditable(editable);
      },

      setDraggable: (draggable: boolean) => {
        googlePolygon.setDraggable(draggable);
      },

      getPath: () => {
        return googlePolygon
          .getPath()
          .getArray()
          .map((latLng: any) => [latLng.lng(), latLng.lat()]);
      },

      getBounds: () => {
        return googlePolygon.getBounds();
      },

      contains: (point: [number, number]): boolean => {
        const bounds = googlePolygon.getBounds();
        if (!bounds) return false;

        const pointLatLng = new this.google.maps.LatLng(point[1], point[0]);
        return bounds.contains(pointLatLng);
      },

      getArea: (): number => {
        const area = this.google.maps.geometry.spherical.computeArea(googlePolygon.getPaths().getArray()[0]);
        return area;
      },

      show: () => {
        googlePolygon.setMap(this.map);
      },

      hide: () => {
        googlePolygon.setMap(null);
      },

      remove: () => {
        googlePolygon.setMap(null);
        this.removePolygonFromCollection(id);
      },

      // clear: () => {
      //   googlePolygon.setMap(null);
      //   this.removePolygonFromCollection(polygonId);
      // },
    };

    this.addPolygonToCollection(polygon);
    return polygon;
  }

  /**
   * 按条件清除多边形
   */
  clearPolygons(params?: { type?: string; polygons?: Array<IPolygon> }): void {
    if (!this.map) return;

    const typeToClear = params?.type;
    const explicitPolygons = params?.polygons || [];

    // 1) 如果没有传入任何参数，清除所有多边形
    if (!typeToClear && explicitPolygons.length === 0) {
      this.clearAllPolygons();
      return;
    }

    // 2) 基于类型清除
    if (typeToClear) {
      this.getPolygons().forEach((polygon: any) => {
        if (polygon?.type === typeToClear) {
          if (polygon?.remove) {
            polygon.remove();
          }
          this.removePolygonFromCollection(polygon.id);
        }
      });
    }

    // 3) 清除外部显式传入的多边形
    explicitPolygons.forEach((polygon) => {
      if (polygon?.remove) {
        polygon.remove();
      }
      this.removePolygonFromCollection(polygon.id);
    });
  }

  // ============================ 轨迹动画 =============================
  /**
   * 添加轨迹动画
   */
  async addAnimation(config: AnimationConfig): Promise<IAnimation> {
    if (!this.map || !this.google) {
      throw new Error("Map not initialized");
    }

    const id = this.generateId(COVERING_TYPES.ANIMATION);
    const defaultOptions = {
      animation: {
        duration: 5000,
        speed: 1,
        autoStart: false,
        loop: false,
      },
    };

    const mergedOptions = merge(defaultOptions, config) as any;

    // 创建移动标记
    const markerOptions = mergedOptions.marker || {
      position: mergedOptions.line.path[0],
      content: "🚗",
      map: true,
    };

    const movingMarker = await this.addMarker(markerOptions);

    let animationFrameId: number | null = null;
    let startTime = 0;
    let pausedTime = 0;
    let currentIndex = 0;
    let status: "idle" | "playing" | "paused" | "stopped" | "completed" = "idle";
    let currentSpeed: number = (mergedOptions.animation.speed as number) || 1;

    const googleAnimation: IAnimation = {
      id,
      googleMarker: movingMarker,
      start: () => {
        if (status === "playing") return;
        if (status === "completed" || status === "stopped") {
          currentIndex = 0;
          pausedTime = 0;
        }

        status = "playing";
        startTime = Date.now() - pausedTime;

        const animate = () => {
          if (status !== "playing") return;

          const elapsed = Date.now() - startTime;
          const totalDuration = mergedOptions.animation.duration / currentSpeed;
          let progress = Math.min(elapsed / totalDuration, 1);

          if (progress >= 1) {
            if (mergedOptions.animation.loop) {
              progress = 0;
              currentIndex = 0;
              startTime = Date.now();
            } else {
              status = "completed";
              if (mergedOptions.onComplete) {
                mergedOptions.onComplete();
              }
              return;
            }
          }

          // 计算当前位置
          const totalPoints = mergedOptions.line.path.length;
          const targetIndex = Math.floor(progress * (totalPoints - 1));
          const segmentProgress = (progress * (totalPoints - 1)) % 1;

          if (targetIndex !== currentIndex) {
            currentIndex = targetIndex;
            if (mergedOptions.onStep) {
              mergedOptions.onStep(currentIndex, mergedOptions.line.path[currentIndex]);
            }
          }

          // 插值计算当前位置
          const currentPos = mergedOptions.line.path[Math.min(currentIndex, totalPoints - 2)];
          const nextPos = mergedOptions.line.path[Math.min(currentIndex + 1, totalPoints - 1)];

          const lat = currentPos[1] + (nextPos[1] - currentPos[1]) * segmentProgress;
          const lng = currentPos[0] + (nextPos[0] - currentPos[0]) * segmentProgress;
          const position: [number, number] = [lng, lat];

          movingMarker.setPosition(position);

          // 触发进度回调
          if (mergedOptions.onProgress) {
            mergedOptions.onProgress(progress, position);
          }

          animationFrameId = requestAnimationFrame(animate);
        };

        if (mergedOptions.onStart) {
          mergedOptions.onStart();
        }

        animate();
      },

      pause: () => {
        if (status !== "playing") return;
        status = "paused";
        pausedTime = Date.now() - startTime;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        if (mergedOptions.onPause) {
          mergedOptions.onPause();
        }
      },

      resume: () => {
        if (status !== "paused") return;
        googleAnimation.start();
        if (mergedOptions.onResume) {
          mergedOptions.onResume({
            path: mergedOptions.line.path.map((p: number[]) => [p[0], p[1]] as [number, number]),
            status: status as AnimationStatus,
          });
        }
      },

      stop: () => {
        status = "stopped";
        pausedTime = 0;
        currentIndex = 0;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        // 重置到起始位置
        movingMarker.setPosition(mergedOptions.line.path[0]);
        if (mergedOptions.onStop) {
          mergedOptions.onStop();
        }
      },
      changeSteps: (step: number, callback?: (params: any) => void) => {
        if (status === AnimationStatus.PLAYING) return;
        if (typeof callback === "function") {
          callback({
            path: mergedOptions.line.path as [number, number][],
            status: status,
          });
        }
      },
      changeProgress: (index: number): void => {
        console.warn("待实现", index);
      },
      getInfo: (): AnimationInfo => {
        return {
          path: mergedOptions.line.path as [number, number][],
          status: status as AnimationStatus,
        };
      },
      // next: () => {
      //   currentIndex = Math.min(currentIndex + 1, mergedOptions.line.path.length - 1);
      //   const position = mergedOptions.line.path[currentIndex];
      //   movingMarker.setPosition(position);
      //   if (mergedOptions.onStep) {
      //     mergedOptions.onStep(currentIndex, position);
      //   }
      // },

      // previous: () => {
      //   if (status === "playing") return;
      //   currentIndex = Math.max(currentIndex - 1, 0);
      //   const position = mergedOptions.line.path[currentIndex];
      //   movingMarker.setPosition(position);
      //   if (mergedOptions.onStep) {
      //     mergedOptions.onStep(currentIndex, position);
      //   }
      // },

      seek: (progress: number) => {
        const clampedProgress = Math.max(0, Math.min(1, progress));
        const totalPoints = mergedOptions.line.path.length;
        currentIndex = Math.floor(clampedProgress * (totalPoints - 1));
        const position = mergedOptions.line.path[currentIndex];
        movingMarker.setPosition(position);

        if (status === "playing") {
          startTime = Date.now() - (clampedProgress * mergedOptions.animation.duration) / currentSpeed;
        } else {
          pausedTime = (clampedProgress * mergedOptions.animation.duration) / currentSpeed;
        }

        if (mergedOptions.onProgress) {
          mergedOptions.onProgress(clampedProgress, position);
        }
        if (mergedOptions.onStep) {
          mergedOptions.onStep(currentIndex, position);
        }
      },

      // setSpeed: (speed: number) => {
      //   currentSpeed = Math.max(0.1, speed);
      //   if (status === "playing") {
      //     startTime = Date.now() - pausedTime;
      //   }
      // },
      setDuration: (duration: number) => {
        console.warn("待实现", duration);
      },
      getCurrentPosition: (): [number, number] => {
        return [...mergedOptions.line.path[Math.min(currentIndex, mergedOptions.line.path.length - 1)]] as [number, number];
      },

      getProgress: (): number => {
        if (status === "idle" || status === "stopped") return 0;
        if (status === "completed") return 1;

        const elapsed = status === "playing" ? Date.now() - startTime : pausedTime;

        return Math.min(elapsed / (mergedOptions.animation.duration / currentSpeed), 1);
      },

      getStatus: (): "idle" | "playing" | "paused" | "stopped" | "completed" => {
        return status;
      },

      remove: () => {
        googleAnimation.stop();
        movingMarker.remove();
        this.removeAnimationFromCollection(id);
      },

      // clear: () => {
      //   googleAnimation.remove();
      // },
    };

    this.addAnimationToCollection(googleAnimation);

    // 自动开始
    if (mergedOptions.animation.autoStart) {
      setTimeout(() => googleAnimation.start(), 100);
    }

    return googleAnimation;
  }

  /**
   * 按条件清除轨迹动画
   */
  clearAnimations(params?: { type?: string; animations?: Array<IAnimation> }): void {
    if (!this.map) return;

    const typeToClear = params?.type;
    const explicitAnimations = params?.animations || [];

    // 1) 如果没有传入任何参数，清除所有动画
    if (!typeToClear && explicitAnimations.length === 0) {
      this.clearAllAnimations();
      return;
    }

    // 2) 基于类型清除
    if (typeToClear) {
      this.getAnimations().forEach((animation: any) => {
        if (animation?.type === typeToClear) {
          if (animation?.remove) {
            animation.remove();
          }
          this.removeAnimationFromCollection(animation.id);
        }
      });
    }

    // 3) 清除外部显式传入的动画
    explicitAnimations.forEach((animation) => {
      if (animation?.remove) {
        animation.remove();
      }
      this.removeAnimationFromCollection(animation.id);
    });
  }

  // ============================ 其他 =============================
  generateId(type: string): string {
    return `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
}
