import { BaseMapProvider } from './BaseMapProvider';
import { IMarker, MapConfig, MarkerConfig } from '../types';

interface OpenLayersMarker extends IMarker {
  olMarker: any;
  olFeature: any;
}

export class OpenLayersProvider extends BaseMapProvider {
  private ol: any;
  private vectorLayer: any;

  /**
   * 动态加载OpenLayers SDK
   */
  private async loadOpenLayersSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      // 检查是否已经加载
      if (window.ol) {
        resolve();
        return;
      }

      // 创建script标签
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://cdn.jsdelivr.net/npm/ol@v7.4.0/dist/ol.js';
      script.async = true;
      script.defer = true;

      // 加载成功回调
      script.onload = () => {
        if (window.ol) {
          resolve();
        } else {
          reject(new Error('OpenLayers SDK failed to load'));
        }
      };

      // 加载失败回调
      script.onerror = () => {
        reject(new Error('Failed to load OpenLayers SDK'));
      };

      // 添加到页面
      document.head.appendChild(script);
    });
  }

  async init(config: MapConfig): Promise<void> {
    this.config = config;
    
    // 动态加载OpenLayers SDK
    if (typeof window !== 'undefined' && !this.ol) {
      try {
        // 检查是否已经加载了OpenLayers SDK
        if (!window.ol) {
          // 动态加载OpenLayers SDK
          await this.loadOpenLayersSDK();
        }
        this.ol = window.ol;
      } catch (error) {
        throw new Error(`Failed to load OpenLayers SDK: ${error}`);
      }
    }

    const container = typeof config.container === 'string' 
      ? document.getElementById(config.container) 
      : config.container;

    if (!container) {
      throw new Error('Container element not found');
    }

    // 创建矢量图层用于放置markers
    this.vectorLayer = new this.ol.layer.Vector({
      source: new this.ol.source.Vector()
    });

    this.map = new this.ol.Map({
      target: container,
      layers: [
        new this.ol.layer.Tile({
          source: new this.ol.source.OSM()
        }),
        this.vectorLayer
      ],
      view: new this.ol.View({
        center: this.ol.proj.fromLonLat(config.center || [116.397428, 39.90923]),
        zoom: config.zoom || 11
      }),
      ...config
    });
  }

  async addMarker(config: MarkerConfig): Promise<IMarker> {
    if (!this.map || !this.vectorLayer) {
      throw new Error('Map not initialized');
    }

    const markerId = this.generateMarkerId();
    const { position, ...otherConfig } = config;
    
    // 创建marker要素
    const feature = new this.ol.Feature({
      geometry: new this.ol.geom.Point(this.ol.proj.fromLonLat(position))
    });

    // 创建marker样式
    const markerStyle = new this.ol.style.Style({
      image: new this.ol.style.Icon({
        src: config.icon || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill="red"/></svg>',
        scale: 1
      })
    });

    feature.setStyle(markerStyle);

    // 添加到矢量图层
    this.vectorLayer.getSource().addFeature(feature);

    const marker: OpenLayersMarker = {
      id: markerId,
      position,
      olMarker: feature,
      olFeature: feature,
      setPosition: (newPosition: [number, number]) => {
        feature.getGeometry().setCoordinates(this.ol.proj.fromLonLat(newPosition));
        marker.position = newPosition;
      },
      setTitle: (title: string) => {
        feature.set('title', title);
      },
      setContent: (content: string) => {
        feature.set('content', content);
      },
      remove: () => {
        this.vectorLayer.getSource().removeFeature(feature);
        this.removeMarkerFromCollection(markerId);
      }
    };

    this.addMarkerToCollection(marker);
    return marker;
  }

  removeMarker(marker: IMarker): void {
    const olMarker = (marker as OpenLayersMarker).olFeature;
    if (olMarker && this.vectorLayer) {
      this.vectorLayer.getSource().removeFeature(olMarker);
      this.removeMarkerFromCollection(marker.id);
    }
  }

  setCenter(position: [number, number]): void {
    if (this.map) {
      this.map.getView().setCenter(this.ol.proj.fromLonLat(position));
    }
  }

  setZoom(zoom: number): void {
    if (this.map) {
      this.map.getView().setZoom(zoom);
    }
  }

  destroy(): void {
    if (this.map) {
      this.map.setTarget(undefined);
      this.map = null;
    }
    this.clearMarkers();
  }
}

// 扩展window对象以包含OpenLayers
declare global {
  interface Window {
    ol?: any;
  }
} 