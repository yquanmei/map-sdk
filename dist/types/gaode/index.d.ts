import "@amap/amap-jsapi-types";
import { MapOptions, MapImplements, GeoOptions } from "../types";
declare class GaodeMap implements MapImplements {
    options: MapOptions;
    _mapLoader: any;
    private _mapInstance;
    constructor(options: MapOptions);
    loadMap(): Promise<void>;
    private _complete;
    setFitView(): void;
    setCenter(center: any, immediately?: boolean, duration?: number): void;
    setZoomAndCenter(zoom: any, center: any, immediately: any, duration?: any): void;
    clearMap(): void;
    addIcon(iconOptions: any): any;
    addInfoWindow(infoWindowOptions: any): any;
    clearInfoWindow(): void;
    addLines(options: any): any;
    addAnimation(animationOptions: any): any;
    getAddressLists(keywords: string, geoOptions: GeoOptions): Promise<unknown>;
    getAddress(position: [number, number], geoOptions: GeoOptions): Promise<unknown>;
    getMap(): any;
}
export default GaodeMap;
