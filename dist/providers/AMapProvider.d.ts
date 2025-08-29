import { BaseMapProvider } from "./BaseMapProvider";
import { IMarker, MapConfig, MarkerConfig, MarkerClusterPoint, MarkerClusterOptions, IMarkerCluster, PolygonConfig, IPolygon, AnimationConfig, IAnimation } from "../types";
export declare class AMapProvider extends BaseMapProvider {
    private AMap;
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
    setCenter(position: [number, number]): void;
    setZoom(zoom: number): void;
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
    clearInfoWindow(params?: {
        type?: string;
        infoWindows?: any[];
    }): void;
    clearMap(): Promise<void>;
    addAnimation(config: AnimationConfig): Promise<IAnimation>;
    clearAnimations(params?: {
        type?: string;
        animations?: Array<IAnimation>;
    }): void;
}
declare global {
    interface Window {
        AMap?: any;
    }
}
