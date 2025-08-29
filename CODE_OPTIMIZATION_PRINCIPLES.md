# 代码优化原则与规范文档

## 概述

本文档记录了 Map SDK 项目代码结构优化过程中采用的原则、规范和最佳实践。这些规范旨在提高代码质量、可维护性和类型安全性。

## 1. TypeScript 类型安全优化

### 1.1 使用 const assertion 替代 enum

**原则：** 优先使用 `const assertion` 和类型联合，而不是 `enum`

**优化前：**

```typescript
export enum MapProvider {
  AMAP = "amap",
  GOOGLE = "google",
  OPENLAYERS = "openlayers",
}
```

**优化后：**

```typescript
export const MAP_PROVIDERS = {
  AMAP: "amap",
  GOOGLE: "google",
  OPENLAYERS: "openlayers",
} as const;

export type MapProvider = (typeof MAP_PROVIDERS)[keyof typeof MAP_PROVIDERS];
```

**优势：**

- 更好的类型推断
- 避免反向映射问题
- 支持 tree-shaking
- 更灵活的扩展性

### 1.2 使用 unknown 替代 any

**原则：** 尽可能使用 `unknown` 替代 `any` 以提高类型安全性

**优化前：**

```typescript
[key: string]: any;
```

**优化后：**

```typescript
readonly [key: string]: unknown;
```

### 1.3 使用 readonly 修饰符确保不可变性

**原则：** 对于不应该被修改的属性和数组，使用 `readonly` 修饰符

**优化前：**

```typescript
interface MarkerConfig {
  position: [number, number];
  [key: string]: any;
}
```

**优化后：**

```typescript
interface MarkerConfig extends BaseConfig {
  readonly position: readonly [number, number];
  readonly [key: string]: unknown;
}
```

## 2. 错误处理规范

### 2.1 自定义错误类

**原则：** 为不同的业务领域创建专门的错误类

```typescript
export class MapSDKError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = "MapSDKError";
  }
}

export class MapProviderError extends Error {
  constructor(message: string, public readonly provider?: MapProvider) {
    super(message);
    this.name = "MapProviderError";
  }
}
```

### 2.2 错误代码常量

**原则：** 使用错误代码常量提供标准化的错误识别

```typescript
export const ERROR_CODES = {
  NOT_INITIALIZED: "NOT_INITIALIZED",
  ALREADY_INITIALIZED: "ALREADY_INITIALIZED",
  UNSUPPORTED_PROVIDER: "UNSUPPORTED_PROVIDER",
  INVALID_CONFIG: "INVALID_CONFIG",
} as const;
```

### 2.3 统一错误处理模式

**原则：** 在方法开始时进行参数验证，使用 try-catch 包装外部调用

```typescript
async addMarker(config: MarkerConfig): Promise<IMarker> {
  this.ensureInitialized(); // 状态检查

  if (!config?.position) { // 参数验证
    throw new MapSDKError("Marker position is required", ERROR_CODES.INVALID_CONFIG);
  }

  try {
    return await this.provider.addMarker(config);
  } catch (error) { // 错误包装
    throw new MapSDKError(
      `Failed to add marker: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
```

## 3. 接口设计原则

### 3.1 基础接口继承

**原则：** 使用基础接口定义通用属性，通过继承减少重复

```typescript
export interface BaseConfig {
  readonly id?: string;
  readonly data?: Record<string, unknown>;
}

export interface MarkerConfig extends BaseConfig {
  readonly position: readonly [number, number];
  // 其他特定属性...
}
```

### 3.2 泛型接口设计

**原则：** 使用泛型接口提高代码复用性

```typescript
export interface ClearParams<T> {
  readonly type?: string;
  readonly items?: readonly T[];
}

// 使用示例
clearMarkers(params?: ClearParams<IMarker>): void;
clearPolygons(params?: ClearParams<IPolygon>): void;
```

### 3.3 事件参数接口分离

**原则：** 将事件参数抽象为独立接口，提高可复用性

```typescript
export interface MarkerEventParams {
  readonly event: Event;
  readonly content: HTMLElement;
  readonly data: unknown;
  readonly position: readonly [number, number];
  readonly marker: unknown;
}
```

## 4. 类设计模式

### 4.1 私有方法提取

**原则：** 将重复的逻辑抽象为私有方法

```typescript
export class MapSDK {
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new MapSDKError("Map is not initialized. Call init() first.", ERROR_CODES.NOT_INITIALIZED);
    }
  }

  private validateConfig(config: MapSDKConfig): void {
    if (!config) {
      throw new MapSDKError("Config is required", ERROR_CODES.INVALID_CONFIG);
    }
    // 更多验证逻辑...
  }
}
```

### 4.2 工厂模式增强

**原则：** 在工厂模式中添加详细的错误处理和类型安全

```typescript
export class MapProviderFactory {
  static createProvider(provider: MapProvider): IMapProvider {
    const ProviderClass = this.providers.get(provider);

    if (!ProviderClass) {
      throw new MapProviderError(
        `Unsupported map provider: ${provider}. Supported providers: ${this.getSupportedProviders().join(", ")}`,
        provider
      );
    }

    try {
      return new ProviderClass();
    } catch (error) {
      throw new MapProviderError(
        `Failed to create provider instance for ${provider}: ${error instanceof Error ? error.message : "Unknown error"}`,
        provider
      );
    }
  }
}
```

## 5. 函数式编程原则

### 5.1 纯函数设计

**原则：** 优先使用纯函数，避免副作用

```typescript
// 优化前 - 有副作用
const createDomContent = (input: any): HTMLElement => {
  // 可能修改全局状态
};

