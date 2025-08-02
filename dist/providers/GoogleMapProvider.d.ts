import { BaseMapProvider } from './BaseMapProvider';
import { IMarker, MapConfig, MarkerConfig } from '../types';
export declare class GoogleMapProvider extends BaseMapProvider {
    private google;
    /**
     * 动态加载Google Maps SDK
     * @param key Google Maps API密钥
     */
    private loadGoogleMapsSDK;
    init(config: MapConfig): Promise<void>;
    addMarker(config: MarkerConfig): Promise<IMarker>;
    removeMarker(marker: IMarker): void;
    setCenter(position: [number, number]): void;
    setZoom(zoom: number): void;
    destroy(): void;
}
declare global {
    interface Window {
        google?: {
            maps: any;
        };
    }
}
