import { IMapProvider, IMarker, MapConfig, MarkerConfig } from '../types';
export declare abstract class BaseMapProvider implements IMapProvider {
    protected map: any;
    protected markers: Map<string, IMarker>;
    protected config: MapConfig;
    abstract init(config: MapConfig): Promise<void>;
    abstract addMarker(config: MarkerConfig): Promise<IMarker>;
    abstract removeMarker(marker: IMarker): void;
    abstract setCenter(position: [number, number]): void;
    abstract setZoom(zoom: number): void;
    abstract destroy(): void;
    protected generateMarkerId(): string;
    protected addMarkerToCollection(marker: IMarker): void;
    protected removeMarkerFromCollection(markerId: string): void;
    getMarkers(): IMarker[];
    clearMarkers(): void;
}
