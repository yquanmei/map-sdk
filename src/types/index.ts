export enum MapProvider {
  AMAP = 'amap',
  GOOGLE = 'google',
  OPENLAYERS = 'openlayers'
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
  removeMarker(marker: IMarker): void;
  addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster>;
  removeMarkerCluster(cluster: IMarkerCluster): void;
  setCenter(position: [number, number]): void;
  setZoom(zoom: number): void;
  destroy(): void;
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

export interface MapSDKConfig {
  container: string | HTMLElement;
  center?: [number, number];
  zoom?: number;
  apiKey?: string;
  [key: string]: any;
} 