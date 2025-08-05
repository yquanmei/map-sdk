import { MapProvider, MapSDKConfig, MarkerConfig, IMarker, MarkerClusterPoint, MarkerClusterOptions, IMarkerCluster } from './types';
import { MapProviderFactory } from './providers/MapProviderFactory';
import { IMapProvider } from './types';

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
      throw new Error('Map is already initialized');
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
      throw new Error('Map is not initialized. Call init() first.');
    }

    return await this.provider.addMarker(config);
  }

  /**
   * 移除标记点
   * @param marker 标记点实例
   */
  removeMarker(marker: IMarker): void {
    if (!this.isInitialized) {
      throw new Error('Map is not initialized. Call init() first.');
    }

    this.provider.removeMarker(marker);
  }

  /**
   * 添加标记点聚合
   * @param points 坐标点数组
   * @param options 聚合选项
   * @returns 标记点聚合实例
   */
  async addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster> {
    if (!this.isInitialized) {
      throw new Error('Map is not initialized. Call init() first.');
    }

    return await this.provider.addMarkerCluster(points, options);
  }

  /**
   * 移除标记点聚合
   * @param cluster 标记点聚合实例
   */
  removeMarkerCluster(cluster: IMarkerCluster): void {
    if (!this.isInitialized) {
      throw new Error('Map is not initialized. Call init() first.');
    }

    this.provider.removeMarkerCluster(cluster);
  }

  /**
   * 设置地图中心点
   * @param position 中心点坐标 [经度, 纬度]
   */
  setCenter(position: [number, number]): void {
    if (!this.isInitialized) {
      throw new Error('Map is not initialized. Call init() first.');
    }

    this.provider.setCenter(position);
  }

  /**
   * 设置地图缩放级别
   * @param zoom 缩放级别
   */
  setZoom(zoom: number): void {
    if (!this.isInitialized) {
      throw new Error('Map is not initialized. Call init() first.');
    }

    this.provider.setZoom(zoom);
  }

  /**
   * 获取所有标记点
   * @returns 标记点数组
   */
  getMarkers(): IMarker[] {
    if (!this.isInitialized) {
      throw new Error('Map is not initialized. Call init() first.');
    }

    return (this.provider as any).getMarkers();
  }

  /**
   * 清除所有标记点
   */
  clearMarkers(): void {
    if (!this.isInitialized) {
      throw new Error('Map is not initialized. Call init() first.');
    }

    (this.provider as any).clearMarkers();
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