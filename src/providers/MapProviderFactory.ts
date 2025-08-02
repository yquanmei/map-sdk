import { MapProvider, IMapProvider } from '../types';
import { AMapProvider } from './AMapProvider';
import { GoogleMapProvider } from './GoogleMapProvider';
import { OpenLayersProvider } from './OpenLayersProvider';

export class MapProviderFactory {
  private static providers = new Map<MapProvider, new () => IMapProvider>();

  static {
    // 注册所有可用的提供者
    MapProviderFactory.registerProvider(MapProvider.AMAP, AMapProvider);
    MapProviderFactory.registerProvider(MapProvider.GOOGLE, GoogleMapProvider);
    MapProviderFactory.registerProvider(MapProvider.OPENLAYERS, OpenLayersProvider);
  }

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

  static getSupportedProviders(): MapProvider[] {
    return Array.from(this.providers.keys());
  }

  static isProviderSupported(provider: MapProvider): boolean {
    return this.providers.has(provider);
  }
} 