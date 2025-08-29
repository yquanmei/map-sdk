export declare const MAP_PROVIDERS: {
    readonly AMAP: "amap";
    readonly GOOGLE: "google";
    readonly OPENLAYERS: "openlayers";
};
export type MapProvider = (typeof MAP_PROVIDERS)[keyof typeof MAP_PROVIDERS];
export declare const MapProvider: {
    readonly AMAP: "amap";
    readonly GOOGLE: "google";
    readonly OPENLAYERS: "openlayers";
};
export declare const COVERING_TYPES: {
    readonly MARKER: "marker";
    readonly CLUSTER: "cluster";
    readonly POLYLINE: "polyline";
    readonly POLYGON: "polygon";
    readonly PATH_PLANNING: "path_planning";
    readonly INFO_WINDOW: "info_window";
    readonly ANIMATION: "animation";
};
export type CoveringType = (typeof COVERING_TYPES)[keyof typeof COVERING_TYPES];
export declare const CoveringType: {
    readonly MARKER: "marker";
    readonly CLUSTER: "cluster";
    readonly POLYLINE: "polyline";
    readonly POLYGON: "polygon";
    readonly PATH_PLANNING: "path_planning";
    readonly INFO_WINDOW: "info_window";
    readonly ANIMATION: "animation";
};
export interface BaseConfig {
    readonly id?: string;
    readonly data?: Record<string, unknown>;
}
export interface MapConfig extends BaseConfig {
    readonly container: string | HTMLElement;
    readonly center?: readonly [number, number];
    readonly zoom?: number;
    readonly key?: string;
    readonly [key: string]: unknown;
}
export interface MarkerConfig extends BaseConfig {
    readonly position: readonly [number, number];
    readonly title?: string;
    readonly content?: string;
    readonly icon?: string;
    readonly clickable?: boolean;
    readonly draggable?: boolean;
    readonly map?: boolean;
    readonly onClick?: (params: MarkerEventParams) => void;
    readonly onMouseover?: (params: MarkerMouseEventParams) => void;
    readonly onMouseout?: (params: MarkerMouseEventParams) => void;
    readonly [key: string]: unknown;
}
export interface MarkerEventParams {
    readonly event: Event;
    readonly content: HTMLElement;
    readonly data: unknown;
    readonly position: readonly [number, number];
    readonly marker: unknown;
}
export interface MarkerMouseEventParams {
    readonly event: Event;
    readonly content: HTMLElement;
    readonly data: unknown;
}
export interface MarkerClusterPoint extends BaseConfig {
    readonly position: readonly [number, number];
    readonly [key: string]: unknown;
}
export interface MarkerClusterOptions {
    readonly gridSize?: number;
    readonly renderClusterMarker?: string;
    readonly renderMarker?: MarkerConfig;
    readonly maxZoom?: number;
    readonly [key: string]: unknown;
}
export interface IMarkerCluster {
    readonly id: string;
    points: MarkerClusterPoint[];
    addPoint(point: MarkerClusterPoint): void;
    removePoint(point: MarkerClusterPoint): void;
    clear(): void;
    remove(): void;
    readonly [key: string]: unknown;
}
export interface ClearParams<T> {
    readonly type?: string;
    readonly items?: readonly T[];
}
export interface IMapProvider {
    init(config: MapConfig): Promise<void>;
    addMarker(config: MarkerConfig): Promise<IMarker>;
    clearMarkers(params?: ClearParams<IMarker>): void;
    addMarkerCluster(points: readonly MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster>;
    clearMarkerClusters(params?: ClearParams<IMarkerCluster>): void;
    addAnimation(config: AnimationConfig): Promise<IAnimation>;
    clearAnimations(params?: ClearParams<IAnimation>): void;
    clearPolylines(params?: ClearParams<any>): void;
    addPolygon(config: PolygonConfig): Promise<IPolygon>;
    clearPolygons(params?: ClearParams<IPolygon>): void;
    clearPathPlannings(params?: ClearParams<any>): void;
    clearInfoWindow(params?: ClearParams<any>): void;
    setCenter(position: readonly [number, number]): void;
    setZoom(zoom: number): void;
    getZoom(): number;
    destroy(): void;
    clearMap(): Promise<void>;
}
export interface IMarker {
    readonly id: string;
    position: [number, number];
    setPosition(position: readonly [number, number]): void;
    setTitle(title: string): void;
    setContent(content: string): void;
    remove(): void;
    readonly [key: string]: unknown;
}
export interface AnimationConfig extends BaseConfig {
    readonly path: readonly (readonly [number, number])[];
    readonly duration?: number;
    readonly speed?: number;
    readonly markerOptions?: MarkerConfig;
    readonly autoStart?: boolean;
    readonly loop?: boolean;
    readonly onStart?: () => void;
    readonly onPause?: () => void;
    readonly onResume?: () => void;
    readonly onStop?: () => void;
    readonly onComplete?: () => void;
    readonly onProgress?: (progress: number, position: readonly [number, number]) => void;
    readonly onStep?: (currentIndex: number, position: readonly [number, number]) => void;
}
export type AnimationStatus = "idle" | "playing" | "paused" | "stopped" | "completed";
export interface IAnimation {
    readonly id: string;
    start(): void;
    pause(): void;
    resume(): void;
    stop(): void;
    next(): void;
    previous(): void;
    seek(progress: number): void;
    setSpeed(speed: number): void;
    getCurrentPosition(): readonly [number, number];
    getProgress(): number;
    getStatus(): AnimationStatus;
    remove(): void;
    clear(): void;
}
export interface MapSDKConfig extends MapConfig {
}
export interface PolygonConfig extends BaseConfig {
    readonly path: readonly (readonly [number, number])[];
    readonly fillColor?: string;
    readonly fillOpacity?: number;
    readonly strokeColor?: string;
    readonly strokeOpacity?: number;
    readonly strokeWeight?: number;
    readonly editable?: boolean;
    readonly draggable?: boolean;
    readonly clickable?: boolean;
    readonly zIndex?: number;
    readonly onClick?: (params: PolygonEventParams) => void;
    readonly onMouseover?: (params: PolygonEventParams) => void;
    readonly onMouseout?: (params: PolygonEventParams) => void;
    readonly onDragEnd?: (params: PolygonDragEventParams) => void;
    readonly onEditEnd?: (params: PolygonEditEventParams) => void;
    readonly [key: string]: unknown;
}
export interface PolygonEventParams {
    readonly event: Event;
    readonly polygon: IPolygon;
    readonly data: unknown;
}
export interface PolygonDragEventParams extends PolygonEventParams {
    readonly path: readonly (readonly [number, number])[];
}
export interface PolygonEditEventParams extends PolygonEventParams {
    readonly path: readonly (readonly [number, number])[];
}
export interface IPolygon {
    readonly id: string;
    path: [number, number][];
    setPath(path: readonly (readonly [number, number])[]): void;
    setOptions(options: Partial<PolygonConfig>): void;
    setEditable(editable: boolean): void;
    setDraggable(draggable: boolean): void;
    getBounds(): unknown;
    contains(point: readonly [number, number]): boolean;
    getArea(): number;
    show(): void;
    hide(): void;
    remove(): void;
    clear(): void;
    readonly [key: string]: unknown;
}
