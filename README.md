# Map SDK

一个统一的地图SDK，支持多种地图服务商（高德地图、Google Maps、OpenLayers等），使用策略模式和适配器模式设计，提供统一的API接口。

## 特性

- 🗺️ 支持多种地图服务商（高德、Google Maps、OpenLayers）
- 🎯 统一的API接口，无需关心底层实现
- 🔧 可扩展的架构，易于添加新的地图服务商
- 📦 TypeScript支持，完整的类型定义
- 🚀 轻量级，按需加载

## 安装

```bash
npm install map-sdk
```

## 快速开始

### 基本使用

```typescript
import { MapSDK, MapProvider } from 'map-sdk';

// 创建地图实例（以高德地图为例）
const map = new MapSDK(MapProvider.AMAP);

// 初始化地图
await map.init({
  container: 'map-container',
  center: [116.397428, 39.90923], // [经度, 纬度]
  zoom: 11,
  apiKey: 'your-amap-api-key'
});

// 添加标记点
const marker = await map.addMarker({
  position: [116.397428, 39.90923],
  title: '北京天安门',
  content: '这是天安门广场'
});

// 添加标记点聚合
const cluster = await map.addMarkerCluster([
  { position: [116.397428, 39.90923] },
  { position: [116.407428, 39.91923] },
  { position: [116.417428, 39.92923] }
], {
  gridSize: 60,
  maxZoom: 18,
  renderClusterMarker: '<div style="background-color: #ff6b6b; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold;">{count}</div>'
});

// 设置地图中心点
map.setCenter([116.407428, 39.91923]);

// 设置缩放级别
map.setZoom(15);
```

### 使用Google Maps

```typescript
import { MapSDK, MapProvider } from 'map-sdk';

const map = new MapSDK(MapProvider.GOOGLE);

await map.init({
  container: 'map-container',
  center: [116.397428, 39.90923],
  zoom: 11,
  apiKey: 'your-google-maps-api-key' // SDK会自动加载
});

const marker = await map.addMarker({
  position: [116.397428, 39.90923],
  title: 'Beijing Tiananmen'
});
```

### 使用OpenLayers

```typescript
import { MapSDK, MapProvider } from 'map-sdk';

const map = new MapSDK(MapProvider.OPENLAYERS);

await map.init({
  container: 'openlayers-container',
  center: [116.397428, 39.90923],
  zoom: 11
  // OpenLayers不需要API密钥，SDK会自动加载
});

const marker = await map.addMarker({
  position: [116.397428, 39.90923],
  title: 'Beijing Tiananmen'
});
```

## API 文档

### MapSDK

#### 构造函数

```typescript
new MapSDK(provider: MapProvider)
```

#### 方法

##### `init(config: MapSDKConfig): Promise<void>`

初始化地图。

**参数：**
- `config`: 地图配置对象
  - `container`: 容器元素ID或DOM元素
  - `center`: 中心点坐标 `[经度, 纬度]`
  - `zoom`: 缩放级别
  - `apiKey`: API密钥（可选）

##### `addMarker(config: MarkerConfig): Promise<IMarker>`

添加标记点。

**参数：**
- `config`: 标记点配置
  - `position`: 位置坐标 `[经度, 纬度]`
  - `title`: 标题
  - `content`: 内容
  - `icon`: 图标URL
  - `clickable`: 是否可点击
  - `draggable`: 是否可拖拽

**返回：** 标记点实例

##### `removeMarker(marker: IMarker): void`

移除标记点。

##### `setCenter(position: [number, number]): void`

设置地图中心点。

##### `setZoom(zoom: number): void`

设置地图缩放级别。

##### `getMarkers(): IMarker[]`

获取所有标记点。

##### `clearMarkers(): void`

清除所有标记点。

##### `addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster>`

添加标记点聚合。

**参数：**
- `points`: 坐标点数组
  - `position`: 位置坐标 `[经度, 纬度]`
  - 其他自定义属性
- `options`: 聚合选项（可选）
  - `gridSize`: 聚合距离（像素），默认 60
  - `renderClusterMarker`: 聚合图标HTML字符串，支持 `{count}` 占位符
  - `renderMarker`: 单个标记点配置
  - `maxZoom`: 最大聚合层级，默认 18

**返回：** 标记点聚合实例

##### `removeMarkerCluster(cluster: IMarkerCluster): void`

移除标记点聚合。

##### `destroy(): void`

销毁地图实例。

##### `isMapInitialized(): boolean`

检查地图是否已初始化。

#### 静态方法

##### `getSupportedProviders(): MapProvider[]`

获取支持的地图提供者列表。

##### `isProviderSupported(provider: MapProvider): boolean`

检查地图提供者是否被支持。

##### `registerProvider(provider: MapProvider, providerClass: new () => IMapProvider): void`

注册自定义地图提供者。

### IMarker

标记点接口。

#### 属性

- `id: string`: 标记点ID
- `position: [number, number]`: 位置坐标

#### 方法

- `setPosition(position: [number, number]): void`: 设置位置
- `setTitle(title: string): void`: 设置标题
- `setContent(content: string): void`: 设置内容
- `remove(): void`: 移除标记点

### IMarkerCluster

标记点聚合接口。

#### 属性

- `id: string`: 聚合ID
- `points: MarkerClusterPoint[]`: 坐标点数组

#### 方法

- `addPoint(point: MarkerClusterPoint): void`: 添加坐标点
- `removePoint(point: MarkerClusterPoint): void`: 移除坐标点
- `clear(): void`: 清空所有坐标点
- `remove(): void`: 移除聚合

## 扩展新的地图服务商

### 1. 创建新的提供者类

```typescript
import { BaseMapProvider } from 'map-sdk';
import { IMarker, MapConfig, MarkerConfig } from 'map-sdk';

export class CustomMapProvider extends BaseMapProvider {
  async init(config: MapConfig): Promise<void> {
    // 实现初始化逻辑
  }

  async addMarker(config: MarkerConfig): Promise<IMarker> {
    // 实现添加标记点逻辑
  }

  removeMarker(marker: IMarker): void {
    // 实现移除标记点逻辑
  }

  setCenter(position: [number, number]): void {
    // 实现设置中心点逻辑
  }

  setZoom(zoom: number): void {
    // 实现设置缩放级别逻辑
  }

  destroy(): void {
    // 实现销毁逻辑
  }
}
```

### 2. 注册新的提供者

```typescript
import { MapSDK, MapProvider } from 'map-sdk';
import { CustomMapProvider } from './CustomMapProvider';

// 注册新的提供者
MapSDK.registerProvider(MapProvider.CUSTOM, CustomMapProvider);

// 使用新的提供者
const map = new MapSDK(MapProvider.CUSTOM);
```

## 支持的地图服务商

- **高德地图 (AMap)**: 中国地区推荐使用
- **Google Maps**: 全球范围使用
- **OpenLayers**: 开源地图库，支持多种数据源

## 注意事项

1. **API密钥**: 使用高德地图和Google Maps需要申请相应的API密钥
2. **SDK加载**: 所有地图SDK都会自动动态加载，无需手动引入
3. **坐标系统**: 所有坐标都使用 `[经度, 纬度]` 格式
4. **浏览器兼容性**: 确保目标浏览器支持ES2020特性
5. **网络连接**: 需要网络连接来加载地图SDK

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 测试
npm test

# 代码检查
npm run lint
```

## 许可证

MIT 