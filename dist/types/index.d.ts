import { MapOptions, IconOptions, InfoWindowOptions, PolyLineOptions, AnimationOptions, ListResultItem, GeoOptions } from "./types";
import { LoaderOptions } from "./gaode/types";
declare class Map {
    _strategy: any;
    constructor(strategy: string, options: MapOptions | LoaderOptions);
    private _setStrategy;
    private _createGaodeMap;
    private _createOpenLayerMap;
    resetLoader(): void;
    createMap(options: MapOptions): void;
    setFitView(): void;
    setCenter(center: [number, number]): void;
    getBounds(): any;
    getCenter(): any;
    setZoomAndCenter(zoom: number, center: [number, number], time: number): void;
    clearMap(): void;
    addIcon(options: IconOptions): any;
    addInfoWindow(options: InfoWindowOptions): any;
    clearInfoWindow(): any;
    addLines(options: PolyLineOptions): any;
    addAnimation(options: AnimationOptions): any;
    getAddressLists(keywords: string, geoOptions: GeoOptions): ListResultItem[];
    getAddress(position: [number, number], geoOptions: GeoOptions): any;
    getMap(): any;
    destroyMap(): any;
}
export default Map;
