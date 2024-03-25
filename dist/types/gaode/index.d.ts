import "@amap/amap-jsapi-types";
import { MapOptions } from "../types";
import { MapImplements } from "../types";
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
    getAddressList(keywords: string, city: string): Promise<unknown>;
}
export default GaodeMap;
