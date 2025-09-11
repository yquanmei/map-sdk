import "@amap/amap-jsapi-types";
import { BaseMapProvider } from "./BaseMapProvider";
import { IMarker, MapConfig, MarkerConfig, MarkerClusterPoint, MarkerClusterOptions, IMarkerCluster, PolygonConfig, IPolygon, AnimationConfig, IAnimation, PolylineConfig, IPolyline } from "../types";
export declare class AMapProvider extends BaseMapProvider {
    private AMap;
    private plugins;
    /**
     * 动态加载高德地图SDK
     * @param apiKey 高德地图API密钥
     */
    private loadAMapSDK;
    init(config: MapConfig): Promise<void>;
    addMarker(config: MarkerConfig): Promise<IMarker>;
    addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster>;
    removeMarker(marker: IMarker): void;
    removeMarkerCluster(cluster: IMarkerCluster): void;
    setCenter(position: [number, number], immediately?: boolean, duration?: number): void;
    setZoom(zoom: number): void;
    setZoomAndCenter(zoom: number, center: [number, number], immediately?: boolean, duration?: number): void;
    addInfoWindow(options: {
        content: string | HTMLElement;
        position: [number, number];
        open?: boolean;
    }): Promise<any>;
    destroy(): void;
    getZoom(): number;
    clearMarkers(params?: {
        type?: string;
        markers?: Array<IMarker>;
    }): void;
    clearMarkerClusters(params?: {
        type?: string;
        clusters?: Array<IMarkerCluster>;
    }): void;
    addPolyline(options: PolylineConfig): Promise<IPolyline>;
    clearPolylines(params?: {
        type?: string;
        polylines?: any[];
    }): void;
    addPolygon(config: PolygonConfig): Promise<IPolygon>;
    clearPolygons(params?: {
        type?: string;
        polygons?: Array<IPolygon>;
    }): void;
    clearPathPlannings(params?: {
        type?: string;
        pathPlannings?: any[];
    }): void;
    /**
     * 通过经纬度获取详细地址信息
     * @param position 坐标 [lng, lat]
     * @returns 地址信息
     */
    getAddressByLngLat(position: [number, number]): Promise<any>;
    getAddressList(value: string, config: any): Promise<any>;
    clearInfoWindows(params?: {
        type?: string;
        infoWindows?: any[];
    }): void;
    clearMap(): Promise<void>;
    addAnimation(config: AnimationConfig): Promise<IAnimation>;
    clearAnimations(params?: {
        type?: string;
        animations?: Array<IAnimation>;
    }): void;
    setFitView(): void;
}
