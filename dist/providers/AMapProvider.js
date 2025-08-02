import { BaseMapProvider } from './BaseMapProvider';
export class AMapProvider extends BaseMapProvider {
    /**
     * 动态加载高德地图SDK
     * @param apiKey 高德地图API密钥
     */
    async loadAMapSDK(apiKey) {
        return new Promise((resolve, reject) => {
            // 检查是否已经加载
            if (window.AMap) {
                resolve();
                return;
            }
            // 创建script标签
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://webapi.amap.com/maps?v=2.0&key=${apiKey || ''}&plugin=AMap.Marker`;
            script.async = true;
            script.defer = true;
            // 加载成功回调
            script.onload = () => {
                if (window.AMap) {
                    resolve();
                }
                else {
                    reject(new Error('AMap SDK failed to load'));
                }
            };
            // 加载失败回调
            script.onerror = () => {
                reject(new Error('Failed to load AMap SDK'));
            };
            // 添加到页面
            document.head.appendChild(script);
        });
    }
    async init(config) {
        this.config = config;
        // 动态加载高德地图SDK
        if (typeof window !== 'undefined' && !this.AMap) {
            try {
                // 检查是否已经加载了高德地图SDK
                if (!window.AMap) {
                    // 动态加载高德地图SDK
                    await this.loadAMapSDK(config.apiKey);
                }
                this.AMap = window.AMap;
            }
            catch (error) {
                throw new Error(`Failed to load AMap SDK: ${error}`);
            }
        }
        const container = typeof config.container === 'string'
            ? document.getElementById(config.container)
            : config.container;
        if (!container) {
            throw new Error('Container element not found');
        }
        this.map = new this.AMap.Map(container, {
            center: config.center || [116.397428, 39.90923],
            zoom: config.zoom || 11,
            ...config
        });
    }
    async addMarker(config) {
        if (!this.map) {
            throw new Error('Map not initialized');
        }
        const markerId = this.generateMarkerId();
        const { position, ...otherConfig } = config;
        const amapMarker = new this.AMap.Marker({
            position,
            title: config.title,
            content: config.content,
            icon: config.icon,
            clickable: config.clickable !== false,
            draggable: config.draggable || false,
            ...otherConfig
        });
        this.map.add(amapMarker);
        const marker = {
            id: markerId,
            position: config.position,
            amapMarker,
            setPosition: (position) => {
                amapMarker.setPosition(position);
                marker.position = position;
            },
            setTitle: (title) => {
                amapMarker.setTitle(title);
            },
            setContent: (content) => {
                amapMarker.setContent(content);
            },
            remove: () => {
                this.map.remove(amapMarker);
                this.removeMarkerFromCollection(markerId);
            }
        };
        this.addMarkerToCollection(marker);
        return marker;
    }
    removeMarker(marker) {
        const amapMarker = marker.amapMarker;
        if (amapMarker) {
            this.map.remove(amapMarker);
            this.removeMarkerFromCollection(marker.id);
        }
    }
    setCenter(position) {
        if (this.map) {
            this.map.setCenter(position);
        }
    }
    setZoom(zoom) {
        if (this.map) {
            this.map.setZoom(zoom);
        }
    }
    destroy() {
        if (this.map) {
            this.map.destroy();
            this.map = null;
        }
        this.clearMarkers();
    }
}
