export enum MapProvider {
  AMAP = "amap",
  GOOGLE = "google",
  OPENLAYERS = "openlayers",
}

export enum CoveringType {
  MARKER = "marker",
  CLUSTER = "cluster",
  POLYLINE = "polyline",
  POLYGON = "polygon",
  PATH_PLANNING = "path_planning",
  INFO_WINDOW = "info_window",
  ANIMATION = "animation",
}

export interface MapConfig {
  container: string | HTMLElement;
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  apiKey?: string;
  [key: string]: any; // 允许其他配置参数
}

export interface MarkerConfig {
  position: [number, number]; // [lng, lat]
  title?: string;
  content?: string;
  icon?: string;
  clickable?: boolean;
  draggable?: boolean;
  map?: boolean;
  id?: string;
  data?: any;
  onClick?: (params: { event: any; content: HTMLElement; data: any; position: [number, number]; marker: any }) => void;
  onMouseover?: (params: { event: any; content: HTMLElement; data: any }) => void;
  onMouseout?: (params: { event: any; content: HTMLElement; data: any }) => void;
  [key: string]: any; // 允许其他marker配置参数
}

// 新增：标记点聚合相关类型
export interface MarkerClusterPoint {
  position: [number, number]; // [lng, lat]
  [key: string]: any; // 允许其他属性
}

export interface MarkerClusterOptions {
  gridSize?: number; // 距离多少像素进行聚合，默认 60
  renderClusterMarker?: string; // 聚合后的图标，HTML字符串
  renderMarker?: MarkerConfig; // 聚合前的图标配置
  maxZoom?: number; // 层级为多少时才进行聚合，默认 18
  [key: string]: any; // 允许其他配置参数
}

export interface IMarkerCluster {
  id: string;
  points: MarkerClusterPoint[];
  addPoint(point: MarkerClusterPoint): void;
  removePoint(point: MarkerClusterPoint): void;
  clear(): void;
  remove(): void;
  [key: string]: any; // 允许其他方法
}

export interface IMapProvider {
  init(config: MapConfig): Promise<void>;
  addMarker(config: MarkerConfig): Promise<IMarker>;
  clearMarkers(params?: { type?: string; markers?: Array<IMarker> }): void;
  addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster>;
  clearMarkerClusters(params?: { type?: string; clusters?: Array<IMarkerCluster> }): void;
  addAnimation(config: AnimationConfig): Promise<IAnimation>;
  clearAnimations(params?: { type?: string; animations?: Array<IAnimation> }): void;
  clearPolylines(params?: { type?: string; polylines?: any[] }): void;
  addPolygon(config: PolygonConfig): Promise<IPolygon>;
  clearPolygons(params?: { type?: string; polygons?: Array<IPolygon> }): void;
  clearPathPlannings(params?: { type?: string; pathPlannings?: any[] }): void;
  clearInfoWindow(params?: { type?: string; infoWindows?: any[] }): void;
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
  [key: string]: any; // 允许其他marker方法
}

// 轨迹动画相关类型
export interface AnimationConfig {
  path: [number, number][]; // 轨迹路径 [lng, lat][]
  duration?: number; // 动画总时长(毫秒)，默认5000ms
  speed?: number; // 播放倍速，默认1倍
  markerOptions?: MarkerConfig; // 移动标记的配置
  autoStart?: boolean; // 是否自动开始，默认false
  loop?: boolean; // 是否循环播放，默认false
  onStart?: () => void; // 开始回调
  onPause?: () => void; // 暂停回调
  onResume?: () => void; // 继续回调
  onStop?: () => void; // 停止回调
  onComplete?: () => void; // 完成回调
  onProgress?: (progress: number, position: [number, number]) => void; // 进度回调
  onStep?: (currentIndex: number, position: [number, number]) => void; // 步骤回调
}

export interface IAnimation {
  id: string;
  start(): void; // 开始动画
  pause(): void; // 暂停动画
  resume(): void; // 继续动画
  stop(): void; // 停止动画
  next(): void; // 下一步
  previous(): void; // 上一步
  seek(progress: number): void; // 跳转到指定进度(0-1)
  setSpeed(speed: number): void; // 设置倍速
  getCurrentPosition(): [number, number]; // 获取当前位置
  getProgress(): number; // 获取当前进度(0-1)
  getStatus(): "idle" | "playing" | "paused" | "stopped" | "completed"; // 获取状态
  remove(): void; // 移除动画
  clear(): void; // 清除动画
}

export interface MapSDKConfig {
  container: string | HTMLElement;
  center?: [number, number];
  zoom?: number;
  apiKey?: string;
  [key: string]: any;
}

// 多边形相关类型
export interface PolygonConfig {
  path: [number, number][]; // 多边形路径坐标点数组 [lng, lat][]
  fillColor?: string; // 填充颜色，默认 '#FF0000'
  fillOpacity?: number; // 填充透明度，默认 0.3
  strokeColor?: string; // 边框颜色，默认 '#FF0000'
  strokeOpacity?: number; // 边框透明度，默认 1.0
  strokeWeight?: number; // 边框宽度，默认 2
  editable?: boolean; // 是否可编辑，默认 false
  draggable?: boolean; // 是否可拖拽，默认 false
  clickable?: boolean; // 是否可点击，默认 true
  zIndex?: number; // 层级，默认 1
  data?: any; // 附加数据
  onClick?: (params: { event: any; polygon: IPolygon; data: any }) => void; // 点击事件回调
  onMouseover?: (params: { event: any; polygon: IPolygon; data: any }) => void; // 鼠标悬停事件回调
  onMouseout?: (params: { event: any; polygon: IPolygon; data: any }) => void; // 鼠标离开事件回调
  onDragEnd?: (params: { event: any; polygon: IPolygon; path: [number, number][] }) => void; // 拖拽结束事件回调
  onEditEnd?: (params: { event: any; polygon: IPolygon; path: [number, number][] }) => void; // 编辑结束事件回调
  [key: string]: any; // 允许其他配置参数
}

export interface IPolygon {
  id: string;
  path: [number, number][]; // 当前路径坐标点数组
  setPath(path: [number, number][]): void; // 设置多边形路径
  setOptions(options: Partial<PolygonConfig>): void; // 设置多边形选项
  setEditable(editable: boolean): void; // 设置是否可编辑
  setDraggable(draggable: boolean): void; // 设置是否可拖拽
  getBounds(): any; // 获取多边形的边界
  contains(point: [number, number]): boolean; // 判断点是否在多边形内
  getArea(): number; // 获取多边形面积（平方米）
  show(): void; // 显示多边形
  hide(): void; // 隐藏多边形
  remove(): void; // 移除多边形
  clear(): void; // 清除多边形
  [key: string]: any; // 允许其他方法
}
