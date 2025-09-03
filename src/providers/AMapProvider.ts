import AMapLoader from "@amap/amap-jsapi-loader";
import "@amap/amap-jsapi-types";
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
  COVERING_TYPES,
  AnimationStatus,
  PolylineConfig,
  IPolyline,
} from "../types";
import { createDomContent } from "../utils";

interface AMapMarker extends IMarker {
  aMapMarker: any;
}

interface AMapMarkerCluster extends IMarkerCluster {
  aMapCluster: any;
  aMapMarkers: any[];
}

export class AMapProvider extends BaseMapProvider {
  private AMap: any;

  /**
   * 动态加载高德地图SDK
   * @param apiKey 高德地图API密钥
   */
  private async loadAMapSDK(config: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // 检查是否已经加载
      if ((window as any).AMap) {
        resolve();
        return;
      }

      const defaultLoadOptions = {
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        AMapUI: {
          version: "1.1",
          plugins: [],
        },
      };

      const mergedOptions = {
        ...defaultLoadOptions,
        ...config,
      };

      const newWindow = window as any;
      newWindow._AMapSecurityConfig = {
        securityJsCode: mergedOptions.token,
      };

      await AMapLoader.load({
        key: mergedOptions.key,
        plugins: mergedOptions.plugins,
        version: mergedOptions.version,
        AMapUI: mergedOptions.AMapUI,
      });

      resolve();
    });
  }

  async init(config: MapConfig): Promise<void> {
    // this.config = config;

    // 动态加载高德地图SDK
    if (typeof window !== "undefined" && !this.AMap) {
      try {
        // 检查是否已经加载了高德地图SDK
        if (!(window as any).AMap) {
          // 动态加载高德地图SDK
          await this.loadAMapSDK(config);
        }
        this.AMap = (window as any).AMap;
      } catch (error) {
        throw new Error(`Failed to load AMap SDK: ${error}`);
      }
    }

    const defaultOptions = {
      zoom: 11,
      center: [116.397428, 39.90923],
      viewMode: "3D",
      mapStyle: "amap://styles/whitesmoke",
      pitchEnable: true,
      pitch: 40,
      rotation: -15,
    };

    const mergedOptions = {
      ...defaultOptions,
      ...config,
    };

    const container =
      typeof mergedOptions.container === "string" ? document.getElementById(mergedOptions.container) : mergedOptions.container;

    if (!container) {
      throw new Error("Container element not found");
    }

    this.map = new this.AMap.Map(container, {
      center: mergedOptions.center,
      zoom: mergedOptions.zoom,
      viewMode: mergedOptions.viewMode,
      mapStyle: mergedOptions.mapStyle,
      pitchEnable: mergedOptions.pitchEnable,
      pitch: mergedOptions.pitch,
      rotation: mergedOptions.rotation,
    });
  }

  async addMarker(config: MarkerConfig): Promise<IMarker> {
    if (!this.map) {
      throw new Error("Map not initialized");
    }

    const markerId = this.generateId(COVERING_TYPES.MARKER);

    const defaultOptions = {
      map: true,
      position: [],
      content: "",
      clickable: true,
      data: {},
      anchor: "bottom-center",
    };

    const mergedOptions = {
      ...defaultOptions,
      ...config,
    };

    const content = createDomContent(mergedOptions.content || "");
    const { position } = mergedOptions;

    // const markerOptions: any = {};

    // if (mergedOptions.map) {
    //   markerOptions.map = this.map;
    // }

    const aMapMarker = new this.AMap.Marker({
      map: this.map,
      position: [position[0], position[1]],
      content,
      anchor: mergedOptions.anchor,
    });

    const marker: AMapMarker = {
      id: markerId,
      position: [...mergedOptions.position] as [number, number],
      aMapMarker,
      data: mergedOptions.data,
      setPosition: (position: [number, number]) => {
        aMapMarker.setPosition(position);
        marker.position = position;
      },
      setTitle: (title: string) => {
        aMapMarker.setTitle(title);
      },
      setContent: (content: string) => {
        aMapMarker.setContent(content);
      },
      remove: () => {
        this.map.remove(aMapMarker);
        this.removeMarkerFromCollection(markerId);
      },
    };
    if (typeof mergedOptions.onClick === "function") {
      aMapMarker.on("click", (e: any) => {
        mergedOptions.onClick!({ event: e, content, data: mergedOptions.data, position, marker });
      });
    }

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
      aMapCluster: cluster,
      aMapMarkers: markers,
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
      // clear: () => {
      //   markers.forEach((marker) => cluster.removeMarker(marker));
      //   markers.length = 0;
      //   markerCluster.points.length = 0;
      // },
      remove: () => {
        cluster.setMap(null);
        markers.forEach((marker) => cluster.removeMarker(marker));
        markers.length = 0;
        markerCluster.points.length = 0;
        this.removeClusterFromCollection(clusterId);
      },
    };

    this.addClusterToCollection(markerCluster);
    return markerCluster;
  }

  removeMarker(marker: IMarker): void {
    const aMapMarker = (marker as AMapMarker).aMapMarker;
    if (aMapMarker) {
      this.map.remove(aMapMarker);
      this.removeMarkerFromCollection(marker.id);
    }
  }

  removeMarkerCluster(cluster: IMarkerCluster): void {
    const aMapCluster = (cluster as AMapMarkerCluster).aMapCluster;
    if (aMapCluster) {
      aMapCluster.setMap(null);
      this.removeClusterFromCollection(cluster.id);
    }
  }

  setCenter(position: [number, number], immediately?: boolean, duration?: number): void {
    if (this.map) {
      this.map.setCenter(position, immediately, duration);
    }
  }

  setZoom(zoom: number): void {
    if (this.map) {
      this.map.setZoom(zoom);
    }
  }

  setZoomAndCenter(zoom: number, center: [number, number], immediately?: boolean, duration?: number): void {
    if (this.map) {
      this.map.setZoomAndCenter(zoom, center, immediately, duration);
    }
  }

  async addInfoWindow(options: { content: string | HTMLElement; position: [number, number]; open?: boolean }): Promise<any> {
    if (!this.map) {
      throw new Error("Map not initialized");
    }

    const defaultOptions = {
      open: true,
      isCustom: true,
      autoMove: true,
      // closeWhenClickMap: true,
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
    };

    const aMapInfoWindow = new (window as any).AMap.InfoWindow({
      content: mergedOptions.content,
      position: mergedOptions.position,
      isCustom: mergedOptions.isCustom,
      autoMove: mergedOptions.autoMove,
      // closeWhenClickMap: mergedOptions.closeWhenClickMap,
    });

    // if (options.open !== false) {
    //   infoWindow.open(this.map, options.position);
    // }

    // 为信息窗口添加open方法
    const infoWindow = {
      aMapInfoWindow,
      open: (position?: [number, number]) => {
        if (this.map) {
          aMapInfoWindow.open(this.map, position || mergedOptions.position);
        }
      },
      close: () => {
        aMapInfoWindow.close();
      },
      remove: () => {
        aMapInfoWindow.close();
        this.removeInfoWindowFromCollection(infoWindow);
      },
    };

    this.addInfoWindowToCollection(infoWindow);
    return infoWindow;
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

  addPolyline(options: PolylineConfig): Promise<IPolyline> {
    if (!this.map) {
      throw new Error("Map not initialized");
    }
    const polylineId = this.generateId(COVERING_TYPES.POLYLINE);
    const defaultOptions = {
      id: polylineId,
      color: "#f00",
      opacity: 0.8,
      width: 3,
    };
    const mergedOptions = {
      ...defaultOptions,
      ...options,
    };
    const line = new this.AMap.Polyline({
      map: this.map,
      path: mergedOptions.path,
      strokeColor: mergedOptions.color,
      strokeOpacity: mergedOptions.opacity,
      strokeWeight: mergedOptions.width,
    });

    const polyline = {
      id: mergedOptions.id,
      // path: mergedOptions.path.map((p: [number, number]) => [...p] as [number, number]),
      aMapPolyline: line,
      setPath: (path: [number, number][]) => {
        line.setPath(path);
        // polyline.path = path.map((p) => [...p] as [number, number]);
      },
      setOptions: (options: any) => {
        line.setOptions(options);
      },
      setEditable: (editable: boolean) => {
        line.setOptions({ editable });
      },
      setDraggable: (draggable: boolean) => {
        line.setOptions({ draggable });
      },
    };
    this.addPolylinesToCollection([polyline]);
    return Promise.resolve(polyline);
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
    const aMapPolygon = new this.AMap.Polygon({
      path: mergedOptions.path.map((p) => [...p] as [number, number]),
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
    this.map.add(aMapPolygon);
    const polygon: IPolygon = {
      id: polygonId,
      path: mergedOptions.path.map((point) => [...point] as [number, number]),
      aMapPolygon,
      setPath: (path: [number, number][]) => {
        aMapPolygon.setPath(path);
        polygon.path = path;
      },
      setOptions: (options: any) => {
        aMapPolygon.setOptions(options);
      },
      setEditable: (editable: boolean) => {
        aMapPolygon.setOptions({ editable });
      },
      setDraggable: (draggable: boolean) => {
        aMapPolygon.setOptions({ draggable });
      },
      getBounds: () => {
        return aMapPolygon.getBounds();
      },
      contains: (point: [number, number]) => {
        return aMapPolygon.contains(point);
      },
      getArea: () => {
        return aMapPolygon.getArea();
      },
      show: () => {
        aMapPolygon.show();
      },
      hide: () => {
        aMapPolygon.hide();
      },
      remove: () => {
        this.map.remove(aMapPolygon);
        this.removePolygonFromCollection(aMapPolygon);
      },
      // clear: () => {
      //   this.map.remove(polygon);
      //   this.removePolygonFromCollection(polygonId);
      // },
    };
    this.addPolygonToCollection(polygon);
    return polygon;
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
    if (!this.map) return;
    this.map.clearMap();
  }

  async addAnimation(config: AnimationConfig): Promise<IAnimation> {
    const animationId = this.generateId(COVERING_TYPES.ANIMATION);
    const defaultOptions = {
      animation: {
        duration: 5000,
        speed: 1,
        autoStart: false,
        loop: false,
      },
    };
    const mergedOptions = {
      ...defaultOptions,
      ...config,
    };
    const allLineArr = mergedOptions.line.path;
    if (!allLineArr || !Array.isArray(allLineArr) || allLineArr?.length === 0) throw new Error("Animation path is required");
    const polyline = await this.addPolyline(mergedOptions.line);
    const passedLine = await this.addPolyline(mergedOptions.passedLine);
    const marker = await this.addMarker(mergedOptions.marker as MarkerConfig);
    let currentPoint = {
      betweenTwoPoint: false,
      path: [allLineArr[0]], // 取线路的第一个点
      pathWithRInfo: [allLineArr[0]], // 取线路的第一个点
      allPath: allLineArr, // 线路
      animationPath: allLineArr, // 线路
      shouldConcatBefore: false,
      oldPath: [] as any[],
      status: AnimationStatus.IDLE,
      duration: mergedOptions.animation?.duration || 5000,
      directResume: true,
    };
    let startAnimationTimeout: any;

    (marker as AMapMarker).aMapMarker.on("moving", (e: any) => {
      // 移动过程中
      // 从当前点开始运功，但是需要加上之前的轨迹
      if (currentPoint.shouldConcatBefore === true) {
        currentPoint = {
          ...currentPoint,
          betweenTwoPoint: true,
          path: [...currentPoint.oldPath].concat(e.passedPath.slice(0, e.passedPath.length - 1)).filter((item) => item[2] !== 0),
          pathWithRInfo: [...currentPoint.oldPath].concat(e.passedPath).filter((item) => item[2] !== 0),
        };
      } else {
        currentPoint = {
          ...currentPoint,
          betweenTwoPoint: true,
          path: e.passedPath.slice(0, e.passedPath.length - 1),
          pathWithRInfo: e.passedPath,
        };
      }
      passedLine.setPath(currentPoint.pathWithRInfo);
      this.setCenter(e.target.getPosition(), true);
      typeof mergedOptions.onMoving === "function" && mergedOptions.onMoving?.(e);
    });

    (marker as AMapMarker).aMapMarker.on("moveend", () => {
      // 每走完一个point，就会执行moveend
      typeof mergedOptions.onStepEnd === "function" && mergedOptions.onStepEnd?.();
    });

    (marker as AMapMarker).aMapMarker.on("movealong", () => {
      currentPoint.shouldConcatBefore = false;
      currentPoint.status = AnimationStatus.COMPLETED;
      typeof mergedOptions.onComplete === "function" && mergedOptions.onComplete?.();
    });

    const animation: IAnimation = {
      id: animationId,
      aMapMarker: marker,
      start: () => {
        if (!mergedOptions.line.path || mergedOptions.line.path.length === 0) return;
        if (startAnimationTimeout) clearTimeout(startAnimationTimeout);

        startAnimationTimeout = setTimeout(() => {
          (marker as AMapMarker).aMapMarker.moveAlong(mergedOptions.line.path, {
            duration: currentPoint.duration,
            autoRotation: false,
          });
          currentPoint = {
            ...currentPoint,
            status: AnimationStatus.PLAYING,
          };
          this.setZoomAndCenter(18, mergedOptions.line.path[0] as [number, number], false, 100);
        }, 800);
        typeof mergedOptions.onStart === "function" && mergedOptions.onStart();
      },
      pause: () => {
        (marker as AMapMarker).aMapMarker.pauseMove();
        currentPoint = {
          ...currentPoint,
          oldPath: currentPoint.path,
          status: AnimationStatus.PAUSED,
        };
      },
      resume: () => {
        if (currentPoint.directResume) {
          (marker as AMapMarker).aMapMarker.resumeMove();
        } else {
          let animationPath;
          const pathWithRInfo: any = currentPoint.pathWithRInfo;
          const pathWithRInfoLen = pathWithRInfo.length;
          if (currentPoint.betweenTwoPoint) {
            let firstPos;
            const otherPos = currentPoint.allPath.slice(pathWithRInfo.length - 1);
            if (pathWithRInfo && !Array.isArray(pathWithRInfo[pathWithRInfoLen - 1])) {
              firstPos = [pathWithRInfo[pathWithRInfoLen - 1].lng, pathWithRInfo[pathWithRInfoLen - 1].lat, 0];
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
          (marker as AMapMarker).aMapMarker.moveAlong(animationPath, {
            duration: currentPoint.duration,
            autoRotation: false,
          });
        }
        currentPoint = {
          ...currentPoint,
          directResume: true,
          status: AnimationStatus.RESUMED,
        };
        typeof mergedOptions.onResume === "function" &&
          mergedOptions.onResume({
            path: currentPoint.animationPath,
            status: currentPoint.status,
          });
      },
      stop: () => {
        (marker as AMapMarker).aMapMarker.stopMove();
      },
      changeSteps: (step: number, callback?: (params: any) => void) => {
        if (step === 0) return;
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
            status: AnimationStatus.COMPLETED,
            shouldConcatBefore: false,
          };
          if (startAnimationTimeout) clearTimeout(startAnimationTimeout);
        }
        if (stepPassedPath.length === 1) {
          currentPoint = {
            ...currentPoint,
            status: AnimationStatus.IDLE,
            shouldConcatBefore: false,
          };
          if (startAnimationTimeout) clearTimeout(startAnimationTimeout);
        }
        if (stepPassedPath.length > 0) {
          passedLine.setPath(stepPassedPath);
          const markerPosition = stepPassedPath[stepPassedPath.length - 1];
          (marker as AMapMarker).aMapMarker.setPosition(markerPosition);
          this.setCenter(markerPosition, true);
          // 注意，如果animationOptions.onMoving() 写了setCenter。这里的setCenter(markerPosition, true)会不生效，因为虽然没有在moving，但是moving中的setCenter还在执行，会将这里覆盖，导致这里不生效，所以可以在onStepChange中执行
        }
        if (typeof callback === "function")
          callback({
            step,
            path: currentPoint.path,
            status: currentPoint.status,
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
        if (currentPoint.status === AnimationStatus.PLAYING || currentPoint.status === AnimationStatus.RESUMED) {
          animation.resume();
        }
      },
      // next: () => {
      //   console.warn("AMap does not support trajectory animation");
      // },
      // previous: () => {
      //   console.warn("AMap does not support trajectory animation");
      // },
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
      getInfo: () => {
        return {
          path: currentPoint.path,
          status: currentPoint.status,
        };
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

  setFitView() {
    if (!this.map) return;
    this.map.setFitView();
  }
}
