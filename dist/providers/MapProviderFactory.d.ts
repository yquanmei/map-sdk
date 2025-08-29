import { MapProvider, IMapProvider } from "../types";
export declare class MapProviderError extends Error {
    readonly provider?: MapProvider;
    constructor(message: string, provider?: MapProvider);
}
type ProviderConstructor = new () => IMapProvider;
export declare class MapProviderFactory {
    private static readonly providers;
    /**
     * 注册地图提供者
     * @param provider 地图提供者类型
     * @param providerClass 提供者构造函数
     */
    static registerProvider(provider: MapProvider, providerClass: ProviderConstructor): void;
    /**
     * 创建地图提供者实例
     * @param provider 地图提供者类型
     * @returns 地图提供者实例
     */
    static createProvider(provider: MapProvider): IMapProvider;
    /**
     * 获取所有支持的地图提供者
     * @returns 支持的地图提供者数组
     */
    static getSupportedProviders(): readonly MapProvider[];
    /**
     * 检查地图提供者是否被支持
     * @param provider 地图提供者
     * @returns 是否支持
     */
    static isProviderSupported(provider: MapProvider): boolean;
    /**
     * 取消注册地图提供者
     * @param provider 地图提供者类型
     */
    static unregisterProvider(provider: MapProvider): boolean;
    /**
     * 清除所有注册的提供者（主要用于测试）
     */
    static clearProviders(): void;
}
export {};
