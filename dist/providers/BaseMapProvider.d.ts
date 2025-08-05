import { IMapProvider, IMarker, MapConfig, MarkerConfig, MarkerClusterPoint, MarkerClusterOptions, IMarkerCluster } from '../types';
export declare abstract class BaseMapProvider implements IMapProvider {
    protected map: any;
    protected markers: Map<string, IMarker>;
    protected markerClusters: Map<string, IMarkerCluster>;
    protected config: MapConfig;
    abstract init(config: MapConfig): Promise<void>;
    abstract addMarker(config: MarkerConfig): Promise<IMarker>;
    abstract removeMarker(marker: IMarker): void;
    abstract addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster>;
    abstract removeMarkerCluster(cluster: IMarkerCluster): void;
    abstract setCenter(position: [number, number]): void;
    abstract setZoom(zoom: number): void;
    abstract destroy(): void;
    protected generateMarkerId(): string;
    protected generateClusterId(): string;
    protected addMarkerToCollection(marker: IMarker): void;
    protected removeMarkerFromCollection(markerId: string): void;
    protected addClusterToCollection(cluster: IMarkerCluster): void;
    protected removeClusterFromCollection(clusterId: string): void;
    getMarkers(): IMarker[];
    getMarkerClusters(): IMarkerCluster[];
    clearMarkers(): void;
    clearMarkerClusters(): void;
}
