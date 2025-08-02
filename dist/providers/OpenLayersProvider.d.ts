import { BaseMapProvider } from './BaseMapProvider';
import { IMarker, MapConfig, MarkerConfig } from '../types';
export declare class OpenLayersProvider extends BaseMapProvider {
    private ol;
    private vectorLayer;
    /**
     * 动态加载OpenLayers SDK
     */
    private loadOpenLayersSDK;
    init(config: MapConfig): Promise<void>;
    addMarker(config: MarkerConfig): Promise<IMarker>;
    removeMarker(marker: IMarker): void;
    setCenter(position: [number, number]): void;
    setZoom(zoom: number): void;
    destroy(): void;
}
declare global {
    interface Window {
        ol?: any;
    }
}
