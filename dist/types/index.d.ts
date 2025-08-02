export declare enum MapProvider {
    AMAP = "amap",
    GOOGLE = "google",
    OPENLAYERS = "openlayers"
}
export interface MapConfig {
    container: string | HTMLElement;
    center?: [number, number];
    zoom?: number;
    apiKey?: string;
    [key: string]: any;
}
export interface MarkerConfig {
    position: [number, number];
    title?: string;
    content?: string;
    icon?: string;
    clickable?: boolean;
    draggable?: boolean;
    [key: string]: any;
}
export interface IMapProvider {
    init(config: MapConfig): Promise<void>;
    addMarker(config: MarkerConfig): Promise<IMarker>;
    removeMarker(marker: IMarker): void;
    setCenter(position: [number, number]): void;
    setZoom(zoom: number): void;
    destroy(): void;
}
export interface IMarker {
    id: string;
    position: [number, number];
    setPosition(position: [number, number]): void;
    setTitle(title: string): void;
    setContent(content: string): void;
    remove(): void;
    [key: string]: any;
}
export interface MapSDKConfig {
    container: string | HTMLElement;
    center?: [number, number];
    zoom?: number;
    apiKey?: string;
    [key: string]: any;
}
