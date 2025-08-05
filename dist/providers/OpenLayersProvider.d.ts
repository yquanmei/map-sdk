import { BaseMapProvider } from './BaseMapProvider';
import { IMarker, MapConfig, MarkerConfig, MarkerClusterPoint, MarkerClusterOptions, IMarkerCluster } from '../types';
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
    destroy(): void;
}
declare global {
    interface Window {
        ol?: any;
    }
}
