import { BaseMapProvider } from './BaseMapProvider';
import { IMarker, MapConfig, MarkerConfig, MarkerClusterPoint, MarkerClusterOptions, IMarkerCluster } from '../types';

interface GoogleMarker extends IMarker {
  googleMarker: any;
}

interface GoogleMarkerCluster extends IMarkerCluster {
  markerClusterer: any;
  googleMarkers: any[];
}

export class GoogleMapProvider extends BaseMapProvider {
  private google: any;
  private plugins: string[] = [];

  /**
   * 动态加载Google Maps SDK和MarkerClusterer库
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key || ''}&libraries=geometry,places`;
      script.async = true;
      script.defer = true;

      // 加载成功回调
      script.onload = () => {
        if (window.google && window.google.maps) {
          // 如果配置了cluster插件，则加载MarkerClusterer库
          if (this.plugins.includes('cluster')) {
            this.loadMarkerClusterer().then(resolve).catch((error) => {
              console.warn('MarkerClusterer failed to load, but Google Maps SDK is ready:', error);
              resolve(); // 即使 MarkerClusterer 加载失败，也继续初始化
            });
          } else {
            resolve();
          }
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

  /**
   * 动态加载 MarkerClusterer 库
   */
  private async loadMarkerClusterer(): Promise<void> {
    return new Promise((resolve, reject) => {
      // 检查是否已经加载
      if (
        (window.MarkerClusterer && (window.MarkerClusterer.MarkerClusterer || typeof window.MarkerClusterer === 'function')) ||
        ((window as any)['markerClusterer'] && ((window as any)['markerClusterer'].MarkerClusterer || typeof (window as any)['markerClusterer'] === 'function'))
      ) {
        resolve();
        return;
      }

      // 检查页面上是否已存在 script
      if (document.querySelector('script[data-mc-loader]')) {
        // 已有 script，等待其加载
        const checkReady = () => {
          if (
            (window.MarkerClusterer && (window.MarkerClusterer.MarkerClusterer || typeof window.MarkerClusterer === 'function')) ||
            ((window as any)['markerClusterer'] && ((window as any)['markerClusterer'].MarkerClusterer || typeof (window as any)['markerClusterer'] === 'function'))
          ) {
            resolve();
          } else {
            setTimeout(checkReady, 100);
          }
        };
        checkReady();
        return;
      }

      // 创建script标签
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js';
      script.async = true;
      script.defer = true;
      script.setAttribute('data-mc-loader', '1');

      script.onload = () => {
        setTimeout(() => {
          if (
            (window.MarkerClusterer && (window.MarkerClusterer.MarkerClusterer || typeof window.MarkerClusterer === 'function')) ||
            ((window as any)['markerClusterer'] && ((window as any)['markerClusterer'].MarkerClusterer || typeof (window as any)['markerClusterer'] === 'function'))
          ) {
            resolve();
          } else {
            reject(new Error('MarkerClusterer failed to load. Please check your network or CDN.'));
          }
        }, 300);
      };

      script.onerror = () => {
        reject(new Error('Failed to load MarkerClusterer script. Please check your network or CDN.'));
      };

      document.head.appendChild(script);
    });
  }

