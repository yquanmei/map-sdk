// 主类
export { MapSDK, MapSDKError, ERROR_CODES } from "./MapSDK";

// 类型定义
export {
  MAP_PROVIDERS,
  COVERING_TYPES,
  MapProvider,
  MapConfig,
  MarkerConfig,
  IMarker,
  IMapProvider,
  MapSDKConfig,
  MarkerClusterPoint,
  MarkerClusterOptions,
  IMarkerCluster,
  AnimationConfig,
  IAnimation,
  PolygonConfig,
  IPolygon,
  CoveringType,
  ClearParams,
  BaseConfig,
  MarkerEventParams,
  MarkerMouseEventParams,
  PolygonEventParams,
  PolygonDragEventParams,
  PolygonEditEventParams,
  AnimationStatus,
} from "./types";

// 提供者类
export { AMapProvider } from "./providers/AMapProvider";
export { GoogleMapProvider } from "./providers/GoogleMapProvider";
export { OpenLayersProvider } from "./providers/OpenLayersProvider";
export { BaseMapProvider } from "./providers/BaseMapProvider";
export { MapProviderFactory, MapProviderError } from "./providers/MapProviderFactory";

// 工具函数
// export { createDomContent, } from "./utils";

// 默认导出
import { MapSDK } from "./MapSDK";
export default MapSDK;
