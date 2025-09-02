import { BaseMapProvider } from "./BaseMapProvider";
import { IMarker, MapConfig, MarkerConfig, MarkerClusterPoint, MarkerClusterOptions, IMarkerCluster, PolygonConfig, IPolygon, AnimationConfig, IAnimation } from "../types";
export declare class OpenLayersProvider extends BaseMapProvider {
    private ol;
    private vectorLayer;
    private clusterLayer;
    /**
     * 动态加载OpenLayers SDK
     */
    private loadOpenLayersSDK;
    init(config: MapConfig): Promise<void>;
    addMarker(config: MarkerConfig): Promise<IMarker>;
    addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster>;
    removeMarker(marker: IMarker): void;
    removeMarkerCluster(cluster: IMarkerCluster): void;
    setCenter(position: [number, number]): void;
    setZoom(zoom: number): void;
    setZoomAndCenter(zoom: number, center: [number, number]): void;
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
    private hexToRgb;
}
