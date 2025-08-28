import { IMapProvider, IMarker, MapConfig, MarkerConfig, MarkerClusterPoint, MarkerClusterOptions, IMarkerCluster, IAnimation, AnimationConfig, PolygonConfig, IPolygon } from "../types";
export declare abstract class BaseMapProvider implements IMapProvider {
    protected map: any;
    protected markers: Map<string, IMarker>;
    protected markerClusters: Map<string, IMarkerCluster>;
    protected polylines: any[];
    protected polygons: Map<string, IPolygon>;
    protected pathPlannings: Array<{
        directionsRenderer: any;
        clear?: () => void;
        remove?: () => void;
    }>;
    protected infoWindows: any[];
    protected animations: Map<string, IAnimation>;
    protected config: MapConfig;
    abstract init(config: MapConfig): Promise<void>;
    abstract addMarker(config: MarkerConfig): Promise<IMarker>;
    abstract clearMarkers(params?: {
        type?: string;
        markers?: Array<IMarker>;
    }): void;
    abstract addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster>;
    abstract clearMarkerClusters(params?: {
        type?: string;
        clusters?: Array<IMarkerCluster>;
    }): void;
    abstract addAnimation(config: AnimationConfig): Promise<IAnimation>;
    abstract clearAnimations(params?: {
        type?: string;
        animations?: Array<IAnimation>;
    }): void;
    abstract clearPolylines(params?: {
        type?: string;
        polylines?: any[];
    }): void;
    abstract addPolygon(config: PolygonConfig): Promise<IPolygon>;
    abstract clearPolygons(params?: {
        type?: string;
        polygons?: Array<IPolygon>;
    }): void;
    abstract clearPathPlannings(params?: {
        type?: string;
        pathPlannings?: any[];
    }): void;
    abstract clearInfoWindow(params?: {
        type?: string;
        infoWindows?: any[];
    }): void;
    abstract setCenter(position: [number, number]): void;
    abstract setZoom(zoom: number): void;
    abstract getZoom(): void;
    abstract destroy(): void;
    abstract clearMap(): Promise<void>;
    protected generateMarkerId(): string;
    protected generateClusterId(): string;
    protected addMarkerToCollection(marker: IMarker): void;
    protected removeMarkerFromCollection(markerId: string): void;
    protected addClusterToCollection(cluster: IMarkerCluster): void;
    protected removeClusterFromCollection(clusterId: string): void;
    protected addPolylinesToCollection(polyline: any): void;
    protected removePolylineFromCollection(polyline: any): void;
    protected addPathPlanningToCollection(pathPlanning: any): void;
    protected removePathPlanningFromCollection(pathPlanning: any): void;
    protected addInfoWindowToCollection(infoWindow: any): void;
    protected removeInfoWindowFromCollection(infoWindow: any): void;
    protected addAnimationToCollection(animation: IAnimation): void;
    protected removeAnimationFromCollection(animationId: string): void;
    getMarkers(): IMarker[];
    getMarkerClusters(): IMarkerCluster[];
    getAnimations(): IAnimation[];
    getPolylines(): any[];
    getPathPlannings(): any[];
    getInfoWindows(): any[];
    protected clearAllMarkers(): void;
    protected clearAllMarkerClusters(): void;
    protected clearAllPolylines(): void;
    protected clearAllPathPlannings(): void;
    protected clearAllInfoWindows(): void;
    protected clearAllAnimations(): void;
    protected addPolygonToCollection(polygon: IPolygon): void;
    protected removePolygonFromCollection(polygonId: string): void;
    getPolygons(): IPolygon[];
    protected clearAllPolygons(): void;
    protected generateAnimationId(): string;
    protected generatePolygonId(): string;
}
