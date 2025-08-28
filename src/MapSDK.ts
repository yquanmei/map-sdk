import {
  MapProvider,
  MapSDKConfig,
  MarkerConfig,
  IMarker,
  MarkerClusterPoint,
  MarkerClusterOptions,
  IMarkerCluster,
  AnimationConfig,
  IAnimation,
  PolygonConfig,
  IPolygon,
} from "./types";
import { MapProviderFactory } from "./providers/MapProviderFactory";
import { IMapProvider } from "./types";

export class MapSDK {
  private provider: IMapProvider;
  private isInitialized = false;

  constructor(provider: MapProvider) {
    if (!MapProviderFactory.isProviderSupported(provider)) {
      throw new Error(`Unsupported map provider: ${provider}`);
    }
    this.provider = MapProviderFactory.createProvider(provider);
  }

  /**
   * 初始化地图
   * @param config 地图配置
   */
  async init(config: MapSDKConfig): Promise<void> {
    if (this.isInitialized) {
      throw new Error("Map is already initialized");
    }

    await this.provider.init(config);
    this.isInitialized = true;
  }

  /**
   * 添加标记点
   * @param config 标记点配置
   * @returns 标记点实例
   */
  async addMarker(config: MarkerConfig): Promise<IMarker> {
    if (!this.isInitialized) {
      throw new Error("Map is not initialized. Call init() first.");
    }

    return await this.provider.addMarker(config);
  }

  /**
   * 批量/条件清除标记点
   */
  clearMarkers(params?: { type?: string; markers?: Array<IMarker> }): void {
    if (!this.isInitialized) {
      throw new Error("Map is not initialized. Call init() first.");
    }
    (this.provider as any).clearMarkers(params);
  }

  /**
   * 添加标记点聚合
   * @param points 坐标点数组
   * @param options 聚合选项
   * @returns 标记点聚合实例
   */
  async addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster> {
    if (!this.isInitialized) {
      throw new Error("Map is not initialized. Call init() first.");
    }

    return await this.provider.addMarkerCluster(points, options);
  }

  /**
   * 批量/条件清除聚合
   */
  clearMarkerClusters(params?: { type?: string; clusters?: Array<IMarkerCluster> }): void {
    if (!this.isInitialized) {
      throw new Error("Map is not initialized. Call init() first.");
    }
    (this.provider as any).clearMarkerClusters(params);
  }

  /**
   * 设置地图中心点
   * @param position 中心点坐标 [经度, 纬度]
   */
  setCenter(position: [number, number]): void {
    if (!this.isInitialized) {
      throw new Error("Map is not initialized. Call init() first.");
    }

    this.provider.setCenter(position);
  }

  /**
   * 设置地图缩放级别
   * @param zoom 缩放级别
   */
  setZoom(zoom: number): void {
    if (!this.isInitialized) {
      throw new Error("Map is not initialized. Call init() first.");
    }

    this.provider.setZoom(zoom);
  }

  getZoom() {
    if (!this.isInitialized) {
      throw new Error("Map is not initialized. Call init() first.");
    }
    return (this.provider as any).getZoom();
  }

  /**
   * 添加路径规划：驾车
   */
  async addPathPlanning(options?: {
    start: [number, number] | string;
    end: [number, number] | string;
    points?: [number, number][];
    optimizeWaypoints?: boolean;
    avoidHighways?: boolean;
    avoidTolls?: boolean;
    avoidFerries?: boolean;
    onChange?: (points: [number, number][]) => void;
  }): Promise<any> {
    if (!this.isInitialized) {
      throw new Error("Map is not initialized. Call init() first.");
    }

    return await (this.provider as any).addPathPlanning(options);
  }

  /**
   * 通过经纬度获取详细地址信息
   */
  async getAddress(position: [number, number]): Promise<any> {
    if (!this.isInitialized) {
      throw new Error("Map is not initialized. Call init() first.");
    }

    return await (this.provider as any).getAddress(position);
  }

