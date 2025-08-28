import { MapProviderFactory } from "./providers/MapProviderFactory";
export class MapSDK {
    constructor(provider) {
        this.isInitialized = false;
        if (!MapProviderFactory.isProviderSupported(provider)) {
            throw new Error(`Unsupported map provider: ${provider}`);
        }
        this.provider = MapProviderFactory.createProvider(provider);
    }
    /**
     * 初始化地图
     * @param config 地图配置
     */
    async init(config) {
        if (this.isInitialized) {
            throw new Error("Map is already initialized");
        }
        await this.provider.init(config);
        this.isInitialized = true;
    }
    /**
     * 添加标记点
     * @param config 标记点配置
     * @returns 标记点实例
     */
    async addMarker(config) {
        if (!this.isInitialized) {
            throw new Error("Map is not initialized. Call init() first.");
        }
        return await this.provider.addMarker(config);
    }
    /**
     * 批量/条件清除标记点
     */
    clearMarkers(params) {
        if (!this.isInitialized) {
            throw new Error("Map is not initialized. Call init() first.");
        }
        this.provider.clearMarkers(params);
    }
    /**
     * 添加标记点聚合
     * @param points 坐标点数组
     * @param options 聚合选项
     * @returns 标记点聚合实例
     */
    async addMarkerCluster(points, options) {
        if (!this.isInitialized) {
            throw new Error("Map is not initialized. Call init() first.");
        }
        return await this.provider.addMarkerCluster(points, options);
    }
    /**
     * 批量/条件清除聚合
     */
    clearMarkerClusters(params) {
        if (!this.isInitialized) {
            throw new Error("Map is not initialized. Call init() first.");
        }
        this.provider.clearMarkerClusters(params);
    }
    /**
     * 设置地图中心点
     * @param position 中心点坐标 [经度, 纬度]
     */
    setCenter(position) {
        if (!this.isInitialized) {
            throw new Error("Map is not initialized. Call init() first.");
        }
        this.provider.setCenter(position);
    }
    /**
     * 设置地图缩放级别
     * @param zoom 缩放级别
     */
    setZoom(zoom) {
        if (!this.isInitialized) {
            throw new Error("Map is not initialized. Call init() first.");
        }
        this.provider.setZoom(zoom);
    }
    getZoom() {
        if (!this.isInitialized) {
            throw new Error("Map is not initialized. Call init() first.");
        }
        return this.provider.getZoom();
    }
    /**
     * 添加路径规划：驾车
     */
    async addPathPlanning(options) {
        if (!this.isInitialized) {
            throw new Error("Map is not initialized. Call init() first.");
        }
        return await this.provider.addPathPlanning(options);
    }
    /**
     * 通过经纬度获取详细地址信息
     */
    async getAddress(position) {
        if (!this.isInitialized) {
            throw new Error("Map is not initialized. Call init() first.");
        }
        return await this.provider.getAddress(position);
    }
    /**
     * 添加信息窗体（InfoWindow）
     */
    async addInfoWindow(options) {
        if (!this.isInitialized) {
            throw new Error("Map is not initialized. Call init() first.");
        }
        return await this.provider.addInfoWindow(options);
    }
    /**
     * 绘制折线（Polyline）
     */
    async addPolyline(options) {
        if (!this.isInitialized) {
            throw new Error("Map is not initialized. Call init() first.");
        }
        return await this.provider.addPolyline(options);
    }
    /**
     * 添加多边形
     */
    async addPolygon(config) {
        if (!this.isInitialized) {
            throw new Error("Map is not initialized. Call init() first.");
        }
        return await this.provider.addPolygon(config);
    }
    /**
     * 清除多边形
     */
    clearPolygons(params) {
        if (!this.isInitialized) {
            throw new Error("Map is not initialized. Call init() first.");
        }
        this.provider.clearPolygons(params);
    }
    /**
     * 获取所有标记点
     * @returns 标记点数组
     */
    getMarkers() {
        if (!this.isInitialized) {
            throw new Error("Map is not initialized. Call init() first.");
        }
        return this.provider.getMarkers();
    }
    /**
     * 清除所有或部分标记点（无参时清空所有）
     */
    // clearAllMarkers(params?: { type?: string; markers?: Array<IMarker> }): void {
    //   this.clearMarkers(params)
    // }
    /**
     * 清除所有折线
     */
    clearPolylines(params) {
        if (!this.isInitialized) {
            throw new Error("Map is not initialized. Call init() first.");
        }
        this.provider.clearPolylines(params);
    }
    /**
     * 添加轨迹动画
     */
    async addAnimation(config) {
        if (!this.isInitialized) {
            throw new Error("Map is not initialized. Call init() first.");
        }
        return await this.provider.addAnimation(config);
    }
    /**
     * 清除轨迹动画
     */
    clearAnimations(params) {
        if (!this.isInitialized) {
            throw new Error("Map is not initialized. Call init() first.");
        }
        this.provider.clearAnimations(params);
    }
    /**
     * 清除路径规划
     */
    clearPathPlannings(params) {
        if (!this.isInitialized) {
            throw new Error("Map is not initialized. Call init() first.");
        }
        this.provider.clearPathPlannings(params);
    }
    /**
     * 清除信息窗体
     */
    clearInfoWindow(params) {
        if (!this.isInitialized) {
            throw new Error("Map is not initialized. Call init() first.");
        }
        this.provider.clearInfoWindow(params);
    }
    /**
     * 清空地图所有内容
     */
    async clearMap() {
        if (!this.isInitialized) {
            throw new Error("Map is not initialized. Call init() first.");
        }
        await this.provider.clearMap();
    }
    /**
     * 销毁地图
     */
    destroy() {
        if (this.isInitialized) {
            this.provider.destroy();
            this.isInitialized = false;
        }
    }
    /**
     * 检查地图是否已初始化
     */
    isMapInitialized() {
        return this.isInitialized;
    }
    /**
     * 获取支持的地图提供者列表
     * @returns 支持的地图提供者数组
     */
    static getSupportedProviders() {
        return MapProviderFactory.getSupportedProviders();
    }
    /**
     * 检查地图提供者是否被支持
     * @param provider 地图提供者
     * @returns 是否支持
     */
    static isProviderSupported(provider) {
        return MapProviderFactory.isProviderSupported(provider);
    }
    /**
     * 注册自定义地图提供者
     * @param provider 地图提供者枚举
     * @param providerClass 提供者类
     */
    static registerProvider(provider, providerClass) {
        MapProviderFactory.registerProvider(provider, providerClass);
    }
}
