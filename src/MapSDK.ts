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
  ClearParams,
} from "./types";
import { MapProviderFactory, MapProviderError } from "./providers/MapProviderFactory";
import { IMapProvider } from "./types";

// SDK错误类定义
export class MapSDKError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = "MapSDKError";
  }
}

// 错误代码常量
export const ERROR_CODES = {
  NOT_INITIALIZED: "NOT_INITIALIZED",
  ALREADY_INITIALIZED: "ALREADY_INITIALIZED",
  UNSUPPORTED_PROVIDER: "UNSUPPORTED_PROVIDER",
  INVALID_CONFIG: "INVALID_CONFIG",
} as const;

export class MapSDK {
  private provider: IMapProvider;
  private isInitialized = false;

  constructor(provider: MapProvider) {
    try {
      if (!MapProviderFactory.isProviderSupported(provider)) {
        throw new MapSDKError(`Unsupported map provider: ${provider}`, ERROR_CODES.UNSUPPORTED_PROVIDER);
      }
      this.provider = MapProviderFactory.createProvider(provider);
    } catch (error) {
      if (error instanceof MapProviderError) {
        throw new MapSDKError(error.message, ERROR_CODES.UNSUPPORTED_PROVIDER);
      }
      throw error;
    }
  }

  /**
   * 检查地图是否已初始化，未初始化则抛出错误
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new MapSDKError("Map is not initialized. Call init() first.", ERROR_CODES.NOT_INITIALIZED);
    }
  }

  /**
   * 验证配置参数
   */
  private validateConfig(config: MapSDKConfig): void {
    if (!config) {
      throw new MapSDKError("Config is required", ERROR_CODES.INVALID_CONFIG);
    }

    if (!config.container) {
      throw new MapSDKError("Container is required", ERROR_CODES.INVALID_CONFIG);
    }
  }