  async init(config: MapConfig): Promise<void> {
    this.config = config;
    
    // 保存插件配置
    this.plugins = config.plugins || [];
    
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

  setCenter(position: [number, number]): void {
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
    this.clearMarkerClusters();
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

  async addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster> {
    if (!this.map) {
      throw new Error('Map not initialized');
    }

    // 检查是否启用了cluster插件
    if (!this.plugins.includes('cluster')) {
      throw new Error('Cluster plugin is not enabled. Add "cluster" to the plugins array in init config.');
    }

    // 自动等待 MarkerClusterer 加载
    if (
      !window.MarkerClusterer ||
      (!window.MarkerClusterer.MarkerClusterer && typeof window.MarkerClusterer !== 'function')
    ) {
      await this.loadMarkerClusterer();
    }

    const clusterId = this.generateClusterId();
    const defaultOptions: MarkerClusterOptions = {
      gridSize: 60,
      maxZoom: 18,
      renderClusterMarker: '<div style="background-color: #ff6b6b; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold;">{count}</div>',
      renderMarker: {
        position: [0, 0], // 占位符，实际位置会从 point 中获取
        icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
      },
      ...options
    };

    // 创建标记点数组
    const markers: any[] = [];
    points.forEach((point,index) => {
      const { position: _, ...renderMarkerConfig } = defaultOptions.renderMarker!;
      let { position: pointPosition, ...pointConfig } = point;
      console.log(`%c yqm log, points::: `, 'color: pink;', points)
      if (!pointPosition) {
        pointPosition = points[index].position
      }
      console.log(`%c yqm log, pointPosition::: `, 'color: pink;', pointPosition)
      const marker = new this.google.maps.Marker({
        position: { 
          lat: Number(pointPosition[1]), 
          lng: Number(pointPosition[0]) 
        },
        map: this.map,
        ...renderMarkerConfig,
        ...pointConfig
      });
      markers.push(marker);
    });

    // 创建聚合器
    let markerClusterer: any;
    if (window.MarkerClusterer && window.MarkerClusterer.MarkerClusterer) {
      // 新版 @googlemaps/markerclusterer
      markerClusterer = new window.MarkerClusterer.MarkerClusterer({
        map: this.map,
        markers: markers,
        gridSize: defaultOptions.gridSize,
        maxZoom: defaultOptions.maxZoom,
        renderer: {
          render: ({ count, position }: any) => {
            const div = document.createElement('div');
            div.innerHTML = defaultOptions.renderClusterMarker!.replace('{count}', count.toString());
            const element = div.firstChild as HTMLElement;
            element.style.position = 'absolute';
            element.style.transform = 'translate(-50%, -50%)';
            return element;
          }
        }
      });
    } else if (window.MarkerClusterer && typeof window.MarkerClusterer === 'function') {
      // 旧版 MarkerClusterer
      markerClusterer = new window.MarkerClusterer({
        map: this.map,
        markers: markers,
        gridSize: defaultOptions.gridSize,
        maxZoom: defaultOptions.maxZoom,
        renderer: {
          render: ({ count, position }: any) => {
            const div = document.createElement('div');
            div.innerHTML = defaultOptions.renderClusterMarker!.replace('{count}', count.toString());
            const element = div.firstChild as HTMLElement;
            element.style.position = 'absolute';
            element.style.transform = 'translate(-50%, -50%)';
            return element;
          }
        }
      });
    } else if ((window as any)['markerClusterer'] && (window as any)['markerClusterer'].MarkerClusterer) {
      // 某些CDN小写
      markerClusterer = new (window as any)['markerClusterer'].MarkerClusterer({
        map: this.map,
        markers: markers,
        gridSize: defaultOptions.gridSize,
        maxZoom: defaultOptions.maxZoom,
        renderer: {
          render: ({ count, position }: any) => {
            const div = document.createElement('div');
            div.innerHTML = defaultOptions.renderClusterMarker!.replace('{count}', count.toString());
            const element = div.firstChild as HTMLElement;
            element.style.position = 'absolute';
            element.style.transform = 'translate(-50%, -50%)';
            return element;
          }
        }
      });
    } else if ((window as any)['markerClusterer'] && typeof (window as any)['markerClusterer'] === 'function') {
      console.log(`%c yqm log, 自定义的markerClusterer::: `, 'color: pink;', )
      markerClusterer = new (window as any)['markerClusterer']({
        map: this.map,
        markers: markers,
        gridSize: defaultOptions.gridSize,
        maxZoom: defaultOptions.maxZoom,
        renderer: {
          render: ({ count, position }: any) => {
            const div = document.createElement('div');
            div.innerHTML = defaultOptions.renderClusterMarker!.replace('{count}', count.toString());
            const element = div.firstChild as HTMLElement;
            element.style.position = 'absolute';
            element.style.transform = 'translate(-50%, -50%)';
            return element;
          }
        }
      });
    } else {
      throw new Error('MarkerClusterer is not loaded.');
    }

    const markerCluster: GoogleMarkerCluster = {
      id: clusterId,
      points: [...points],
      markerClusterer,
      googleMarkers: markers,
      addPoint: (point: MarkerClusterPoint) => {
        const { position: _, ...renderMarkerConfig } = defaultOptions.renderMarker!;
        const { position: pointPosition, ...pointConfig } = point;
        const marker = new this.google.maps.Marker({
          position: { 
            lat: pointPosition[1], 
            lng: pointPosition[0] 
          },
          map: this.map,
          ...renderMarkerConfig,
          ...pointConfig
        });
        markers.push(marker);
        markerCluster.points.push(point);
        markerClusterer.addMarker(marker);
      },
      removePoint: (point: MarkerClusterPoint) => {
        const index = markerCluster.points.findIndex(p => 
          p.position[0] === point.position[0] && p.position[1] === point.position[1]
        );
        if (index !== -1) {
          const marker = markers[index];
          markerClusterer.removeMarker(marker);
          markers.splice(index, 1);
          markerCluster.points.splice(index, 1);
        }
      },
      clear: () => {
        markers.forEach(marker => markerClusterer.removeMarker(marker));
        markers.length = 0;
        markerCluster.points.length = 0;
      },
      remove: () => {
        markerClusterer.clearMarkers();
        this.removeClusterFromCollection(clusterId);
      }
    };

    this.addClusterToCollection(markerCluster);
    return markerCluster;
  }

  removeMarker(marker: IMarker): void {
    const googleMarker = (marker as GoogleMarker).googleMarker;
    if (googleMarker) {
      googleMarker.setMap(null);
      this.removeMarkerFromCollection(marker.id);
    }
  }

  removeMarkerCluster(cluster: IMarkerCluster): void {
    const markerClusterer = (cluster as GoogleMarkerCluster).markerClusterer;
    if (markerClusterer) {
      markerClusterer.clearMarkers();
      this.removeClusterFromCollection(cluster.id);
    }
  }

  removeMarkerFromCollection(markerId: string): void {
    this.markers.delete(markerId);
  }

  addMarkerToCollection(marker: GoogleMarker): void { 
    this.markers.set(marker.id, marker);
  }

  generateMarkerId(): string {
    return `marker_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  generateClusterId(): string {
    return `cluster_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  addClusterToCollection(cluster: GoogleMarkerCluster): void {
    this.markerClusters.set(cluster.id, cluster);
  }

  removeClusterFromCollection(clusterId: string): void {
    this.markerClusters.delete(clusterId);
  }
}

// 扩展window对象以包含Google Maps和MarkerClusterer
declare global {
  interface Window {
    google?: {
      maps: any;
    };
    MarkerClusterer?: any;
  }
} 