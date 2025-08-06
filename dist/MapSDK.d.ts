import { MapProvider, MapSDKConfig, MarkerConfig, IMarker, MarkerClusterPoint, MarkerClusterOptions, IMarkerCluster } from "./types";
import { IMapProvider } from "./types";
export declare class MapSDK {
    private provider;
    private isInitialized;
    constructor(provider: MapProvider);
    /**
     * 初始化地图
     * @param config 地图配置
     */
    init(config: MapSDKConfig): Promise<void>;
    /**
     * 添加标记点
     * @param config 标记点配置
     * @returns 标记点实例
     */
    addMarker(config: MarkerConfig): Promise<IMarker>;
    /**
     * 移除标记点
     * @param marker 标记点实例
     */
    removeMarker(marker: IMarker): void;
    /**
     * 添加标记点聚合
     * @param points 坐标点数组
     * @param options 聚合选项
     * @returns 标记点聚合实例
     */
    addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster>;
    /**
     * 移除标记点聚合
     * @param cluster 标记点聚合实例
     */
    removeMarkerCluster(cluster: IMarkerCluster): void;
    /**
     * 设置地图中心点
     * @param position 中心点坐标 [经度, 纬度]
     */
    setCenter(position: [number, number]): void;
    /**
     * 设置地图缩放级别
     * @param zoom 缩放级别
     */
    setZoom(zoom: number): void;
    /**
     * 获取所有标记点
     * @returns 标记点数组
     */
    getMarkers(): IMarker[];
    /**
     * 清除所有标记点
     */
    clearMarkers(): void;
    /**
     * 销毁地图
     */
    destroy(): void;
    /**
     * 检查地图是否已初始化
     */
    isMapInitialized(): boolean;
    /**
     * 获取支持的地图提供者列表
     * @returns 支持的地图提供者数组
     */
    static getSupportedProviders(): MapProvider[];
    /**
     * 检查地图提供者是否被支持
     * @param provider 地图提供者
     * @returns 是否支持
     */
    static isProviderSupported(provider: MapProvider): boolean;
    /**
     * 注册自定义地图提供者
     * @param provider 地图提供者枚举
     * @param providerClass 提供者类
     */
    static registerProvider(provider: MapProvider, providerClass: new () => IMapProvider): void;
}
