import { MAP_PROVIDERS, MapProvider, IMapProvider } from "../types";
import { AMapProvider } from "./AMapProvider";
import { GoogleMapProvider } from "./GoogleMapProvider";
import { OpenLayersProvider } from "./OpenLayersProvider";

// 错误类定义
export class MapProviderError extends Error {
  constructor(message: string, public readonly provider?: MapProvider) {
    super(message);
    this.name = "MapProviderError";
  }
}

// 提供者构造函数类型
type ProviderConstructor = new () => IMapProvider;

export class MapProviderFactory {
  private static readonly providers = new Map<MapProvider, ProviderConstructor>();

  static {
    // 注册所有可用的提供者
    MapProviderFactory.registerProvider(MAP_PROVIDERS.AMAP, AMapProvider);
    MapProviderFactory.registerProvider(MAP_PROVIDERS.GOOGLE, GoogleMapProvider);
    MapProviderFactory.registerProvider(MAP_PROVIDERS.OPENLAYERS, OpenLayersProvider);
  }

  /**
   * 注册地图提供者
   * @param provider 地图提供者类型
   * @param providerClass 提供者构造函数
   */
  static registerProvider(provider: MapProvider, providerClass: ProviderConstructor): void {
    if (!provider || typeof provider !== "string") {
      throw new MapProviderError("Invalid provider type");
    }

    if (!providerClass || typeof providerClass !== "function") {
      throw new MapProviderError("Invalid provider class", provider);
    }

    this.providers.set(provider, providerClass);
  }

  /**
   * 创建地图提供者实例
   * @param provider 地图提供者类型
   * @returns 地图提供者实例
   */
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

  /**
   * 获取所有支持的地图提供者
   * @returns 支持的地图提供者数组
   */
  static getSupportedProviders(): readonly MapProvider[] {
    return Array.from(this.providers.keys());
  }

  /**
   * 检查地图提供者是否被支持
   * @param provider 地图提供者
   * @returns 是否支持
   */
  static isProviderSupported(provider: MapProvider): boolean {
    return this.providers.has(provider);
  }

  /**
   * 取消注册地图提供者
   * @param provider 地图提供者类型
   */
  static unregisterProvider(provider: MapProvider): boolean {
    return this.providers.delete(provider);
  }

  /**
   * 清除所有注册的提供者（主要用于测试）
   */
  static clearProviders(): void {
    this.providers.clear();
  }
}
