# Map SDK 设计原则与编码规范

## 📋 目录

1. [设计原则](#设计原则)
2. [架构模式](#架构模式)
3. [编码规范](#编码规范)
4. [项目结构规范](#项目结构规范)
5. [构建与部署规范](#构建与部署规范)
6. [测试规范](#测试规范)
7. [文档规范](#文档规范)

## 🎯 设计原则

### 1. SOLID 原则

#### Single Responsibility Principle (单一职责原则)

- **原则**: 每个类或模块只负责一个功能
- **实践**:
  - `MapSDK` 只负责统一的 API 外观
  - `MapProviderFactory` 只负责创建和管理地图提供者
  - 每个 `Provider` 只负责对应地图服务商的实现
  - `BaseMapProvider` 提供通用的基础功能

#### Open/Closed Principle (开放封闭原则)

- **原则**: 对扩展开放，对修改封闭
- **实践**:
  - 通过 `IMapProvider` 接口定义标准，允许新增地图提供者
  - 工厂模式支持动态注册新的提供者
  - 基类 `BaseMapProvider` 可被继承扩展

#### Liskov Substitution Principle (里氏替换原则)

- **原则**: 子类必须能够替换其基类
- **实践**:
  - 所有 `Provider` 都实现 `IMapProvider` 接口
  - 任何 `Provider` 都可以通过工厂模式互相替换
  - 统一的方法签名和行为规范

#### Interface Segregation Principle (接口隔离原则)

- **原则**: 不应该强迫客户依赖于它们不用的接口
- **实践**:
  - 分离不同功能的接口 (`IMarker`, `IMarkerCluster`, `IPolygon`, `IAnimation`)
  - 可选参数使用 TypeScript 的可选属性

#### Dependency Inversion Principle (依赖倒置原则)

- **原则**: 高层模块不应该依赖低层模块，两者都应该依赖抽象
- **实践**:
  - `MapSDK` 依赖 `IMapProvider` 接口而非具体实现
  - 通过工厂模式注入具体的地图提供者

### 2. 其他设计原则

#### DRY (Don't Repeat Yourself)

- 公共功能抽象到 `BaseMapProvider`
- 工具函数统一放在 `utils` 目录
- 共享的类型定义在 `types` 目录

#### KISS (Keep It Simple, Stupid)

- API 设计简洁直观
- 统一的方法命名规范
- 清晰的参数结构

#### YAGNI (You Aren't Gonna Need It)

- 只实现当前需要的功能
- 避免过度设计
- 渐进式功能增加

## 🏗️ 架构模式

### 1. 策略模式 (Strategy Pattern)

```typescript
// 定义策略接口
interface IMapProvider {
  init(config: MapConfig): Promise<void>;
  addMarker(config: MarkerConfig): Promise<IMarker>;
  // ... 其他方法
}

// 具体策略实现
class GoogleMapProvider implements IMapProvider {
  /* ... */
}
class AMapProvider implements IMapProvider {
  /* ... */
}
class OpenLayersProvider implements IMapProvider {
  /* ... */
}
```

**优势**:

- 算法族之间可以互相替换
- 增加新的地图提供者无需修改现有代码
- 运行时可以切换不同的实现

### 2. 工厂模式 (Factory Pattern)

```typescript
export class MapProviderFactory {
  private static providers = new Map<MapProvider, new () => IMapProvider>();

  static registerProvider(provider: MapProvider, providerClass: new () => IMapProvider): void {
    this.providers.set(provider, providerClass);
  }

  static createProvider(provider: MapProvider): IMapProvider {
    const ProviderClass = this.providers.get(provider);
    if (!ProviderClass) {
      throw new Error(`Unsupported map provider: ${provider}`);
    }
    return new ProviderClass();
  }
}
```

**优势**:

- 集中管理对象创建逻辑
- 支持动态注册新的提供者
- 降低客户端与具体类的耦合

### 3. 外观模式 (Facade Pattern)

```typescript
export class MapSDK {
  private provider: IMapProvider;

  constructor(provider: MapProvider) {
    this.provider = MapProviderFactory.createProvider(provider);
  }

  async init(config: MapSDKConfig): Promise<void> {
    // 简化的接口，隐藏复杂性
    return this.provider.init(config);
  }
}
```

**优势**:

- 为复杂子系统提供简单接口
- 减少客户端与子系统的依赖关系
- 更易于使用和理解

### 4. 适配器模式 (Adapter Pattern)

```typescript
export class GoogleMapProvider extends BaseMapProvider {
  async addMarker(config: MarkerConfig): Promise<IMarker> {
    // 将统一的 MarkerConfig 适配为 Google Maps 的 API
    const googleMarker = new google.maps.Marker({
      position: { lat: config.position[1], lng: config.position[0] },
      title: config.title,
      // ... 其他适配逻辑
    });

    return {
      id: this.generateMarkerId(),
      position: config.position,
      // ... 适配回统一接口
    };
  }
}
```

**优势**:

- 将不兼容的接口转换为可兼容的接口
- 允许不同的地图 API 协同工作
- 保持接口的一致性

## 📝 编码规范

### 1. TypeScript 规范

#### 类型定义

```typescript
// ✅ 好的实践
interface MarkerConfig {
  position: [number, number]; // 明确的坐标格式
  title?: string; // 可选属性用 ?
  content?: string;
  icon?: string;
}

// ❌ 避免的实践
interface BadMarkerConfig {
  position: any; // 避免使用 any
  title: string | undefined; // 使用 ? 而不是 | undefined
}
```

#### 函数签名

```typescript
// ✅ 好的实践
async addMarker(config: MarkerConfig): Promise<IMarker> {
  // 异步函数明确返回 Promise
  // 参数类型明确
}

// 使用泛型时要有约束
function createCollection<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map(item => [item.id, item]));
}
```

#### 错误处理

```typescript
// ✅ 好的实践
async init(config: MapConfig): Promise<void> {
  if (!config.container) {
    throw new Error('Container element is required');
  }

  try {
    await this.loadSDK();
  } catch (error) {
    throw new Error(`Failed to load map SDK: ${error}`);
  }
}
```

### 2. 命名规范

#### 类和接口

```typescript
// 类使用 PascalCase
class MapSDK {}
class GoogleMapProvider {}

// 接口使用 I 前缀 + PascalCase
interface IMapProvider {}
interface IMarker {}

// 类型使用 PascalCase
type MapProvider = "google" | "amap" | "openlayers";
```

#### 变量和函数

```typescript
// 变量使用 camelCase
const mapInstance = new Map();
const markerCollection = new Map();

// 函数使用 camelCase
function generateMarkerId(): string {}
async function loadGoogleMapsSDK(): Promise<void> {}

// 常量使用 SCREAMING_SNAKE_CASE
const DEFAULT_ZOOM_LEVEL = 11;
const MAX_CLUSTER_SIZE = 100;
```

#### 文件和目录

```
// 文件使用 PascalCase (类文件) 或 camelCase
MapSDK.ts
GoogleMapProvider.ts
index.ts
utils.ts

// 目录使用 kebab-case 或 camelCase
providers/
types/
map-sdk/
```

### 3. 代码组织

#### 导入顺序

```typescript
// 1. 第三方库
import { Loader } from "@googlemaps/js-api-loader";
import { merge } from "lodash-es";

// 2. 内部模块 (按层级顺序)
import { BaseMapProvider } from "./BaseMapProvider";
import { createDomContent } from "../utils";
import { IMarker, MapConfig } from "../types";

// 3. 样式文件
import "../css/google.css";
```

#### 类成员顺序

```typescript
export class GoogleMapProvider extends BaseMapProvider {
  // 1. 静态属性
  private static defaultOptions = {};

  // 2. 实例属性
  private google: any;
  private apiKey?: string;

  // 3. 构造函数
  constructor() {}

  // 4. 静态方法
  static isSupported(): boolean {}

  // 5. 公共方法 (按逻辑分组)
  async init(config: MapConfig): Promise<void> {}
  async addMarker(config: MarkerConfig): Promise<IMarker> {}

  // 6. 受保护方法
  protected generateId(): string {}

  // 7. 私有方法
  private async loadSDK(): Promise<void> {}
}
```

### 4. 注释规范

#### JSDoc 注释

```typescript
/**
 * 动态加载Google Maps SDK
 * @param key Google Maps API密钥
 * @returns Promise that resolves when SDK is loaded
 * @throws {Error} 当SDK加载失败时抛出错误
 */
private async loadGoogleMapsSDK(key?: string): Promise<void> {
  // 实现代码...
}

/**
 * 添加标记点到地图
 * @param config 标记点配置
 * @param config.position 标记点位置 [经度, 纬度]
 * @param config.title 标记点标题
 * @returns 返回创建的标记点实例
 */
async addMarker(config: MarkerConfig): Promise<IMarker> {
  // 实现代码...
}
```

#### 行内注释

```typescript
// ✅ 好的实践 - 解释为什么这样做
// 使用 Promise.resolve() 确保返回值为 Promise，兼容异步调用
if (window.google && window.google.maps) {
  return Promise.resolve();
}

// 创建标记点时需要转换坐标格式：[lng, lat] -> {lat, lng}
const googlePosition = {
  lat: config.position[1], // 纬度
  lng: config.position[0], // 经度
};
```

## 📁 项目结构规范

### 目录结构

```
map-sdk/
├── src/                          # 源代码目录
│   ├── types/                    # 类型定义
│   │   └── index.ts             # 导出所有类型
│   ├── providers/               # 地图提供者实现
│   │   ├── BaseMapProvider.ts   # 抽象基类
│   │   ├── MapProviderFactory.ts # 工厂类
│   │   ├── AMapProvider.ts      # 高德地图实现
│   │   ├── GoogleMapProvider.ts # Google Maps实现
│   │   └── OpenLayersProvider.ts # OpenLayers实现
│   ├── utils/                   # 工具函数
│   │   └── index.ts            # 工具函数集合
│   ├── css/                     # 样式文件
│   │   └── google.css          # Google Maps样式
│   ├── MapSDK.ts               # 主要SDK类
│   └── index.ts                # 入口文件
├── examples/                    # 使用示例
├── tests/                      # 测试文件
├── dist/                       # 构建输出
├── docs/                       # 文档
├── rollup.config.js           # 构建配置
├── tsconfig.json              # TypeScript配置
├── package.json               # 包配置
└── README.md                  # 项目说明
```

### 文件职责

#### 入口文件 (`src/index.ts`)

```typescript
// 导出主要的公共API
export { MapSDK } from "./MapSDK";
export { MapProvider } from "./types";
export type { MapConfig, MarkerConfig, IMarker, IMarkerCluster } from "./types";

// 不导出内部实现细节
// export { GoogleMapProvider } from './providers/GoogleMapProvider'; // ❌
```

#### 类型定义 (`src/types/index.ts`)

```typescript
// 枚举定义
export enum MapProvider {
  AMAP = "amap",
  GOOGLE = "google",
  OPENLAYERS = "openlayers",
}

// 接口定义 (按功能分组)
export interface MapConfig {}
export interface MarkerConfig {}

// 抽象接口
export interface IMapProvider {}
export interface IMarker {}
```

## 🔧 构建与部署规范

### 1. TypeScript 配置

#### 严格模式设置

```json
{
  "compilerOptions": {
    "strict": true, // 启用所有严格检查
    "noImplicitAny": true, // 禁止隐式any
    "strictNullChecks": true, // 严格空值检查
    "strictFunctionTypes": true, // 严格函数类型检查
    "forceConsistentCasingInFileNames": true // 强制文件名大小写一致
  }
}
```

#### 输出配置

```json
{
  "compilerOptions": {
    "target": "ES2020", // 目标ES版本
    "module": "ES2020", // 模块系统
    "declaration": true, // 生成.d.ts文件
    "declarationMap": true, // 生成声明文件map
    "sourceMap": true // 生成源码映射
  }
}
```

### 2. Rollup 构建配置

#### 多格式输出

```javascript
export default {
  output: [
    {
      file: "dist/index.js", // ES模块
      format: "es",
      sourcemap: true,
      exports: "named",
    },
    {
      file: "dist/index.cjs", // CommonJS
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
  ],
};
```

#### 外部依赖处理

```javascript
export default {
  external: [
    "@googlemaps/js-api-loader", // Google Maps相关
    "@googlemaps/markerclusterer",
    "lodash-es", // 工具库
  ],
};
```

### 3. 包发布配置

#### package.json 关键字段

```json
{
  "main": "dist/index.cjs", // CommonJS入口
  "module": "dist/index.js", // ES模块入口
  "types": "dist/index.d.ts", // 类型定义入口
  "exports": {
    ".": {
      "import": "./dist/index.js", // ES模块导入
      "require": "./dist/index.cjs", // CommonJS导入
      "types": "./dist/index.d.ts" // 类型定义
    },
    "./css": "./dist/index.css" // CSS文件导出
  },
  "files": [
    "dist", // 发布dist目录
    "README.md" // 发布说明文档
  ]
}
```

## 🧪 测试规范

### 1. 测试结构

```
tests/
├── unit/                    # 单元测试
│   ├── MapSDK.test.ts      # 主类测试
│   ├── providers/          # 提供者测试
│   │   ├── GoogleMapProvider.test.ts
│   │   └── AMapProvider.test.ts
│   └── utils/              # 工具函数测试
├── integration/            # 集成测试
│   └── full-workflow.test.ts
└── setup.ts               # 测试环境设置
```

### 2. 测试规范

```typescript
// 测试文件命名: *.test.ts
// 测试描述使用英文
describe("MapSDK", () => {
  describe("initialization", () => {
    it("should throw error for unsupported provider", () => {
      expect(() => {
        new MapSDK("unsupported" as MapProvider);
      }).toThrow("Unsupported map provider");
    });

    it("should initialize successfully with valid provider", async () => {
      const mapSDK = new MapSDK(MapProvider.GOOGLE);
      await expect(
        mapSDK.init({
          container: "test-container",
          apiKey: "test-key",
        })
      ).resolves.not.toThrow();
    });
  });
});
```

### 3. Mock 策略

```typescript
// Mock 外部依赖
jest.mock("@googlemaps/js-api-loader", () => ({
  Loader: jest.fn().mockImplementation(() => ({
    load: jest.fn().mockResolvedValue(undefined),
  })),
}));

// 提供测试用的DOM环境
beforeEach(() => {
  document.body.innerHTML = '<div id="test-container"></div>';
});
```

## 📚 文档规范

### 1. README 结构

```markdown
# 项目标题

简短描述

## 安装

npm install 命令

## 快速开始

基本使用示例

## API 文档

主要 API 说明

## 示例

使用示例

## 贡献

贡献指南

## 许可证

许可证信息
```

### 2. API 文档

````typescript
/**
 * Map SDK主类，提供统一的地图操作接口
 *
 * @example
 * ```typescript
 * const mapSDK = new MapSDK(MapProvider.GOOGLE);
 * await mapSDK.init({
 *   container: 'map-container',
 *   center: [116.397428, 39.90923],
 *   zoom: 11,
 *   apiKey: 'your-api-key'
 * });
 * ```
 */
export class MapSDK {
  /**
   * 初始化地图
   * @param config 地图配置选项
   * @throws {Error} 当配置无效或初始化失败时抛出错误
   */
  async init(config: MapSDKConfig): Promise<void>;
}
````

### 3. 变更日志

```markdown
# Changelog

## [3.0.0] - 2024-01-15

### Added

- 新增轨迹动画功能
- 支持多边形绘制
- 添加路径规划功能

### Changed

- 重构了 Provider 架构
- 改进了错误处理机制

### Fixed

- 修复了内存泄漏问题
- 解决了标记点聚合的性能问题

### Breaking Changes

- API 接口发生变化，需要更新调用方式
```

## 🔄 持续改进

### 1. 代码审查清单

- [ ] 是否遵循 SOLID 原则？
- [ ] 是否有适当的错误处理？
- [ ] 是否有完整的类型定义？
- [ ] 是否有必要的注释和文档？
- [ ] 是否有对应的测试用例？
- [ ] 是否考虑了向后兼容性？

### 2. 性能优化原则

- 避免不必要的对象创建
- 使用懒加载减少初始化时间
- 实现适当的缓存机制
- 及时清理不再使用的资源

### 3. 安全考虑

- 验证外部输入参数
- 避免 XSS 注入攻击
- 安全地处理 API 密钥
- 实现适当的错误边界

---

本文档作为 Map SDK 项目的设计指南和编码规范，应当随着项目的发展而持续更新和完善。
