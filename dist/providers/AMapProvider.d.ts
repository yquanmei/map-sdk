import { BaseMapProvider } from './BaseMapProvider';
import { IMarker, MapConfig, MarkerConfig } from '../types';
export declare class AMapProvider extends BaseMapProvider {
    private AMap;
    /**
     * 动态加载高德地图SDK
     * @param apiKey 高德地图API密钥
     */
    private loadAMapSDK;
    init(config: MapConfig): Promise<void>;
    addMarker(config: MarkerConfig): Promise<IMarker>;
    removeMarker(marker: IMarker): void;
    setCenter(position: [number, number]): void;
    setZoom(zoom: number): void;
    destroy(): void;
}
declare global {
    interface Window {
        AMap?: any;
    }
}