// 优化后 - 纯函数
export function createDomContent(input: unknown): HTMLElement {
  if (isValidHTMLElement(input)) {
    return input; // 不修改输入
  }
  // 返回新的实例
}
```

### 5.2 函数参数验证

**原则：** 在函数开始时验证所有输入参数

```typescript
export function safeSetInnerHTML(element: HTMLElement, content: string): void {
  if (!isValidHTMLElement(element)) {
    throw new DOMError("Invalid HTMLElement provided");
  }

  if (typeof content !== "string") {
    throw new DOMError("Content must be a string");
  }

  // 执行操作...
}
```

## 6. 模块化设计

### 6.1 单一职责原则

**原则：** 每个模块只负责一个特定功能领域

- `types/index.ts` - 类型定义
- `providers/` - 地图提供者实现
- `utils/` - 通用工具函数
- `MapSDK.ts` - 主要 SDK 接口

### 6.2 导出策略

**原则：** 明确区分主要导出和次要导出

```typescript
// 主类
export { MapSDK, MapSDKError, ERROR_CODES } from "./MapSDK";

// 类型定义
export {
  MAP_PROVIDERS,
  COVERING_TYPES,
  // ... 详细的类型导出
} from "./types";

// 工具函数
export { createDomContent, safeSetInnerHTML, DOMError } from "./utils";

// 默认导出
import { MapSDK } from "./MapSDK";
export default MapSDK;
```

## 7. 性能优化原则

### 7.1 不可变数据结构

**原则：** 使用 `readonly` 和不可变模式减少意外修改

```typescript
protected readonly markers: Map<string, IMarker> = new Map();
protected readonly polygons: Map<string, IPolygon> = new Map();
```

### 7.2 延迟加载

**原则：** 在工厂类中使用静态初始化块进行延迟注册

```typescript
export class MapProviderFactory {
  static {
    // 静态初始化，只在首次使用时执行
    MapProviderFactory.registerProvider(MAP_PROVIDERS.AMAP, AMapProvider);
  }
}
```

## 8. 测试友好设计

### 8.1 依赖注入

**原则：** 支持自定义提供者注册，便于测试

```typescript
static registerProvider(provider: MapProvider, providerClass: ProviderConstructor): void {
  // 允许运行时注册，便于测试 mock
}

static clearProviders(): void {
  // 清除注册，便于测试隔离
}
```

### 8.2 状态检查方法

**原则：** 提供状态检查方法，便于测试验证

```typescript
isMapInitialized(): boolean {
  return this.isInitialized;
}
```

## 9. 向后兼容性

### 9.1 渐进式迁移

**原则：** 保持现有 API 的兼容性，同时提供新的类型安全接口

```typescript
// 保持原有导出
export { MapProvider } from "./types";

// 添加新的类型
export { MAP_PROVIDERS } from "./types";
```

## 10. 文档和注释规范

### 10.1 JSDoc 注释

**原则：** 为所有公共 API 提供详细的 JSDoc 注释

```typescript
/**
 * 添加标记点
 * @param config 标记点配置
 * @returns 标记点实例
 * @throws {MapSDKError} 当地图未初始化或配置无效时
 */
async addMarker(config: MarkerConfig): Promise<IMarker>
```

### 10.2 错误信息国际化准备

**原则：** 使用清晰的英文错误信息，为未来国际化做准备

```typescript
throw new MapSDKError("Map is not initialized. Call init() first.", ERROR_CODES.NOT_INITIALIZED);
```

## 总结

这次代码优化遵循了以下核心原则：

1. **类型安全第一** - 使用 TypeScript 的高级特性确保编译时类型检查
2. **错误处理标准化** - 统一的错误类和错误代码系统
3. **接口设计清晰** - 基于继承和泛型的接口设计
4. **函数式编程** - 纯函数和不可变数据结构
5. **模块化架构** - 单一职责和清晰的模块边界
6. **性能优化** - 不可变结构和延迟加载
7. **测试友好** - 依赖注入和状态检查
8. **向后兼容** - 渐进式 API 升级
9. **文档完善** - 全面的 JSDoc 注释

这些优化提高了代码的可维护性、类型安全性和开发体验。
