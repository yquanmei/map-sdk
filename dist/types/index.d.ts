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
    readonly content?: string;
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
    addPolyline(config: PolylineConfig): Promise<IPolyline>;
    clearPolylines(params?: ClearParams<any>): void;
    addPolygon(config: PolygonConfig): Promise<IPolygon>;
    clearPolygons(params?: ClearParams<IPolygon>): void;
    clearPathPlannings(params?: ClearParams<any>): void;
    clearInfoWindows(params?: ClearParams<any>): void;
    addInfoWindow(options: {
        content: string | HTMLElement;
        position: readonly [number, number];
        open?: boolean;
    }): Promise<any>;
    setCenter(position: readonly [number, number]): void;
    setZoom(zoom: number): void;
    setZoomAndCenter(zoom: number, center: readonly [number, number]): void;
    getZoom(): number;
    setFitView(options?: {
        padding?: number;
        maxZoom?: number;
    }): void;
    destroy(): void;
    clearMap(): Promise<void>;
}
export interface IMarker {
    readonly id: string;
    setPosition(position: readonly [number, number]): void;
    setTitle(title: string): void;
    setContent(content: string): void;
    remove(): void;
    readonly [key: string]: unknown;
}
export interface AnimationPlayConfig extends MarkerConfig {
    duration: number;
    autoStart?: boolean;
    loop?: boolean;
    setCenterRealTime?: ((position: [number, number]) => void) | boolean;
}
export interface AnimationInfo {
    path: [number, number][];
    status: AnimationStatus;
}
export interface AnimationConfig extends BaseConfig {
    line: PolylineConfig;
    passedLine: PolygonConfig;
    marker?: MarkerConfig;
    animation?: AnimationPlayConfig;
    onMoving?: (params: any) => void;
    readonly onStart?: () => void;
    readonly onPause?: () => void;
    readonly onResume?: (params: AnimationInfo) => void;
    readonly onStop?: () => void;
    onStepEnd?: () => void;
    readonly onComplete?: () => void;
    readonly onProgress?: (progress: number, position: readonly [number, number]) => void;
    readonly onStep?: (currentIndex: number, position: readonly [number, number]) => void;
}
export interface IAnimation {
    readonly id: string;
    start(): void;
    pause(): void;
    resume(): void;
    stop(): void;
    getCurrentPosition(): readonly [number, number];
    getProgress(): number;
    remove(): void;
    changeSteps(step: number, callback?: (data: any) => void): void;
    changeSpeed(duration: number): void;
    seek(progress: number): void;
    setSpeed(speed: number): void;
    getInfo(): AnimationInfo;
    remove(): void;
    readonly [key: string]: unknown;
}
export interface MapSDKConfig extends MapConfig {
}
export interface PolylineConfig extends BaseConfig {
    readonly path: readonly (readonly [number, number])[];
    readonly color?: string;
    readonly width?: number;
    readonly opacity?: number;
    readonly [key: string]: unknown;
}
export interface IPolyline {
    readonly id: string;
    setPath(path: readonly (readonly [number, number])[]): void;
    setOptions(options: Partial<PolylineConfig>): void;
    setEditable(editable: boolean): void;
    setDraggable(draggable: boolean): void;
    readonly [key: string]: unknown;
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
    readonly [key: string]: unknown;
}
export declare enum AnimationStatus {
    IDLE = "idle",
    PLAYING = "playing",
    PAUSED = "paused",
    RESUMED = "resumed",
    STOPPED = "stopped",
    COMPLETED = "completed"
}
