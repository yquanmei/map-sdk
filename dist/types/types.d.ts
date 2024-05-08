export interface MapOptions {
    container?: string;
    zoom?: number;
    mapStyle?: string;
    onSuccess?: () => void;
    center?: [number, number];
    viewMode?: string;
    resizeEnable?: boolean;
    rotateEnable?: boolean;
    pitchEnable?: boolean;
    pitch?: number;
    rotation?: number;
    shouldReset?: boolean;
}
export declare enum AnimationStatus {
    INIT = "INIT",
    PLAYING = "PLAYING",
    PAUSE = "PAUSE",
    RESUME = "RESUME",
    END = "END"
}
export interface IconOptions {
    position: [number, number];
    image: {
        src: string;
        size?: [number, number];
        offset?: [number, number];
    };
    label: {
        content: HTMLElement;
    };
    onClick: () => void;
}
export interface InfoWindowOptions {
    content: string;
    position: [number, number];
    open?: boolean;
}
export interface InfoWindowMarker {
    [key: string]: any;
    openWindow: () => void;
    closeInfoWindow: () => void;
}
export interface PolyLineOptions {
    path: [number, number][];
    color: string;
    opacity?: number;
    width: number;
}
export interface LineMarker {
    [key: string]: any;
}
export interface AnimationOptions {
    line: PolyLineOptions;
    passedLine: PolyLineOptions;
    marker: IconOptions;
    animation: {
        duration: number;
    };
    onStart: () => void;
    onMoving: (e: any) => void;
    onResume: (e: any) => void;
    onMoveEnd: () => void;
    onMoveAlong: () => void;
}
export interface MapInfo {
    path: [number, number][];
    animationStatus: string;
}
export interface Marker {
    [key: string]: any;
    start: (time: number) => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    changeSteps: (step: number, changeStepsCall: any) => void;
    changeSpeed: (duration: number) => void;
    getInfo: () => MapInfo;
    setLabelContent: () => void;
}
export interface MapImplements {
    createMap?(options: MapOptions): void;
    setFitView(): void;
    setCenter(center: [number, number], immediately?: boolean, duration?: number): void;
    setZoomAndCenter(zoom: number, center: [number, number], immediately: boolean, duration?: number): void;
    clearMap(): void;
    addIcon(iconOptions: IconOptions): Marker;
    addInfoWindow(options: InfoWindowOptions, isLabel?: boolean): InfoWindowMarker;
    clearInfoWindow(): void;
    addLines(options: PolyLineOptions): LineMarker;
    addAnimation(options: AnimationOptions): Marker;
    getBounds(): any;
    getCenter(): any;
}
export interface GeoOptions {
    city: string;
    radius?: number;
}
export interface ListResultItem {
    address: string;
    lng: number | undefined;
    lat: number | undefined;
}
