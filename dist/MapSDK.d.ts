import { MapProvider, MapSDKConfig, MarkerConfig, IMarker, MarkerClusterPoint, MarkerClusterOptions, IMarkerCluster, AnimationConfig, IAnimation, PolygonConfig, IPolygon } from "./types";
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
     * 批量/条件清除标记点
     */
    clearMarkers(params?: {
        type?: string;
        markers?: Array<IMarker>;
    }): void;
    /**
     * 添加标记点聚合
     * @param points 坐标点数组
     * @param options 聚合选项
     * @returns 标记点聚合实例
     */
    addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster>;
    /**
     * 批量/条件清除聚合
     */
    clearMarkerClusters(params?: {
        type?: string;
        clusters?: Array<IMarkerCluster>;
    }): void;
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
    getZoom(): any;
    /**
     * 添加路径规划：驾车
     */
    addPathPlanning(options?: {
        start: [number, number] | string;
        end: [number, number] | string;
        points?: [number, number][];
        optimizeWaypoints?: boolean;
        avoidHighways?: boolean;
        avoidTolls?: boolean;
        avoidFerries?: boolean;
        onChange?: (points: [number, number][]) => void;
    }): Promise<any>;
    /**
     * 通过经纬度获取详细地址信息
     */
    getAddress(position: [number, number]): Promise<any>;
    /**
     * 添加信息窗体（InfoWindow）
     */
    addInfoWindow(options: {
        content: string | HTMLElement;
        position: [number, number];
        open?: boolean;
    }): Promise<any>;
    /**
     * 绘制折线（Polyline）
     */
    addPolyline(options: {
        path: [number, number][];
        color?: string;
        width?: number;
        opacity?: number;
    }): Promise<any>;
    /**
     * 添加多边形
     */
    addPolygon(config: PolygonConfig): Promise<IPolygon>;
    /**
     * 清除多边形
     */
    clearPolygons(params?: {
        type?: string;
        polygons?: Array<IPolygon>;
    }): void;
    /**
     * 获取所有标记点
     * @returns 标记点数组
     */
    getMarkers(): IMarker[];
    /**
     * 清除所有或部分标记点（无参时清空所有）
     */
    /**
     * 清除所有折线
     */
    clearPolylines(params?: {
        type?: string;
        polylines?: any[];
    }): void;
    /**
     * 添加轨迹动画
     */
    addAnimation(config: AnimationConfig): Promise<IAnimation>;
    /**
     * 清除轨迹动画
     */
    clearAnimations(params?: {
        type?: string;
        animations?: Array<IAnimation>;
    }): void;
    /**
     * 清除路径规划
     */
    clearPathPlannings(params?: {
        type?: string;
        pathPlannings?: any[];
    }): void;
    /**
     * 清除信息窗体
     */
    clearInfoWindow(params?: {
        type?: string;
        infoWindows?: any[];
    }): void;
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
