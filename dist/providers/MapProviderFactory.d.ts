import { MapProvider, IMapProvider } from '../types';
export declare class MapProviderFactory {
    private static providers;
    static registerProvider(provider: MapProvider, providerClass: new () => IMapProvider): void;
    static createProvider(provider: MapProvider): IMapProvider;
    static getSupportedProviders(): MapProvider[];
    static isProviderSupported(provider: MapProvider): boolean;
}
