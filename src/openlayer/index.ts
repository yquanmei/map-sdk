import "ol/ol.css";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import XYZ from "ol/source/XYZ";
// 图标
import Feature from "ol/Feature";
import { Icon, Style, Stroke } from "ol/style";
import { Vector as VectorSource } from "ol/source";
import { merge } from "lodash";
import Overlay from "ol/Overlay";
import { Point, LineString } from "ol/geom";
import { MapImplements, AnimationStatus } from "../types";
import { extend as extentExtend } from "ol/extent";
import { getDistance } from "ol/sphere";
import * as ol from "openlayers";
import { CurrentPoint, Options, OverlaysArr } from "./index.d";

interface Polyline {
  path: [number, number][];
  map?: any;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWeight?: number;
}

const pickNotEmptyObject = (data: Polyline): Polyline => {
  return Object.keys(data)
    .filter((key) => data[key] !== null && data[key] !== undefined)
    .reduce((acc, key) => ({ ...acc, [key]: data[key] }), { path: [[0, 0]] });
};

class Observer {
  message;
  constructor() {
    this.message = {}; // 消息队列
  }

  /**
   * `$on` 向消息队列添加内容
   * @param {*} type 事件名 (事件类型)
   * @param {*} callback 回调函数
   */
  on(type, callback) {
    // 判断有没有这个属性（事件类型）
    if (!this.message[type]) {
      // 如果没有这个属性，就初始化一个空的数组
      this.message[type] = [];
    }
    // 如果有这个属性，就往他的后面push一个新的callback
    this.message[type].push(callback);
  }

  /**
   * off 删除消息队列里的内容
   * @param {*} type 事件名 (事件类型)
   * @param {*} callback 回调函数
   */
  off(type, callback) {
    // 判断是否有订阅，即消息队列里是否有type这个类型的事件，没有的话就直接return
    if (!this.message[type]) return;
    // 判断是否有callback这个参数
    if (!callback) {
      // 如果没有callback,就删掉整个事件
      this.message[type] = undefined;
      return;
    }
    // 如果有callback,就仅仅删掉callback这个消息(过滤掉这个消息方法)
    this.message[type] = this.message[type].filter((item) => item !== callback);
  }

  /**
   * emit 触发消息队列里的内容
   * @param {*} type 事件名 (事件类型)
   */
  emit(type, ...arg) {
    // 判断是否有订阅
    if (!this.message[type]) return;
    // 如果有订阅，就对这个`type`事件做一个轮询 (for循环)
    this.message[type].forEach((item) => {
      // 挨个执行每一个消息的回调函数callback
      item(...arg);
    });
  }
}

