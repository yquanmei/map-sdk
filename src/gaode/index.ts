import AMapLoader from "@amap/amap-jsapi-loader";
import "@amap/amap-jsapi-types";
import type { MapOptions, AnimationStatus, MapImplements } from "../index.d.ts";
import type { CurrentPoint } from "./index.d.ts";
import { merge } from "lodash";

const pickNotEmptyObject = (data) => {
  return Object.keys(data)
    .filter((key) => data[key] !== null && data[key] !== undefined)
    .reduce((acc, key) => ({ ...acc, [key]: data[key] }), {});
};

class GaodeMap implements MapImplements {
  options: MapOptions;
  _mapLoader: any;
  private _mapInstance: any;
  constructor(options: MapOptions) {
    const defaultOptions = {
      container: "",
      key: "",
      token: "",
      zoom: 10,
      mapStyle: "",
      onSuccess: () => {},
      center: [0, 0],
      viewMode: "2D",
    };
    this.options = merge(defaultOptions, options);
    this.loadMap();
  }
  async loadMap() {
    const defaultLoadOptions = {
      key: this.options.key, // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      AMapUI: {
        version: "1.1",
        plugins: [],
      },
    };

    this._mapLoader = await AMapLoader.load({
      ...defaultLoadOptions,
      plugins: this.options?.plugins,
    });
    const defaultMapOptions = {
      pitchEnable: true,
      pitch: 40,
      rotation: -15,
    };
    const mergedMapOptions = merge(defaultMapOptions, {
      zoom: this.options.zoom,
      mapStyle: this.options.mapStyle,
      center: this.options.center,
      viewMode: this.options.viewMode,
    });
    this._mapInstance = new this._mapLoader.Map(this.options.container, mergedMapOptions);
    this._complete();
  }
  private _complete(): void {
    this._mapInstance.on("complete", () => {
      typeof this.options.onSuccess === "function" && this.options.onSuccess();
    });
  }
  setFitView() {
    this._mapInstance.setFitView();
  }
  setCenter(center, immediately?: boolean, duration?: number) {
    this._mapInstance.setCenter(center, immediately, duration);
  }
  setZoomAndCenter(zoom, center, immediately, duration?) {
    this._mapInstance.setZoomAndCenter(zoom, center, immediately, duration);
  }
  clearMap() {
    this._mapInstance && this._mapInstance.clearMap();
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
    // 创建一个icon
    const icon = new this._mapLoader.Icon({
      image: mergedOptions.image.src,
      imageSize: new this._mapLoader.Size(mergedOptions.image.size[0], mergedOptions.image.size[1]),
    });
    const marker = new this._mapLoader.Marker({
      icon,
      position: mergedOptions.position,
      anchor: "bottom-center",
      label: {
        content: mergedOptions?.label?.content,
      },
      offset: (mergedOptions.offset && new this._mapLoader.Pixel(mergedOptions.offset?.[0], mergedOptions.offset?.[1])) || [0, 0],
    });
    marker.setLabelContent = (labelOptions) => {
      const defaultLabelOptions = {
        content: "",
        offset: [0, 0],
        direction: "right",
      };
      const mergedLabelOptions = merge(defaultLabelOptions, labelOptions);
      marker.setLabel({
        content: mergedLabelOptions.content,
        // offset: new this._mapLoader.Pixel(mergedLabelOptions.offset[0], mergedLabelOptions.offset[1])
      });
    };
    iconOptions.label && marker.setLabelContent(iconOptions.label);
    // setLabelContent()
    marker.on("click", (e) => {
      typeof iconOptions.onClick === "function" && iconOptions.onClick(e.target.getPosition());
    });
    this._mapInstance.add(marker);
    return marker;
  }
  addInfoWindow(infoWindowOptions) {
    const defaultOptions = {
      open: false,
    };
    const mergedOptions = merge(defaultOptions, infoWindowOptions);
    const infoWindow = new this._mapLoader.InfoWindow({
      isCustom: true,
      content: mergedOptions.content,
    });
    if (mergedOptions.open) {
      infoWindow.open(this._mapInstance, mergedOptions.position);
    }
    infoWindow.openInfoWindow = () => {
      infoWindow.open(this._mapInstance, mergedOptions.position);
    };
    infoWindow.closeInfoWindow = () => {
      infoWindow.close();
    };
    return infoWindow;
  }
  clearInfoWindow() {
    this._mapInstance.clearInfoWindow();
  }
  addLines(options) {
    const defaultOptions = {
      map: this._mapInstance,
      color: "#f00",
      opacity: 0.8,
      width: 3,
    };
    const mergedOptions = merge(defaultOptions, options);
    const polylineOptions = pickNotEmptyObject({
      map: mergedOptions.map,
      path: mergedOptions.path,
      strokeColor: mergedOptions.color,
      strokeOpacity: mergedOptions.opacity,
      strokeWeight: mergedOptions.width,
    });
    const line = new this._mapLoader.Polyline(polylineOptions);
    return line;
  }
  addAnimation(animationOptions) {
    const allLineArr = animationOptions.line.path;
    if (!allLineArr || !Array.isArray(allLineArr) || allLineArr?.length === 0) return;
    if (animationOptions.grasp) {
      let graspRoad = new this._mapLoader.GraspRoad();
      const that = this;
      const pathParam = animationOptions.line.path.map((item, index) => {
        return {
          x: item[0],
          y: item[1],
          sp: 0,
          ag: 0,
          tm: index + 1,
        };
      });
      graspRoad.driving(pathParam, function (error, result) {
        if (!error) {
          var path2: [number, number][] = [];
          var newPath: { x: number; y: number }[] = result.data.points;
          for (var i = 0; i < newPath.length; i += 1) {
            path2.push([newPath[i].x, newPath[i].y]);
          }
          var newLine = {
            path: path2,
            width: 8,
            opacity: 0.8,
            color: "#f00",
            showDir: true,
          };
          that.addLines(newLine);
        }
      });
    }
    this.addLines(animationOptions.line);
    const passedLine = this.addLines(animationOptions.passedLine);
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

    marker.start = (timer) => {
      const timeoutTimer = timer || 800;
      if (!animationOptions.line.path || animationOptions.line.path.length === 0) return;
      if (startAnimationTimeout) clearTimeout(startAnimationTimeout);

      startAnimationTimeout = setTimeout(() => {
        marker.moveAlong(animationOptions.line.path, {
          duration: currentPoint.duration,
          autoRotation: false,
        });
        currentPoint = {
          ...currentPoint,
          animationStatus: AnimationStatus.PLAYING,
        };
        this.setZoomAndCenter(18, animationOptions.line.path[0], false, 100);
      }, timeoutTimer);
      typeof animationOptions.onStart === "function" && animationOptions.onStart();
    };
    marker.pause = () => {
      marker.pauseMove();
      currentPoint = {
        ...currentPoint,
        oldPath: currentPoint.path,
        animationStatus: AnimationStatus.PAUSE,
      };
    };
    marker.resume = () => {
      if (currentPoint.directResume) {
        marker.resumeMove();
      } else {
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
        marker.moveAlong(animationPath, {
          duration: currentPoint.duration,
          autoRotation: false,
        });
      }
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
    // 改变步数
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
        passedLine.setPath(stepPassedPath);
        const markerPosition = stepPassedPath[stepPassedPath.length - 1];
        marker.setPosition(markerPosition);
        this.setCenter(markerPosition, true);
        // 注意，如果animationOptions.onMoving() 写了setCenter。这里的setCenter(markerPosition, true)会不生效，因为虽然没有在moving，但是moving中的setCenter还在执行，会将这里覆盖，导致这里不生效，所以可以在changeStepsCall中执行
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
        marker.resume();
      }
    };
    marker.on("moving", (e) => {
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
      typeof animationOptions.onMoving === "function" && animationOptions.onMoving(e);
    });
    marker.on("moveend", () => {
      // 每走完一个point，就会执行moveend
      typeof animationOptions.onMoveEnd === "function" && animationOptions.onMoveEnd();
    });
    marker.on("movealong", () => {
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
    return marker;
  }
}
export default GaodeMap;