  /**
   * 初始化地图
   * @param config 地图配置
   */
  async init(config: MapSDKConfig): Promise<void> {
    if (this.isInitialized) {
      throw new MapSDKError("Map is already initialized", ERROR_CODES.ALREADY_INITIALIZED);
    }

    this.validateConfig(config);

    try {
      await this.provider.init(config);
      this.isInitialized = true;
    } catch (error) {
      throw new MapSDKError(`Failed to initialize map: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * 添加标记点
   * @param config 标记点配置
   * @returns 标记点实例
   */
  async addMarker(config: MarkerConfig): Promise<IMarker> {
    this.ensureInitialized();

    if (!config?.position) {
      throw new MapSDKError("Marker position is required", ERROR_CODES.INVALID_CONFIG);
    }

    try {
      return await this.provider.addMarker(config);
    } catch (error) {
      throw new MapSDKError(`Failed to add marker: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * 批量/条件清除标记点
   */
  clearMarkers(params?: ClearParams<IMarker>): void {
    this.ensureInitialized();
    this.provider.clearMarkers(params);
  }

  /**
   * 添加标记点聚合
   * @param points 坐标点数组
   * @param options 聚合选项
   * @returns 标记点聚合实例
   */
  async addMarkerCluster(points: readonly MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster> {
    this.ensureInitialized();

    if (!points || points.length === 0) {
      throw new MapSDKError("Cluster points are required", ERROR_CODES.INVALID_CONFIG);
    }

    try {
      return await this.provider.addMarkerCluster(points, options);
    } catch (error) {
      throw new MapSDKError(`Failed to add marker cluster: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * 批量/条件清除聚合
   */
  clearMarkerClusters(params?: ClearParams<IMarkerCluster>): void {
    this.ensureInitialized();
    this.provider.clearMarkerClusters(params);
  }

  /**
   * 设置地图中心点
   * @param position 中心点坐标 [经度, 纬度]
   */
  setCenter(position: readonly [number, number]): void {
    this.ensureInitialized();

    if (!position || position.length !== 2) {
      throw new MapSDKError("Invalid position format", ERROR_CODES.INVALID_CONFIG);
    }

    this.provider.setCenter(position);
  }

  /**
   * 设置地图缩放级别
   * @param zoom 缩放级别
   */
  setZoom(zoom: number): void {
    this.ensureInitialized();

    if (typeof zoom !== "number" || zoom < 0) {
      throw new MapSDKError("Invalid zoom level", ERROR_CODES.INVALID_CONFIG);
    }

    this.provider.setZoom(zoom);
  }

  /**
   * 同时设置地图缩放级别和中心点
   * @param zoom 缩放级别
   * @param center 中心点坐标 [经度, 纬度]
   */
  setZoomAndCenter(zoom: number, center: readonly [number, number]): void {
    this.ensureInitialized();

    if (typeof zoom !== "number" || zoom < 0) {
      throw new MapSDKError("Invalid zoom level", ERROR_CODES.INVALID_CONFIG);
    }

    if (!center || center.length !== 2) {
      throw new MapSDKError("Invalid center position format", ERROR_CODES.INVALID_CONFIG);
    }

    this.provider.setZoomAndCenter(zoom, center);
  }

  /**
   * 获取地图缩放级别
   */
  getZoom(): number {
    this.ensureInitialized();
    return this.provider.getZoom();
  }

  /**
   * 添加路径规划：驾车
   */
  async addPathPlanning(options?: {
    readonly start: readonly [number, number] | string;
    readonly end: readonly [number, number] | string;
    readonly points?: readonly (readonly [number, number])[];
    readonly optimizeWaypoints?: boolean;
    readonly avoidHighways?: boolean;
    readonly avoidTolls?: boolean;
    readonly avoidFerries?: boolean;
    readonly onChange?: (points: readonly (readonly [number, number])[]) => void;
  }): Promise<unknown> {
    this.ensureInitialized();

    if (!options?.start || !options?.end) {
      throw new MapSDKError("Start and end points are required", ERROR_CODES.INVALID_CONFIG);
    }

    try {
      return await (this.provider as any).addPathPlanning(options);
    } catch (error) {
      throw new MapSDKError(`Failed to add path planning: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * 通过经纬度获取详细地址信息
   */
  async getAddress(position: readonly [number, number]): Promise<unknown> {
    this.ensureInitialized();

    if (!position || position.length !== 2) {
      throw new MapSDKError("Invalid position format", ERROR_CODES.INVALID_CONFIG);
    }

    try {
      return await (this.provider as any).getAddress(position);
    } catch (error) {
      throw new MapSDKError(`Failed to get address: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * 添加信息窗体（InfoWindow）
   */
  async addInfoWindow(options: {
    readonly content: string | HTMLElement;
    readonly position: readonly [number, number];
    readonly open?: boolean;
  }): Promise<unknown> {
    this.ensureInitialized();

    if (!options?.content || !options?.position) {
      throw new MapSDKError("Content and position are required", ERROR_CODES.INVALID_CONFIG);
    }

    try {
      return await (this.provider as any).addInfoWindow(options);
    } catch (error) {
      throw new MapSDKError(`Failed to add info window: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * 绘制折线（Polyline）
   */
  async addPolyline(options: {
    readonly path: readonly (readonly [number, number])[];
    readonly color?: string;
    readonly width?: number;
    readonly opacity?: number;
  }): Promise<unknown> {
    this.ensureInitialized();

    if (!options?.path || options.path.length < 2) {
      throw new MapSDKError("Path with at least 2 points is required", ERROR_CODES.INVALID_CONFIG);
    }

    try {
      return await (this.provider as any).addPolyline(options);
    } catch (error) {
      throw new MapSDKError(`Failed to add polyline: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * 添加多边形
   */
  async addPolygon(config: PolygonConfig): Promise<IPolygon> {
    this.ensureInitialized();

    // if (!config.editable && (!config?.path || config.path.length < 3)) {
    //   throw new MapSDKError("Path with at least 3 points is required", ERROR_CODES.INVALID_CONFIG);
    // }

    try {
      return await this.provider.addPolygon(config);
    } catch (error) {
      throw new MapSDKError(`Failed to add polygon: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * 清除多边形
   */
  clearPolygons(params?: ClearParams<IPolygon>): void {
    this.ensureInitialized();
    this.provider.clearPolygons(params);
  }

  /**
   * 获取所有标记点
   * @returns 标记点数组
   */
  getMarkers(): readonly IMarker[] {
    this.ensureInitialized();
    return (this.provider as any).getMarkers() || [];
  }

  /**
   * 清除所有折线
   */
  clearPolylines(params?: ClearParams<any>): void {
    this.ensureInitialized();
    this.provider.clearPolylines(params);
  }

  /**
   * 添加轨迹动画
   */
  async addAnimation(config: AnimationConfig): Promise<IAnimation> {
    this.ensureInitialized();

    // if (!config?.path || config.path.length < 2) {
    //   throw new MapSDKError("Animation path with at least 2 points is required", ERROR_CODES.INVALID_CONFIG);
    // }

    try {
      return await this.provider.addAnimation(config);
    } catch (error) {
      throw new MapSDKError(`Failed to add animation: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * 清除轨迹动画
   */
  clearAnimations(params?: ClearParams<IAnimation>): void {
    this.ensureInitialized();
    this.provider.clearAnimations(params);
  }

  /**
   * 清除路径规划
   */
  clearPathPlannings(params?: ClearParams<any>): void {
    this.ensureInitialized();
    this.provider.clearPathPlannings(params);
  }

  /**
   * 清除信息窗体
   */
  clearInfoWindows(params?: ClearParams<any>): void {
    this.ensureInitialized();
    this.provider.clearInfoWindows(params);
  }

  /**
   * 清空地图所有内容
   */
  async clearMap(): Promise<void> {
    this.ensureInitialized();

    try {
      await this.provider.clearMap();
    } catch (error) {
      throw new MapSDKError(`Failed to clear map: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * 销毁地图
   */
  destroy(): void {
    if (this.isInitialized) {
      try {
        this.provider.destroy();
      } catch (error) {
        console.warn("Error during map destruction:", error);
      } finally {
        this.isInitialized = false;
      }
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
  static getSupportedProviders(): readonly MapProvider[] {
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
    try {
      MapProviderFactory.registerProvider(provider, providerClass);
    } catch (error) {
      throw new MapSDKError(`Failed to register provider: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}
