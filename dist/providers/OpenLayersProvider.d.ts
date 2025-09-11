import "ol/ol.css";
import { BaseMapProvider } from "./BaseMapProvider";
import { IMarker, MapConfig, MarkerConfig, MarkerClusterPoint, MarkerClusterOptions, IMarkerCluster, PolygonConfig, PolylineConfig, IPolyline, IPolygon, AnimationConfig, IAnimation } from "../types";
export declare class OpenLayersProvider extends BaseMapProvider {
    private ol;
    private vectorLayer;
    private vectorSource;
    /**
     * 动态加载OpenLayers SDK
     */
    private loadOpenLayersSDK;
    init(config: MapConfig): Promise<void>;
    addMarker(config: MarkerConfig): Promise<IMarker>;
    addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster>;
    setCenter(position: [number, number], immediately?: boolean): void;
    setZoom(zoom: number): void;
    setZoomAndCenter(zoom: number, center: [number, number]): void;
    setFitView(options?: {
        padding?: number;
        maxZoom?: number;
    }): Promise<void>;
    getAddressList(value: string, config: any): Promise<any>;
    /**
     * 检查范围是否有效
     */
    isEmptyExtent(extent: number[]): boolean;
    calculateSafeExtent(layersExtent: any): Promise<number[] | null>;
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