  /**
   * 添加信息窗体（InfoWindow）
   */
  async addInfoWindow(options: { content: string | HTMLElement; position: [number, number]; open?: boolean }): Promise<any> {
    if (!this.isInitialized) {
      throw new Error("Map is not initialized. Call init() first.");
    }

    return await (this.provider as any).addInfoWindow(options);
  }

  /**
   * 绘制折线（Polyline）
   */
  async addPolyline(options: { path: [number, number][]; color?: string; width?: number; opacity?: number }): Promise<any> {
    if (!this.isInitialized) {
      throw new Error("Map is not initialized. Call init() first.");
    }
    return await (this.provider as any).addPolyline(options);
  }

  /**
   * 添加多边形
   */
  async addPolygon(config: PolygonConfig): Promise<IPolygon> {
    if (!this.isInitialized) {
      throw new Error("Map is not initialized. Call init() first.");
    }
    return await this.provider.addPolygon(config);
  }

  /**
   * 清除多边形
   */
  clearPolygons(params?: { type?: string; polygons?: Array<IPolygon> }): void {
    if (!this.isInitialized) {
      throw new Error("Map is not initialized. Call init() first.");
    }
    (this.provider as any).clearPolygons(params);
  }

  /**
   * 获取所有标记点
   * @returns 标记点数组
   */
  getMarkers(): IMarker[] {
    if (!this.isInitialized) {
      throw new Error("Map is not initialized. Call init() first.");
    }

    return (this.provider as any).getMarkers();
  }

  /**
   * 清除所有或部分标记点（无参时清空所有）
   */
  // clearAllMarkers(params?: { type?: string; markers?: Array<IMarker> }): void {
  //   this.clearMarkers(params)
  // }

  /**
   * 清除所有折线
   */
  clearPolylines(params?: { type?: string; polylines?: any[] }): void {
    if (!this.isInitialized) {
      throw new Error("Map is not initialized. Call init() first.");
    }
    (this.provider as any).clearPolylines(params);
  }

  /**
   * 添加轨迹动画
   */
  async addAnimation(config: AnimationConfig): Promise<IAnimation> {
    if (!this.isInitialized) {
      throw new Error("Map is not initialized. Call init() first.");
    }

    return await this.provider.addAnimation(config);
  }

  /**
   * 清除轨迹动画
   */
  clearAnimations(params?: { type?: string; animations?: Array<IAnimation> }): void {
    if (!this.isInitialized) {
      throw new Error("Map is not initialized. Call init() first.");
    }
    (this.provider as any).clearAnimations(params);
  }

  /**
   * 清除路径规划
   */
  clearPathPlannings(params?: { type?: string; pathPlannings?: any[] }): void {
    if (!this.isInitialized) {
      throw new Error("Map is not initialized. Call init() first.");
    }
    (this.provider as any).clearPathPlannings(params);
  }

  /**
   * 清除信息窗体
   */
  clearInfoWindow(params?: { type?: string; infoWindows?: any[] }): void {
    if (!this.isInitialized) {
      throw new Error("Map is not initialized. Call init() first.");
    }
    (this.provider as any).clearInfoWindow(params);
  }

  /**
   * 清空地图所有内容
   */
  async clearMap(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error("Map is not initialized. Call init() first.");
    }
    await (this.provider as any).clearMap();
  }

  /**
   * 销毁地图
   */
  destroy(): void {
    if (this.isInitialized) {
      this.provider.destroy();
      this.isInitialized = false;
    }
  }

  /**
   * 检查地图是否已初始化
   */
  isMapInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * 获取支持的地图提供者列表
   * @returns 支持的地图提供者数组
   */
  static getSupportedProviders(): MapProvider[] {
    return MapProviderFactory.getSupportedProviders();
  }

  /**
   * 检查地图提供者是否被支持
   * @param provider 地图提供者
   * @returns 是否支持
   */
  static isProviderSupported(provider: MapProvider): boolean {
    return MapProviderFactory.isProviderSupported(provider);
  }

  /**
   * 注册自定义地图提供者
   * @param provider 地图提供者枚举
   * @param providerClass 提供者类
   */
  static registerProvider(provider: MapProvider, providerClass: new () => IMapProvider): void {
    MapProviderFactory.registerProvider(provider, providerClass);
  }
}
