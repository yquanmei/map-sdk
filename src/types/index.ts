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
  readonly onClick?: (params: { event: Event; position: readonly [number, number] }) => void; // 地图点击事件
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
  // readonly marker: unknown;
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
  addPolyline(config: PolylineConfig): Promise<IPolyline>;
  clearPolylines(params?: ClearParams<any>): void;
  addPolygon(config: PolygonConfig): Promise<IPolygon>;
  clearPolygons(params?: ClearParams<IPolygon>): void;
  clearPathPlannings(params?: ClearParams<any>): void;
  clearInfoWindows(params?: ClearParams<any>): void;
  addInfoWindow(options: { content: string | HTMLElement; position: readonly [number, number]; open?: boolean }): Promise<any>;
  getAddressList(value: string, config: any): Promise<any>;
  setCenter(position: readonly [number, number]): void;
  setZoom(zoom: number): void;
  setZoomAndCenter(zoom: number, center: readonly [number, number]): void;
  getZoom(): number;
  setFitView(options?: { padding?: number; maxZoom?: number }): void;
  destroy(): void;
  clearMap(): Promise<void>;
}

export interface IMarker {
  readonly id: string;
  // position: [number, number]; // 允许provider实现修改
  setPosition(position: readonly [number, number]): void;
  setTitle(title: string): void;
  setContent(content: string): void;
  remove(): void;
  readonly [key: string]: unknown;
}

export interface AnimationPlayConfig extends MarkerConfig {
  duration: number;
  autoStart?: boolean; // 是否自动开始，默认false
  loop?: boolean; // 是否循环播放，默认false
  setCenterRealTime?: ((position: [number, number]) => void) | boolean; // 是否实时设置地图中心，默认true
  startTimer?: number; // 动画延时开始时间，默认700ms
  startZoom?: number; // 动画开始时的缩放级别，默认18
}

export interface AnimationInfo {
  path: [number, number][];
  status: AnimationStatus;
}

// 轨迹动画相关类型
export interface AnimationConfig extends BaseConfig {
  line: PolylineConfig;
  passedLine: PolygonConfig;
  marker?: MarkerConfig;
  animation?: AnimationPlayConfig;
  onMoving?: (params: any) => void;
  readonly onStart?: () => void; // 开始回调
  readonly onPause?: () => void; // 暂停回调
  readonly onResume?: (params: AnimationInfo) => void; // 继续回调
  readonly onStop?: () => void; // 停止回调
  onStepEnd?: () => void; // 每走完一个point，onStepEnd
  readonly onComplete?: () => void; // 完成回调
  readonly onProgress?: (progress: number, position: readonly [number, number]) => void; // 进度回调
  readonly onStep?: (currentIndex: number, position: readonly [number, number]) => void; // 步骤回调
}

export interface IAnimation {
  readonly id: string;
  start(): void; // 开始动画
  pause(): void; // 暂停动画
  resume(): void; // 继续动画
  stop(): void; // 停止动画
  getCurrentPosition(): readonly [number, number]; // 获取当前位置
  getProgress(): number; // 获取当前进度(0-1)
  remove(): void; // 移除动画
  changeSteps(step: number, callback?: (data: any) => void): void; // 改变步数
  setDuration(duration: number): void; // 设置相邻2步之间的时长
  seek(progress: number): void; // 跳转到指定进度(0-1)
  changeProgress(index: number): void; // 跳转到指定某个index
  getInfo(): AnimationInfo; // 获取动画信息
  remove(): void; // 清除动画
  readonly [key: string]: unknown;
}

export interface MapSDKConfig extends MapConfig {}

export interface PolylineConfig extends BaseConfig {
  readonly path: readonly (readonly [number, number])[]; // 轨迹路径 [lng, lat][]
  readonly color?: string; // 颜色
  readonly width?: number; // 宽度
  readonly opacity?: number; // 透明度
  readonly [key: string]: unknown;
}

export interface IPolyline {
  readonly id: string;
  // path: [number, number][]; // 允许provider实现修改
  setPath(path: readonly (readonly [number, number])[]): void; // 设置多边形路径
  setOptions(options: Partial<PolylineConfig>): void;
  setEditable(editable: boolean): void; // 设置是否可编辑
  setDraggable(draggable: boolean): void; // 设置是否可拖拽
  readonly [key: string]: unknown;
}

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
  // path: [number, number][]; // 允许provider实现修改
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

export enum AnimationStatus {
  IDLE = "idle",
  PLAYING = "playing",
  PAUSED = "paused",
  RESUMED = "resumed",
  STOPPED = "stopped",
  COMPLETED = "completed",
}
