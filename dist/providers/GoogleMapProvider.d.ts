import { BaseMapProvider } from './BaseMapProvider';
import { IMarker, MapConfig, MarkerConfig, MarkerClusterPoint, MarkerClusterOptions, IMarkerCluster } from '../types';
interface GoogleMarker extends IMarker {
    googleMarker: any;
}
interface GoogleMarkerCluster extends IMarkerCluster {
    markerClusterer: any;
    googleMarkers: any[];
}
export declare class GoogleMapProvider extends BaseMapProvider {
    private google;
    private plugins;
    /**
     * 动态加载Google Maps SDK和MarkerClusterer库
     * @param key Google Maps API密钥
     */
    private loadGoogleMapsSDK;
    /**
     * 动态加载 MarkerClusterer 库
     */
    private loadMarkerClusterer;
    init(config: MapConfig): Promise<void>;
    setCenter(position: [number, number]): void;
    setZoom(zoom: number): void;
    destroy(): void;
    addMarker(config: MarkerConfig): Promise<IMarker>;
    addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster>;
    removeMarker(marker: IMarker): void;
    removeMarkerCluster(cluster: IMarkerCluster): void;
    removeMarkerFromCollection(markerId: string): void;
    addMarkerToCollection(marker: GoogleMarker): void;
    generateMarkerId(): string;
    generateClusterId(): string;
    addClusterToCollection(cluster: GoogleMarkerCluster): void;
    removeClusterFromCollection(clusterId: string): void;
}
declare global {
    interface Window {
        google?: {
            maps: any;
        };
        MarkerClusterer?: any;
    }
}
export {};
