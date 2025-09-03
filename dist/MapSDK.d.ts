import { MapProvider, MapSDKConfig, MarkerConfig, IMarker, MarkerClusterPoint, MarkerClusterOptions, IMarkerCluster, AnimationConfig, IAnimation, PolygonConfig, IPolygon, ClearParams } from "./types";
import { IMapProvider } from "./types";
export declare class MapSDKError extends Error {
    readonly code?: string;
    constructor(message: string, code?: string);
}
export declare const ERROR_CODES: {
    readonly NOT_INITIALIZED: "NOT_INITIALIZED";
    readonly ALREADY_INITIALIZED: "ALREADY_INITIALIZED";
    readonly UNSUPPORTED_PROVIDER: "UNSUPPORTED_PROVIDER";
    readonly INVALID_CONFIG: "INVALID_CONFIG";
};
export declare class MapSDK {
    private provider;
    private isInitialized;
    constructor(provider: MapProvider);
    /**
     * 检查地图是否已初始化，未初始化则抛出错误
     */
    private ensureInitialized;
    /**
     * 验证配置参数
     */
    private validateConfig;
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
     * 批量/条件清除标记点
     */
    clearMarkers(params?: ClearParams<IMarker>): void;
    /**
     * 添加标记点聚合
     * @param points 坐标点数组
     * @param options 聚合选项
     * @returns 标记点聚合实例
     */
    addMarkerCluster(points: readonly MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster>;
    /**
     * 批量/条件清除聚合
     */
    clearMarkerClusters(params?: ClearParams<IMarkerCluster>): void;
    /**
     * 设置地图中心点
     * @param position 中心点坐标 [经度, 纬度]
     */
    setCenter(position: readonly [number, number]): void;
    /**
     * 设置地图缩放级别
     * @param zoom 缩放级别
     */
    setZoom(zoom: number): void;
    /**
     * 同时设置地图缩放级别和中心点
     * @param zoom 缩放级别
     * @param center 中心点坐标 [经度, 纬度]
     */
    setZoomAndCenter(zoom: number, center: readonly [number, number]): void;
    /**
     * 获取地图缩放级别
     */
    getZoom(): number;
    /**
     * 自动调整地图视图以显示所有标记点
     * @param options
     */
    setFitView(options?: {
        padding?: number;
        maxZoom?: number;
    }): void;
    /**
     * 添加路径规划：驾车
     */
    addPathPlanning(options?: {
        readonly start: readonly [number, number] | string;
        readonly end: readonly [number, number] | string;
        readonly points?: readonly (readonly [number, number])[];
        readonly optimizeWaypoints?: boolean;
        readonly avoidHighways?: boolean;
        readonly avoidTolls?: boolean;
        readonly avoidFerries?: boolean;
        readonly onChange?: (points: readonly (readonly [number, number])[]) => void;
    }): Promise<unknown>;
    /**
     * 通过经纬度获取详细地址信息
     */
    getAddress(position: readonly [number, number]): Promise<unknown>;
    /**
     * 添加信息窗体（InfoWindow）
     */
    addInfoWindow(options: {
        readonly content: string | HTMLElement;
        readonly position: readonly [number, number];
        readonly open?: boolean;
    }): Promise<unknown>;
    /**
     * 绘制折线（Polyline）
     */
    addPolyline(options: {
        readonly path: readonly (readonly [number, number])[];
        readonly color?: string;
        readonly width?: number;
        readonly opacity?: number;
    }): Promise<unknown>;
    /**
     * 添加多边形
     */
    addPolygon(config: PolygonConfig): Promise<IPolygon>;
    /**
     * 清除多边形
     */
    clearPolygons(params?: ClearParams<IPolygon>): void;
    /**
     * 获取所有标记点
     * @returns 标记点数组
     */
    getMarkers(): readonly IMarker[];
    /**
     * 清除所有折线
     */
    clearPolylines(params?: ClearParams<any>): void;
    /**
     * 添加轨迹动画
     */
    addAnimation(config: AnimationConfig): Promise<IAnimation>;
    /**
     * 清除轨迹动画
     */
    clearAnimations(params?: ClearParams<IAnimation>): void;
    /**
     * 清除路径规划
     */
    clearPathPlannings(params?: ClearParams<any>): void;
    /**
     * 清除信息窗体
     */
    clearInfoWindows(params?: ClearParams<any>): void;
    /**
     * 清空地图所有内容
     */
    clearMap(): Promise<void>;
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
    static getSupportedProviders(): readonly MapProvider[];
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
