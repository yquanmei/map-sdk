import GaodeMap from "./gaode/index";
import OpenLayerMap from "./openlayer/index";
// import OpenlayerInstance from './openlayerMap'
import { MapOptions, IconOptions, InfoWindowOptions, PolyLineOptions, AnimationOptions, ListResultItem, GeoOptions } from "./types";

enum Strategy {
  GAODE = "gaode",
  OPENLAYER = "openlayer",
}
class Map {
  _strategy: any;
  constructor(strategy: string, options: MapOptions) {
    this._setStrategy(strategy, options);
  }
  private _setStrategy(strategy: string, options: MapOptions) {
    switch (strategy) {
      case Strategy.GAODE: {
        this._strategy = this._createGaodeMap(options);
        break;
      }
      case Strategy.OPENLAYER: {
        this._strategy = this._createOpenLayerMap(options);
        break;
      }
      default: {
        this._strategy = this._createGaodeMap(options);
        break;
      }
    }
  }
  private _createGaodeMap(options: MapOptions) {
    if (!options.token) {
      console.error("请添加您的token");
      return;
    }
    if (!options.key) {
      console.error("请添加您的高德key");
      return;
    }
    const newWindow = window as any;
    newWindow._AMapSecurityConfig = {
      securityJsCode: options.token,
    };
    return new GaodeMap(options);
  }
  private _createOpenLayerMap(options: MapOptions) {
    return new OpenLayerMap(options);
  }
  setFitView() {
    this._strategy.setFitView();
  }
  setCenter(center: [number, number]) {
    this._strategy.setCenter(center);
  }
  setZoomAndCenter(zoom: number, center: [number, number], time: number) {
    this._strategy.setZoomAndCenter(zoom, center, time);
  }
  clearMap() {
    this._strategy.clearMap();
  }
  // ============================ 图标 =============================
  addIcon(options: IconOptions) {
    return this._strategy.addIcon(options);
  }
  // ============================ 信息弹窗 =============================
  addInfoWindow(options: InfoWindowOptions) {
    return this._strategy.addInfoWindow(options);
  }
  clearInfoWindow() {
    return this._strategy.clearInfoWindow();
  }
  // ============================ 线 =============================
  addLines(options: PolyLineOptions) {
    return this._strategy.addLines(options);
  }
  // ============================ 动画 =============================
  addAnimation(options: AnimationOptions) {
    return this._strategy.addAnimation(options);
  }
  // ============================ 获取详细地址ip的对象数组 =============================
  getAddressLists(keywords: string, geoOptions: GeoOptions): ListResultItem[] {
    return this._strategy.getAddressLists(keywords, geoOptions);
  }
  // ============================ 根据坐标获取地址 =============================
  getAddress(position: [number, number], geoOptions: GeoOptions) {
    return this._strategy.getAddress(position, geoOptions);
  }
  // ============================ 地图方法 =============================
  getMap() {
    return this._strategy.getMap();
  }
  destroyMap() {
    return this._strategy.destroyMap();
  }
}

export default Map;
