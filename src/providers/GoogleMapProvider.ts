import { BaseMapProvider } from './BaseMapProvider';
import { IMarker, MapConfig, MarkerConfig } from '../types';

interface GoogleMarker extends IMarker {
  googleMarker: any;
}

export class GoogleMapProvider extends BaseMapProvider {
  private google: any;

  /**
   * 动态加载Google Maps SDK
   * @param key Google Maps API密钥
   */
  private async loadGoogleMapsSDK(key?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // 检查是否已经加载
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      // 创建script标签
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key || ''}&libraries=geometry,places,marker`;
      script.async = true;
      script.defer = true;

      // 加载成功回调
      script.onload = () => {
        if (window.google && window.google.maps) {
          resolve();
        } else {
          reject(new Error('Google Maps SDK failed to load'));
        }
      };

      // 加载失败回调
      script.onerror = () => {
        reject(new Error('Failed to load Google Maps SDK'));
      };

      // 添加到页面
      document.head.appendChild(script);
    });
  }

  async init(config: MapConfig): Promise<void> {
    this.config = config;
    
    // 动态加载Google Maps SDK
    if (typeof window !== 'undefined' && !this.google) {
      try {
        // 检查是否已经加载了Google Maps SDK
        if (!window.google || !window.google.maps) {
          // 动态创建script标签加载Google Maps SDK
          await this.loadGoogleMapsSDK(config.key);
        }
        this.google = window.google;
      } catch (error) {
        throw new Error(`Failed to load Google Maps SDK: ${error}`);
      }
    }

    const container = typeof config.container === 'string' 
      ? document.getElementById(config.container) 
      : config.container;

    if (!container) {
      throw new Error('Container element not found');
    }
   
    this.map = new this.google.maps.Map(container, {
      center: { 
        lat: Number(config.center?.[1]) || 39.90923, 
        lng: Number(config.center?.[0]) || 116.397428 
      },
      zoom: config.zoom || 11,
    });
  }

  async addMarker(config: MarkerConfig): Promise<IMarker> {
    if (!this.map) {
      throw new Error('Map not initialized');
    }

    const markerId = this.generateMarkerId();
    
    const { position, ...otherConfig } = config;
    const googleMarker = new this.google.maps.Marker({
      position: { 
        lat: position[1], 
        lng: position[0] 
      },
      title: config.title,
      icon: config.icon,
      clickable: config.clickable !== false,
      draggable: config.draggable || false,
      map: this.map,
      ...otherConfig
    });

    const marker: GoogleMarker = {
      id: markerId,
      position: config.position,
      googleMarker,
      setPosition: (position: [number, number]) => {
        googleMarker.setPosition({ 
          lat: position[1], 
          lng: position[0] 
        });
        marker.position = position;
      },
      setTitle: (title: string) => {
        googleMarker.setTitle(title);
      },
      setContent: (content: string) => {
        // Google Maps markers don't have a direct setContent method
        // You might want to use InfoWindow instead
        console.warn('setContent is not supported for Google Maps markers');
      },
      remove: () => {
        googleMarker.setMap(null);
        this.removeMarkerFromCollection(markerId);
      }
    };

    this.addMarkerToCollection(marker);
    return marker;
  }

  removeMarker(marker: IMarker): void {
    const googleMarker = (marker as GoogleMarker).googleMarker;
    if (googleMarker) {
      googleMarker.setMap(null);
      this.removeMarkerFromCollection(marker.id);
    }
  }

  setCenter(position: [number, number]): void {
    console.log(`%c yqm log, enter setCenter::: `, 'color: pink;',)
    if (this.map) {
      this.map.setCenter({ 
        lat: position[1], 
        lng: position[0] 
      });
    }
  }

  setZoom(zoom: number): void {
    if (this.map) {
      this.map.setZoom(zoom);
    }
  }

  destroy(): void {
    if (this.map) {
      // Google Maps doesn't have a destroy method
      // Just clear the map reference
      this.map = null;
    }
    this.clearMarkers();
  }
}

// 扩展window对象以包含Google Maps
declare global {
  interface Window {
    google?: {
      maps: any;
    };
  }
} 