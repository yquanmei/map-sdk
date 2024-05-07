export interface MapOptions {
  container: string;
  key: string;
  token: string;
  plugins?: string[]; // 地图插件
  zoom?: number; // 地图级别
  mapStyle?: string;
  onSuccess?: () => void;
  center?: [number, number];
  // viewMode?: "2D" | "3D";
  viewMode?: string;
  resizeEnable?: boolean;
  rotateEnable?: boolean;
  pitchEnable?: boolean;
  pitch?: number;
  rotation?: number;
}
export enum AnimationStatus {
  INIT = "INIT",
  PLAYING = "PLAYING",
  PAUSE = "PAUSE",
  RESUME = "RESUME",
  END = "END",
}
export interface IconOptions {
  position: [number, number]; // 容器位置，经纬度
  image: {
    src: string; // 图片url地址
    size?: [number, number]; // 图片尺寸
    offset?: [number, number]; // 图片偏移量
  };
  label: {
    content: HTMLElement;
  };
  onClick: () => void;
}
export interface InfoWindowOptions {
  content: string;
  position: [number, number]; // 经度、维度
  open?: boolean; // 创建信息窗体时是否自动打开
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
    duration: number; // 相邻的2个坐标点之间花费的时间；单位ms
  };
  onStart: () => void;
  onMoving: (e) => void;
  onResume: (e) => void;
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
  changeSteps: (step: number, changeStepsCall) => void;
  changeSpeed: (duration: number) => void;
  getInfo: () => MapInfo;
  setLabelContent: () => void;
}
export interface MapImplements {
  setFitView(): void;
  setCenter(center: [number, number], immediately?: boolean, duration?: number): void;
  setZoomAndCenter(zoom: number, center: [number, number], immediately: boolean, duration?: number): void;
  clearMap(): void;
  // addIcon(iconOptions: IconOptions): any
  addIcon(iconOptions: IconOptions): Marker;
  addInfoWindow(options: InfoWindowOptions, isLabel?: boolean): InfoWindowMarker;
  clearInfoWindow(): void;
  addLines(options: PolyLineOptions): LineMarker;
  addAnimation(options: AnimationOptions): Marker;
  getBounds():any;
  getCenter():any;
  destroy(): void;
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
