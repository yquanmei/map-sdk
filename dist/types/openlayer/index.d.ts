import "ol/ol.css";
import Feature from "ol/Feature";
import { LineString } from "ol/geom";
import { MapImplements, GeoOptions, MapOptions } from "../types";
import { LoaderOptions, OverlaysArr } from "./types";
declare class OpenLayerMap implements MapImplements {
    private _mapInstance;
    overlaysArr: OverlaysArr;
    private _openStreetMapLayer;
    constructor(options: LoaderOptions);
    loadMap(options: LoaderOptions): void;
    createMap(options: MapOptions): void;
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
    getAddressLists(keywords: string, geoOptions: GeoOptions): void;
    getAddress(position: [number, number], geoOptions: GeoOptions): void;
    getMap(): void;
    getBounds(): void;
    getCenter(): void;
}
export default OpenLayerMap;
