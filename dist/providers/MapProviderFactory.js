import { MapProvider } from '../types';
import { AMapProvider } from './AMapProvider';
import { GoogleMapProvider } from './GoogleMapProvider';
import { OpenLayersProvider } from './OpenLayersProvider';
export class MapProviderFactory {
    static registerProvider(provider, providerClass) {
        this.providers.set(provider, providerClass);
    }
    static createProvider(provider) {
        const ProviderClass = this.providers.get(provider);
        if (!ProviderClass) {
            throw new Error(`Unsupported map provider: ${provider}`);
        }
        return new ProviderClass();
    }
    static getSupportedProviders() {
        return Array.from(this.providers.keys());
    }
    static isProviderSupported(provider) {
        return this.providers.has(provider);
    }
}
MapProviderFactory.providers = new Map();
(() => {
    // 注册所有可用的提供者
    MapProviderFactory.registerProvider(MapProvider.AMAP, AMapProvider);
    MapProviderFactory.registerProvider(MapProvider.GOOGLE, GoogleMapProvider);
    MapProviderFactory.registerProvider(MapProvider.OPENLAYERS, OpenLayersProvider);
})();
