export declare enum MapProvider {
    AMAP = "amap",
    GOOGLE = "google",
    OPENLAYERS = "openlayers"
}
export declare enum CoveringType {
    MARKER = "marker",
    CLUSTER = "cluster",
    POLYLINE = "polyline",
    POLYGON = "polygon",
    PATH_PLANNING = "path_planning",
    INFO_WINDOW = "info_window"
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
    map?: boolean;
    id?: string;
    data?: any;
    onClick?: (params: {
        event: any;
        content: HTMLElement;
        data: any;
        position: [number, number];
        marker: any;
    }) => void;
    onMouseover?: (params: {
        event: any;
        content: HTMLElement;
        data: any;
    }) => void;
    onMouseout?: (params: {
        event: any;
        content: HTMLElement;
        data: any;
    }) => void;
    [key: string]: any;
}
export interface MarkerClusterPoint {
    position: [number, number];
    [key: string]: any;
}
export interface MarkerClusterOptions {
    gridSize?: number;
    renderClusterMarker?: string;
    renderMarker?: MarkerConfig;
    maxZoom?: number;
    [key: string]: any;
}
export interface IMarkerCluster {
    id: string;
    points: MarkerClusterPoint[];
    addPoint(point: MarkerClusterPoint): void;
    removePoint(point: MarkerClusterPoint): void;
    clear(): void;
    remove(): void;
    [key: string]: any;
}
export interface IMapProvider {
    init(config: MapConfig): Promise<void>;
    addMarker(config: MarkerConfig): Promise<IMarker>;
    clearMarkers(params?: {
        type?: string;
        markers?: Array<IMarker>;
    }): void;
    addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster>;
    clearMarkerClusters(params?: {
        type?: string;
        clusters?: Array<IMarkerCluster>;
    }): void;
    addAnimation(config: AnimationConfig): Promise<IAnimation>;
    clearAnimations(params?: {
        type?: string;
        animations?: Array<IAnimation>;
    }): void;
    clearPolylines(params?: {
        type?: string;
        polylines?: any[];
    }): void;
    addPolygon(config: PolygonConfig): Promise<IPolygon>;
    clearPolygons(params?: {
        type?: string;
        polygons?: Array<IPolygon>;
    }): void;
    clearPathPlannings(params?: {
        type?: string;
        pathPlannings?: any[];
    }): void;
    clearInfoWindow(params?: {
        type?: string;
        infoWindows?: any[];
    }): void;
    setCenter(position: [number, number]): void;
    setZoom(zoom: number): void;
    getZoom(): void;
    destroy(): void;
    clearMap(): Promise<void>;
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
export interface AnimationConfig {
    path: [number, number][];
    duration?: number;
    speed?: number;
    markerOptions?: MarkerConfig;
    autoStart?: boolean;
    loop?: boolean;
    onStart?: () => void;
    onPause?: () => void;
    onResume?: () => void;
    onStop?: () => void;
    onComplete?: () => void;
    onProgress?: (progress: number, position: [number, number]) => void;
    onStep?: (currentIndex: number, position: [number, number]) => void;
}
export interface IAnimation {
    id: string;
    start(): void;
    pause(): void;
    resume(): void;
    stop(): void;
    next(): void;
    previous(): void;
    seek(progress: number): void;
    setSpeed(speed: number): void;
    getCurrentPosition(): [number, number];
    getProgress(): number;
    getStatus(): "idle" | "playing" | "paused" | "stopped" | "completed";
    remove(): void;
    clear(): void;
}
export interface MapSDKConfig {
    container: string | HTMLElement;
    center?: [number, number];
    zoom?: number;
    apiKey?: string;
    [key: string]: any;
}
export interface PolygonConfig {
    path: [number, number][];
    fillColor?: string;
    fillOpacity?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    editable?: boolean;
    draggable?: boolean;
    clickable?: boolean;
    zIndex?: number;
    data?: any;
    onClick?: (params: {
        event: any;
        polygon: IPolygon;
        data: any;
    }) => void;
    onMouseover?: (params: {
        event: any;
        polygon: IPolygon;
        data: any;
    }) => void;
    onMouseout?: (params: {
        event: any;
        polygon: IPolygon;
        data: any;
    }) => void;
    onDragEnd?: (params: {
        event: any;
        polygon: IPolygon;
        path: [number, number][];
    }) => void;
    onEditEnd?: (params: {
        event: any;
        polygon: IPolygon;
        path: [number, number][];
    }) => void;
    [key: string]: any;
}
export interface IPolygon {
    id: string;
    path: [number, number][];
    setPath(path: [number, number][]): void;
    setOptions(options: Partial<PolygonConfig>): void;
    setEditable(editable: boolean): void;
    setDraggable(draggable: boolean): void;
    getBounds(): any;
    contains(point: [number, number]): boolean;
    getArea(): number;
    show(): void;
    hide(): void;
    remove(): void;
    clear(): void;
    [key: string]: any;
}
