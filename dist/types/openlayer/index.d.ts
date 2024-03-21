import "ol/ol.css";
import Feature from "ol/Feature";
import { LineString } from "ol/geom";
import { MapImplements } from "../types";
import { Options, OverlaysArr } from "./index.d";
declare class OpenLayerMap implements MapImplements {
    private _mapInstance;
    options: Options;
    overlaysArr: OverlaysArr;
    constructor(options: Options);
    _initMap(): void;
    setFitView(): void;
    setZoomAndCenter(zoom: any, center: any): void;
    setCenter(...arg: any[]): void;
    setZoom(zoom: number): void;
    clearMap(): void;
    clearOverlays(): void;
    clearIcons(): void;
    clearLines(): void;
    addIcon(iconOptions: any): any;
    addInfoWindow(infoWindowOptions: any, isLabel: any): any;
    clearLabelInfoWindow(): void;
    clearInfoWindow(): void;
    addLines(options: any): Feature<LineString>;
    addAnimation(animationOptions: any): any;
}
export default OpenLayerMap;
