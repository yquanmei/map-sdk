// 使用const assertion提供更好的类型安全性
export const MAP_PROVIDERS = {
  AMAP: "amap",
  GOOGLE: "google",
  OPENLAYERS: "openlayers",
} as const;

export type MapProvider = (typeof MAP_PROVIDERS)[keyof typeof MAP_PROVIDERS];

// 向后兼容：提供运行时可访问的MapProvider对象
export const MapProvider = MAP_PROVIDERS;

export const COVERING_TYPES = {
  MARKER: "marker",
  CLUSTER: "cluster",
  POLYLINE: "polyline",
  POLYGON: "polygon",
  PATH_PLANNING: "path_planning",
  INFO_WINDOW: "info_window",
  ANIMATION: "animation",
} as const;

export type CoveringType = (typeof COVERING_TYPES)[keyof typeof COVERING_TYPES];

// 向后兼容：提供运行时可访问的CoveringType对象
export const CoveringType = COVERING_TYPES;

// 基础配置接口
export interface BaseConfig {
  readonly id?: string;
  readonly data?: Record<string, unknown>;
}

export interface MapConfig extends BaseConfig {
  readonly container: string | HTMLElement;
  readonly center?: readonly [number, number]; // [lng, lat] - 使用readonly确保不可变性
  readonly zoom?: number;
  readonly key?: string; // API密钥参数名统一为key
  readonly [key: string]: unknown; // 使用unknown而不是any提高类型安全性
}

export interface MarkerConfig extends BaseConfig {
  readonly position: readonly [number, number]; // [lng, lat]
  // readonly title?: string;
  readonly content?: string;
  // readonly icon?: string;
  readonly clickable?: boolean;
  readonly draggable?: boolean;
  readonly map?: boolean;
  readonly onClick?: (params: MarkerEventParams) => void;
  readonly onMouseover?: (params: MarkerMouseEventParams) => void;
  readonly onMouseout?: (params: MarkerMouseEventParams) => void;
  readonly [key: string]: unknown;
}

// 事件参数接口
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

// 标记点聚合相关类型
export interface MarkerClusterPoint extends BaseConfig {
  readonly position: readonly [number, number]; // [lng, lat]
  readonly [key: string]: unknown;
}

export interface MarkerClusterOptions {
  readonly gridSize?: number; // 距离多少像素进行聚合，默认 60
  readonly renderClusterMarker?: string; // 聚合后的图标，HTML字符串
  readonly renderMarker?: MarkerConfig; // 聚合前的图标配置
  readonly maxZoom?: number; // 层级为多少时才进行聚合，默认 18
  readonly [key: string]: unknown;
}

export interface IMarkerCluster {
  readonly id: string;
  points: MarkerClusterPoint[]; // 允许provider实现修改
  addPoint(point: MarkerClusterPoint): void;
  removePoint(point: MarkerClusterPoint): void;
  // clear(): void;
  remove(): void;
  readonly [key: string]: unknown;
}

// 清除操作的参数接口
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
  position: [number, number]; // 允许provider实现修改
  setPosition(position: readonly [number, number]): void;
  setTitle(title: string): void;
  setContent(content: string): void;
  remove(): void;
  readonly [key: string]: unknown;
}

// 轨迹动画相关类型
export interface AnimationConfig extends BaseConfig {
  readonly path: readonly (readonly [number, number])[]; // 轨迹路径 [lng, lat][]
  readonly duration?: number; // 动画总时长(毫秒)，默认5000ms
  readonly speed?: number; // 播放倍速，默认1倍
  readonly markerOptions?: MarkerConfig; // 移动标记的配置
  readonly autoStart?: boolean; // 是否自动开始，默认false
  readonly loop?: boolean; // 是否循环播放，默认false
  readonly onStart?: () => void; // 开始回调
  readonly onPause?: () => void; // 暂停回调
  readonly onResume?: () => void; // 继续回调
  readonly onStop?: () => void; // 停止回调
  readonly onComplete?: () => void; // 完成回调
  readonly onProgress?: (progress: number, position: readonly [number, number]) => void; // 进度回调
  readonly onStep?: (currentIndex: number, position: readonly [number, number]) => void; // 步骤回调
}

export type AnimationStatus = "idle" | "playing" | "paused" | "stopped" | "completed";

export interface IAnimation {
  readonly id: string;
  start(): void; // 开始动画
  pause(): void; // 暂停动画
  resume(): void; // 继续动画
  stop(): void; // 停止动画
  next(): void; // 下一步
  previous(): void; // 上一步
  seek(progress: number): void; // 跳转到指定进度(0-1)
  setSpeed(speed: number): void; // 设置倍速
  getCurrentPosition(): readonly [number, number]; // 获取当前位置
  getProgress(): number; // 获取当前进度(0-1)
  getStatus(): AnimationStatus; // 获取状态
  remove(): void; // 移除动画
  // clear(): void; // 清除动画
}

export interface MapSDKConfig extends MapConfig {}

// 多边形相关类型
export interface PolygonConfig extends BaseConfig {
  readonly path: readonly (readonly [number, number])[]; // 多边形路径坐标点数组 [lng, lat][]
  readonly fillColor?: string; // 填充颜色，默认 '#00B2D5'
  readonly fillOpacity?: number; // 填充透明度，默认 0.5
  readonly strokeColor?: string; // 边框颜色，默认 '#00D3FC'
  readonly strokeOpacity?: number; // 边框透明度，默认 0.9
  readonly strokeWeight?: number; // 边框宽度，默认 2
  readonly editable?: boolean; // 是否可编辑，默认 false
  readonly draggable?: boolean; // 是否可拖拽，默认 false
  readonly clickable?: boolean; // 是否可点击，默认 true
  readonly zIndex?: number; // 层级，默认 1
  readonly onClick?: (params: PolygonEventParams) => void; // 点击事件回调
  readonly onMouseover?: (params: PolygonEventParams) => void; // 鼠标悬停事件回调
  readonly onMouseout?: (params: PolygonEventParams) => void; // 鼠标离开事件回调
  readonly onDragEnd?: (params: PolygonDragEventParams) => void; // 拖拽结束事件回调
  readonly onEditEnd?: (params: PolygonEditEventParams) => void; // 编辑结束事件回调
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
  path: [number, number][]; // 允许provider实现修改
  setPath(path: readonly (readonly [number, number])[]): void; // 设置多边形路径
  setOptions(options: Partial<PolygonConfig>): void; // 设置多边形选项
  setEditable(editable: boolean): void; // 设置是否可编辑
  setDraggable(draggable: boolean): void; // 设置是否可拖拽
  getBounds(): unknown; // 获取多边形的边界
  contains(point: readonly [number, number]): boolean; // 判断点是否在多边形内
  getArea(): number; // 获取多边形面积（平方米）
  show(): void; // 显示多边形
  hide(): void; // 隐藏多边形
  remove(): void; // 移除多边形
  // clear(): void; // 清除多边形
  readonly [key: string]: unknown;
}
