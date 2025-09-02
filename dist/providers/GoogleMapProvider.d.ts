import { BaseMapProvider } from "./BaseMapProvider";
import { IMarker, MapConfig, MarkerConfig, MarkerClusterPoint, MarkerClusterOptions, IMarkerCluster, IAnimation, AnimationConfig, PolygonConfig, IPolygon } from "../types";
import "../css/google.css";
interface GoogleMarker extends IMarker {
    googleMarker: any;
    position: [number, number];
}
interface GoogleMarkerCluster extends IMarkerCluster {
    markerClusterer: any;
    googleMarkers: any[];
    points: MarkerClusterPoint[];
}
export declare class GoogleMapProvider extends BaseMapProvider {
    private google;
    /**
     * 动态加载Google Maps SDK
     * @param key Google Maps API密钥
     */
    private loadGoogleMapsSDK;
    init(config: MapConfig): Promise<void>;
    setCenter(position: [number, number]): void;
    setZoom(zoom: number): void;
    getZoom(): any;
    setZoomAndCenter(zoom: number, center: [number, number]): void;
    destroy(): void;
    addMarker(config: MarkerConfig, type?: string): Promise<IMarker>;
    addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<any>;
    /**
     * 按条件清除标记点
     * - 传入 markers：清除这些标记
     * - 传入 type：清除当前已收集到的、匹配该 type 的标记
     * 两者同时存在时，两类都会被清除
     */
    clearMarkers(params?: {
        type?: string;
        markers?: Array<IMarker | GoogleMarker | any>;
    }): void;
    /**
     * 按条件清除标记点聚合
     * - 传入 clusters：清除这些聚合
     * - 传入 type：清除当前已收集到的、匹配该 type 的聚合
     * 两者同时存在时，两类都会被清除
     * 如果没有参数，则清除所有聚合
     */
    clearMarkerClusters(params?: {
        type?: string;
        clusters?: Array<IMarkerCluster | GoogleMarkerCluster | any>;
    }): void;
    /**
     * 添加信息窗体（InfoWindow）
     * @param options { content, position: [lng, lat], open? }
     */
    addInfoWindow(options: {
        content: string | HTMLElement;
        position: [number, number];
        open?: boolean;
    }): Promise<any>;
    clearInfoWindow(params?: {
        type?: string;
        infoWindows?: any[];
    }): void;
    /**
     * 绘制折线（Polyline）
     */
    addPolyline(options: {
        path: [number, number][];
        css?: {
            color?: string;
            opacity?: number;
            width?: number;
        };
        color?: string;
        width?: number;
        opacity?: number;
    }): Promise<any>;
    clearPolylines(params?: {
        type?: string;
        polylines?: any[];
    }): void;
    /**
     * 计算路径规划：驾车
     * @param origin 起点坐标 [lng, lat]
     * @param destination 终点坐标 [lng, lat]
     * @param waypoints 途经点坐标数组 [lng, lat][]
     * @param options 其他选项
     * @returns 驾车路线结果
     */
    addPathPlanning(options: {
        start: [number, number] | string;
        end: [number, number] | string;
        points?: [number, number][];
        optimizeWaypoints?: boolean;
        avoidHighways?: boolean;
        avoidTolls?: boolean;
        avoidFerries?: boolean;
        onChange?: (points: [number, number][]) => void;
    }): Promise<any>;
    clearPathPlannings(params?: {
        type?: string;
        pathPlannings?: any[];
    }): void;
    /**
     * 通过经纬度获取详细地址信息
     * @param position 坐标 [lng, lat]
     * @returns 地址信息
     */
    getAddress(position: [number, number]): Promise<any>;
    clearMap(): Promise<void>;
    /**
     * 绘制多边形
     */
    addPolygon(config: PolygonConfig): Promise<IPolygon>;
    /**
     * 按条件清除多边形
     */
    clearPolygons(params?: {
        type?: string;
        polygons?: Array<IPolygon>;
    }): void;
    /**
     * 添加轨迹动画
     */
    addAnimation(config: AnimationConfig): Promise<IAnimation>;
    /**
     * 按条件清除轨迹动画
     */
    clearAnimations(params?: {
        type?: string;
        animations?: Array<IAnimation>;
    }): void;
    generateId(type: string): string;
}
export {};