class OpenLayerMap implements MapImplements {
  private _mapInstance: any;
  options: Options;
  overlaysArr: OverlaysArr;
  constructor(options: Options) {
    const defaultOptions = {
      container: "container",
      zoom: 18,
      center: [104.06, 30.67],
      url: "http://webrd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
    };
    const mergedOptions = merge(defaultOptions, options);
    this.options = mergedOptions;
    this.overlaysArr = {
      iconArr: [],
      infoWindowArr: [],
      labelInfoWindowArr: [],
      lineArr: [],
    };
    this._initMap();
  }
  _initMap() {
    const openStreetMapLayer = new TileLayer({
      source: new XYZ({
        url: this.options.url,
      }),
    });

    this._mapInstance = new Map({
      layers: [openStreetMapLayer],
      view: new View({
        center: this.options.center,
        projection: "EPSG:4326",
        zoom: this.options.zoom,
        minZoom: 6, // 最小缩放级别
        maxZoom: 18, // 最大缩放级别
      }),
      target: this.options.container,
      controls: [],
    });
  }
  setFitView() {
    // 获取所有矢量图层的 extent
    const getAllVectorLayersExtent = () => {
      let allExtents: ol.Extent[] = [];
      // 遍历所有图层
      this._mapInstance.getLayers().forEach((layer) => {
        // 判断图层是否为矢量图层
        if (layer instanceof VectorLayer) {
          // 获取矢量图层的数据源
          const vectorSource = layer.getSource();
          // 获取数据源的 extent
          const extent: ol.Extent = vectorSource.getExtent();
          // 将 extent 添加到数组
          allExtents.push(extent);
        }
      });

      // 合并所有 extents
      const mergedExtent = allExtents.reduce((acc: any, extent) => {
        return acc ? extentExtend(acc, extent) : extent;
      }, null);

      return mergedExtent;
    };

    const allLayerExtent = getAllVectorLayersExtent();
    this._mapInstance.getView().fit(allLayerExtent, { padding: [100, 100, 100, 100] });
  }
  setZoomAndCenter(zoom, center) {
    this.setZoom(zoom);
    this.setCenter(center);
  }
  setCenter(...arg) {
    this._mapInstance.getView().setCenter(...arg);
  }
  setZoom(zoom: number) {
    this._mapInstance.getView().setZoom(zoom);
  }
  clearMap() {
    this.clearOverlays();
  }
  clearOverlays() {
    this.clearIcons();
    this.clearInfoWindow();
    this.clearLabelInfoWindow();
    this.clearLines();
  }
  clearIcons() {
    const icons = this.overlaysArr.iconArr;
    if (icons.length == 0) return;
    icons.forEach((item) => {
      item.clear();
    });
  }
  clearLines() {
    const lines = this.overlaysArr.lineArr;
    if (lines.length === 0) return;
    lines.forEach((item) => {
      item.clear();
    });
  }
  addIcon(iconOptions) {
    const defaultOptions = {
      image: {
        size: [0, 0],
        offset: [0, 0],
      },
      label: null,
    };

    const mergedOptions = merge(defaultOptions, iconOptions);
    const iconFeature: any = new Feature({
      geometry: new Point(mergedOptions.position),
    });
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1], // 底部中心对齐
        src: mergedOptions.image.src,
        offset: mergedOptions.offset ? [mergedOptions.offset?.[0], mergedOptions.offset?.[1]] : [0, 0],
        offsetOrigin: mergedOptions.offset ? "bottom-left" : "top-left",
        size: [mergedOptions.image.size[0], mergedOptions.image.size[1]],
      }),
    });
    iconFeature.setStyle([iconStyle]);
    const id = Date.now() + Math.random();
    iconFeature.setId(id);

    const vectorSource = new VectorSource({
      features: [iconFeature],
    });
    this.overlaysArr.iconArr.push(vectorSource);
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    this._mapInstance.addLayer(vectorLayer);
    iconFeature.setLabelContent = (labelOptions) => {
      this.clearLabelInfoWindow();
      const defaultLabelOptions = {
        content: "",
        offset: [0, 0],
        // anchor: 'top-left'
        anchor: "bottom-left",
      };
      const mergedLabelOptions = merge(defaultLabelOptions, labelOptions);
      if (typeof labelOptions.content === "string") {
        const info = document.createElement("div");
        const middle = document.createElement("div");
        middle.innerHTML = labelOptions.content;
        info.append(middle);
        mergedLabelOptions.content = info;
      }
      const position = iconFeature.getGeometry()?.getCoordinates();
      const labelPopup = this.addInfoWindow(
        {
          content: mergedLabelOptions.content,
          position: position,
          open: true,
          // offset: mergedLabelOptions.offset,
          // positioning: mergedLabelOptions.anchor
        },
        true
      );
      iconFeature.label = labelPopup;
    };
    mergedOptions.label && iconFeature.setLabelContent(mergedOptions.label);
    this._mapInstance.on("click", (event) => {
      this._mapInstance.forEachFeatureAtPixel(event.pixel, (feature) => {
        if (feature.getId() === id) {
          typeof mergedOptions.onClick === "function" && mergedOptions.onClick(event.coordinate);
        }
      });
    });
    return iconFeature;
  }
  addInfoWindow(infoWindowOptions, isLabel) {
    const defaultOptions = {
      open: false,
      offset: [0, 0],
      positioning: [0, 0],
    };
    const mergedOptions = merge(defaultOptions, infoWindowOptions);
    const popup: any = new Overlay({
      element: infoWindowOptions.content,
      positioning: mergedOptions.positioning,
      offset: mergedOptions.offset,
      // positioning: 'bottom-center'
      // autoPan: {
      //   animation: {
      //     duration: 250
      //   }
      // }
    });
    if (isLabel) {
      this.overlaysArr.labelInfoWindowArr.push(popup);
    } else {
      this.overlaysArr.infoWindowArr.push(popup);
    }
    this._mapInstance.addOverlay(popup);
    if (mergedOptions.open) {
      popup.setPosition(infoWindowOptions.position);
    }
    popup.openInfoWindow = () => {
      popup.setPosition(infoWindowOptions.position);
    };
    popup.closeInfoWindow = () => {
      popup.setPosition(undefined);
      return false;
    };
    return popup;
  }
  clearLabelInfoWindow() {
    const infoWindows = this.overlaysArr.labelInfoWindowArr;
    infoWindows.forEach((item) => item.setPosition(undefined));
  }
  clearInfoWindow() {
    const infoWindows = this.overlaysArr.infoWindowArr;
    infoWindows.forEach((item) => item.setPosition(undefined));
  }
  addLines(options) {
    const defaultOptions = {
      map: this._mapInstance,
      color: "#f00",
      opacity: 0.8,
      width: 3,
    };
    const mergedOptions = merge(defaultOptions, options);
    const polylineOptions: Polyline = pickNotEmptyObject({
      map: mergedOptions.map,
      path: mergedOptions.path,
      strokeColor: mergedOptions.color,
      strokeOpacity: mergedOptions.opacity,
      strokeWeight: mergedOptions.width,
    });
    const lineString = new LineString(polylineOptions.path);
    const routeFeature = new Feature({
      type: "route",
      geometry: lineString,
    });
    const iconStyle = new Style({
      stroke: new Stroke({ color: polylineOptions.strokeColor, width: polylineOptions.strokeWeight }),
    });

    routeFeature.setStyle([iconStyle]);
    const vectorSource = new VectorSource({
      features: [routeFeature],
    });
    this.overlaysArr.lineArr.push(vectorSource);
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    this._mapInstance.addLayer(vectorLayer);
    return routeFeature;
  }

  addAnimation(animationOptions) {
    const allLineArr = animationOptions.line.path;
    if (!allLineArr || !Array.isArray(allLineArr) || allLineArr?.length === 0) return;
    this.addLines(animationOptions.line);
    this.addLines(animationOptions.line);
    const passedLine: any = this.addLines(animationOptions.passedLine);
    const marker = this.addIcon(animationOptions.marker);
    let currentPoint: CurrentPoint = {
      betweenTwoPoint: false,
      path: [allLineArr[0]], // 取线路的第一个点
      pathWithRInfo: [allLineArr[0]], // 取线路的第一个点
      allPath: allLineArr, // 线路
      animationPath: allLineArr, // 线路
      shouldConcatBefore: false,
      oldPath: [],
      animationStatus: AnimationStatus.INIT,
      duration: animationOptions.animation.duration,
      directResume: true,
    };
    let startAnimationTimeout;
    const animation = new Observer();

    marker.start = (timer) => {
      const timeoutTimer = timer || 700;
      if (!animationOptions.line.path || animationOptions.line.path.length === 0) return;
      if (startAnimationTimeout) clearTimeout(startAnimationTimeout);

      startAnimationTimeout = setTimeout(() => {
        marker._moveAlong(animationOptions.line.path, {
          duration: currentPoint.duration,
          autoRotation: false,
        });
        currentPoint = {
          ...currentPoint,
          animationStatus: AnimationStatus.PLAYING,
        };
        this.setZoomAndCenter(18, animationOptions.line.path[0]);
      }, timeoutTimer);
      typeof animationOptions.onStart === "function" && animationOptions.onStart();
    };

    marker.pause = () => {
      marker._pauseMove();
      currentPoint = {
        ...currentPoint,
        oldPath: currentPoint.path,
        animationStatus: AnimationStatus.PAUSE,
      };
    };
    marker.resume = () => {
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
      marker._moveAlong(animationPath, {
        duration: currentPoint.duration,
        autoRotation: false,
      });
      currentPoint = {
        ...currentPoint,
        directResume: true,
        animationStatus: AnimationStatus.RESUME,
      };
      typeof animationOptions.onResume === "function" &&
        animationOptions.onResume({
          path: currentPoint.animationPath,
          animationStatus: currentPoint.animationStatus,
        });
    };
    marker.stop = () => {
      marker.stopMove();
    };
    marker.changeSteps = (step: number, changeStepsCall) => {
      if (step === 0) return;
      marker.pause();

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
          animationStatus: AnimationStatus.END,
          shouldConcatBefore: false,
        };
        if (startAnimationTimeout) clearTimeout(startAnimationTimeout);
      }
      if (stepPassedPath.length === 1) {
        currentPoint = {
          ...currentPoint,
          animationStatus: AnimationStatus.INIT,
          shouldConcatBefore: false,
        };
        if (startAnimationTimeout) clearTimeout(startAnimationTimeout);
      }
      if (stepPassedPath.length > 0) {
        passedLine.getGeometry().setCoordinates(stepPassedPath);
        const markerPosition = stepPassedPath[stepPassedPath.length - 1];
        marker.getGeometry().setCoordinates(markerPosition);
        this.setCenter(markerPosition, true);
      }
      if (typeof changeStepsCall === "function")
        changeStepsCall({
          step,
          path: currentPoint.path,
          animationStatus: currentPoint.animationStatus,
        });
    };
    marker.changeSpeed = (duration: number) => {
      currentPoint = {
        ...currentPoint,
        directResume: false,
        duration,
        shouldConcatBefore: true,
        oldPath: currentPoint.path,
      };
      if (currentPoint.animationStatus === AnimationStatus.PLAYING || currentPoint.animationStatus === AnimationStatus.RESUME) {
        marker.pause();
        marker.resume();
      }
    };
    animation.on("moving", (e) => {
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
      passedLine.getGeometry().setCoordinates(passedPath);
      this.setCenter(e.target.getPosition(), true);
      typeof animationOptions.onMoving === "function" && animationOptions.onMoving(e);
    });
    animation.on("moveend", () => {
      // 每走完一个point，就会执行moveend
      typeof animationOptions.onMoveEnd === "function" && animationOptions.onMoveEnd();
    });
    animation.on("movealong", () => {
      currentPoint.shouldConcatBefore = false;
      currentPoint.animationStatus = AnimationStatus.END;
      typeof animationOptions.onMoveAlong === "function" && animationOptions.onMoveAlong();
    });
    marker.getInfo = () => {
      return {
        path: currentPoint.path,
        animationStatus: currentPoint.animationStatus,
      };
    };

    // 自定义动画
    let timeout = false;
    let timeoutTimer;
    marker._moveAlong = (path, options) => {
      const duration = options.duration;
      let movingPoint;
      // let movingIndex
      const timer = 10;
      const movingPath = path;
      let currentIndex = 0;
      // movingIndex = currentPoint.routeIndex
      //计时器开始
      const timeStart = () => {
        movingPoint = movingPath[currentIndex];
        timeout = false;
        const time = () => {
          if (timeout) return;
          if (currentIndex + 1 >= movingPath.length) {
            //从头开始
            // currentPoint.routeIndex = 0;
            //移除要素
            animation.emit("movealong");
            currentIndex = 0;
            clearIntervalTime();
            //重复运动
            return;
          }
          // 到达下一个点了 需要变化
          const nextPosition = nextPoint();
          const passedPath = movingPath.slice(0, currentIndex + 1).concat([movingPoint]);
          const passedPathWithR = movingPath.slice(0, currentIndex + 1).concat({ lng: movingPoint[0], lat: movingPoint[1] });
          if (marker && marker.label && animationOptions.marker.label.content) {
            marker.label.setPosition(movingPoint);
          }
          animation.emit("moving", {
            index: currentIndex,
            passedPath,
            passedPathWithR,
            target: {
              getPosition: () => {
                return movingPoint;
              },
            },
          });
          if (nextPosition === movingPath[currentIndex + 1]) {
            currentIndex++;
            animation.emit("moveend", "这是测试");
          }
          //改变坐标点
          marker.getGeometry().setCoordinates(nextPosition);
          timeoutTimer = setTimeout(time, timer);
        };
        time();
      };

      //计算下一个点的位置
      //这里的算法是计算了两点之间的点   两点之间的连线可能存在很多个计算出来的点
      const nextPoint = () => {
        let routeIndex = currentIndex;
        let p1 = movingPoint; //获取在屏幕的像素位置
        let p2 = movingPath[routeIndex + 1];
        let dx = p2[0] - p1[0];
        let dy = p2[1] - p1[1];
        //在没有走到下一个点之前，下一个点是不变的，前一个点以这个点为终点向其靠近
        // 步长
        const distanceBetween = getDistance(movingPath[routeIndex], movingPath[routeIndex + 1]);
        const dis = getDistance(p1, p2);
        const step = (distanceBetween / duration) * timer;
        const count = Math.round(dis / step);
        if (step === 0 || count < 1) {
          movingPoint = movingPath[routeIndex + 1];
          return movingPath[routeIndex + 1];
        } else {
          let x = p1[0] + dx / count;
          let y = p1[1] + dy / count;
          let coor = [x, y];
          movingPoint = coor; //这里会将前一个点重新赋值  要素利用这个坐标变化进行移动
          return coor;
        }
      };
      timeStart();
    };
    const clearIntervalTime = () => {
      if (timeoutTimer) clearTimeout(timeoutTimer);
      timeout = true;
    };
    marker._pauseMove = () => {
      clearIntervalTime();
    };
    marker.stopMove = () => {
      clearIntervalTime();
    };
    return marker;
  }
}

export default OpenLayerMap;
