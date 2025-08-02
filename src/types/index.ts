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

export interface IMapProvider {
  init(config: MapConfig): Promise<void>;
  addMarker(config: MarkerConfig): Promise<IMarker>;
  removeMarker(marker: IMarker): void;
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