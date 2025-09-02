'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsApiLoader = require('@googlemaps/js-api-loader');
var markerclusterer = require('@googlemaps/markerclusterer');

// 使用const assertion提供更好的类型安全性
const MAP_PROVIDERS = {
    AMAP: "amap",
    GOOGLE: "google",
    OPENLAYERS: "openlayers",
};
// 向后兼容：提供运行时可访问的MapProvider对象
const MapProvider = MAP_PROVIDERS;
const COVERING_TYPES = {
    MARKER: "marker",
    CLUSTER: "cluster",
    POLYLINE: "polyline",
    POLYGON: "polygon",
    PATH_PLANNING: "path_planning",
    INFO_WINDOW: "info_window",
    ANIMATION: "animation",
};
// 向后兼容：提供运行时可访问的CoveringType对象
const CoveringType = COVERING_TYPES;

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var dist$1 = {exports: {}};

var dist = dist$1.exports;

var hasRequiredDist;

function requireDist () {
	if (hasRequiredDist) return dist$1.exports;
	hasRequiredDist = 1;
	(function (module, exports) {
(function(m,p){module.exports=p();})(dist,function(){function m(a){var b=[];a.AMapUI&&b.push(p(a.AMapUI));a.Loca&&b.push(r(a.Loca));return Promise.all(b)}function p(a){return new Promise(function(h,c){var f=[];if(a.plugins)for(var e=0;e<a.plugins.length;e+=1) -1==d.AMapUI.plugins.indexOf(a.plugins[e])&&f.push(a.plugins[e]);if(g.AMapUI===b.failed)c("\u524d\u6b21\u8bf7\u6c42 AMapUI \u5931\u8d25");
		else if(g.AMapUI===b.notload){g.AMapUI=b.loading;d.AMapUI.version=a.version||d.AMapUI.version;e=d.AMapUI.version;var l=document.body||document.head,k=document.createElement("script");k.type="text/javascript";k.src="https://webapi.amap.com/ui/"+e+"/main.js";k.onerror=function(a){g.AMapUI=b.failed;c("\u8bf7\u6c42 AMapUI \u5931\u8d25");};k.onload=function(){g.AMapUI=b.loaded;if(f.length)window.AMapUI.loadUI(f,function(){for(var a=0,b=f.length;a<b;a++){var c=f[a].split("/").slice(-1)[0];window.AMapUI[c]=
		arguments[a];}for(h();n.AMapUI.length;)n.AMapUI.splice(0,1)[0]();});else for(h();n.AMapUI.length;)n.AMapUI.splice(0,1)[0]();};l.appendChild(k);}else g.AMapUI===b.loaded?a.version&&a.version!==d.AMapUI.version?c("\u4e0d\u5141\u8bb8\u591a\u4e2a\u7248\u672c AMapUI \u6df7\u7528"):f.length?window.AMapUI.loadUI(f,function(){for(var a=0,b=f.length;a<b;a++){var c=f[a].split("/").slice(-1)[0];window.AMapUI[c]=arguments[a];}h();}):h():a.version&&a.version!==d.AMapUI.version?c("\u4e0d\u5141\u8bb8\u591a\u4e2a\u7248\u672c AMapUI \u6df7\u7528"):
		n.AMapUI.push(function(a){a?c(a):f.length?window.AMapUI.loadUI(f,function(){for(var a=0,b=f.length;a<b;a++){var c=f[a].split("/").slice(-1)[0];window.AMapUI[c]=arguments[a];}h();}):h();});})}function r(a){return new Promise(function(h,c){if(g.Loca===b.failed)c("\u524d\u6b21\u8bf7\u6c42 Loca \u5931\u8d25");else if(g.Loca===b.notload){g.Loca=b.loading;d.Loca.version=a.version||d.Loca.version;var f=d.Loca.version,e=d.AMap.version.startsWith("2"),l=f.startsWith("2");if(e&&!l||!e&&l)c("JSAPI \u4e0e Loca \u7248\u672c\u4e0d\u5bf9\u5e94\uff01\uff01");
		else {e=d.key;l=document.body||document.head;var k=document.createElement("script");k.type="text/javascript";k.src="https://webapi.amap.com/loca?v="+f+"&key="+e;k.onerror=function(a){g.Loca=b.failed;c("\u8bf7\u6c42 AMapUI \u5931\u8d25");};k.onload=function(){g.Loca=b.loaded;for(h();n.Loca.length;)n.Loca.splice(0,1)[0]();};l.appendChild(k);}}else g.Loca===b.loaded?a.version&&a.version!==d.Loca.version?c("\u4e0d\u5141\u8bb8\u591a\u4e2a\u7248\u672c Loca \u6df7\u7528"):h():a.version&&a.version!==d.Loca.version?
		c("\u4e0d\u5141\u8bb8\u591a\u4e2a\u7248\u672c Loca \u6df7\u7528"):n.Loca.push(function(a){a?c(a):c();});})}if(!window)throw Error("AMap JSAPI can only be used in Browser.");var b;(function(a){a.notload="notload";a.loading="loading";a.loaded="loaded";a.failed="failed";})(b||(b={}));var d={key:"",AMap:{version:"1.4.15",plugins:[]},AMapUI:{version:"1.1",plugins:[]},Loca:{version:"1.3.2"}},g={AMap:b.notload,AMapUI:b.notload,Loca:b.notload},n={AMapUI:[],Loca:[]},q=[],t=function(a){"function"==typeof a&&
		(g.AMap===b.loaded?a(window.AMap):q.push(a));};return {load:function(a){return new Promise(function(h,c){if(g.AMap==b.failed)c("");else if(g.AMap==b.notload){var f=a.key,e=a.version,l=a.plugins;f?(window.AMap&&"lbs.amap.com"!==location.host&&c("\u7981\u6b62\u591a\u79cdAPI\u52a0\u8f7d\u65b9\u5f0f\u6df7\u7528"),d.key=f,d.AMap.version=e||d.AMap.version,d.AMap.plugins=l||d.AMap.plugins,g.AMap=b.loading,e=document.body||document.head,window.___onAPILoaded=function(d){delete window.___onAPILoaded;if(d)g.AMap=
		b.failed,c(d);else for(g.AMap=b.loaded,m(a).then(function(){h(window.AMap);})["catch"](c);q.length;)q.splice(0,1)[0]();},l=document.createElement("script"),l.type="text/javascript",l.src="https://webapi.amap.com/maps?callback=___onAPILoaded&v="+d.AMap.version+"&key="+f+"&plugin="+d.AMap.plugins.join(","),l.onerror=function(a){g.AMap=b.failed;c(a);},e.appendChild(l)):c("\u8bf7\u586b\u5199key");}else if(g.AMap==b.loaded)if(a.key&&a.key!==d.key)c("\u591a\u4e2a\u4e0d\u4e00\u81f4\u7684 key");else if(a.version&&
		a.version!==d.AMap.version)c("\u4e0d\u5141\u8bb8\u591a\u4e2a\u7248\u672c JSAPI \u6df7\u7528");else {f=[];if(a.plugins)for(e=0;e<a.plugins.length;e+=1) -1==d.AMap.plugins.indexOf(a.plugins[e])&&f.push(a.plugins[e]);if(f.length)window.AMap.plugin(f,function(){m(a).then(function(){h(window.AMap);})["catch"](c);});else m(a).then(function(){h(window.AMap);})["catch"](c);}else if(a.key&&a.key!==d.key)c("\u591a\u4e2a\u4e0d\u4e00\u81f4\u7684 key");else if(a.version&&a.version!==d.AMap.version)c("\u4e0d\u5141\u8bb8\u591a\u4e2a\u7248\u672c JSAPI \u6df7\u7528");
		else {var k=[];if(a.plugins)for(e=0;e<a.plugins.length;e+=1) -1==d.AMap.plugins.indexOf(a.plugins[e])&&k.push(a.plugins[e]);t(function(){if(k.length)window.AMap.plugin(k,function(){m(a).then(function(){h(window.AMap);})["catch"](c);});else m(a).then(function(){h(window.AMap);})["catch"](c);});}})},reset:function(){delete window.AMap;delete window.AMapUI;delete window.Loca;d={key:"",AMap:{version:"1.4.15",plugins:[]},AMapUI:{version:"1.1",plugins:[]},Loca:{version:"1.3.2"}};g={AMap:b.notload,AMapUI:b.notload,
		Loca:b.notload};n={AMap:[],AMapUI:[],Loca:[]};}}}); 
	} (dist$1));
	return dist$1.exports;
}

var distExports = requireDist();
var AMapLoader = /*@__PURE__*/getDefaultExportFromCjs(distExports);

class BaseMapProvider {
    constructor() {
        this.markers = new Map();
        this.markerClusters = new Map();
        this.polylines = [];
        this.polygons = new Map();
        this.pathPlannings = [];
        this.infoWindows = [];
        this.animations = new Map();
    }
    generateId(type) {
        return `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }
    addMarkerToCollection(marker) {
        this.markers.set(marker.id, marker);
    }
    removeMarkerFromCollection(markerId) {
        this.markers.delete(markerId);
    }
    addClusterToCollection(cluster) {
        this.markerClusters.set(cluster.id, cluster);
    }
    removeClusterFromCollection(clusterId) {
        this.markerClusters.delete(clusterId);
    }
    addPolylinesToCollection(polyline) {
        this.polylines.push(polyline);
    }
    removePolylineFromCollection(polyline) {
        const index = this.polylines.indexOf(polyline);
        if (index > -1) {
            this.polylines.splice(index, 1);
        }
    }
    addPathPlanningToCollection(pathPlanning) {
        this.pathPlannings.push(pathPlanning);
    }
    removePathPlanningFromCollection(pathPlanning) {
        const index = this.pathPlannings.indexOf(pathPlanning);
        if (index > -1) {
            this.pathPlannings.splice(index, 1);
        }
    }
    addInfoWindowToCollection(infoWindow) {
        this.infoWindows.push(infoWindow);
    }
    removeInfoWindowFromCollection(infoWindow) {
        const index = this.infoWindows.indexOf(infoWindow);
        if (index > -1) {
            this.infoWindows.splice(index, 1);
        }
    }
    addAnimationToCollection(animation) {
        this.animations.set(animation.id, animation);
    }
    removeAnimationFromCollection(animationId) {
        this.animations.delete(animationId);
    }
    getMarkers() {
        return Array.from(this.markers.values());
    }
    getMarkerClusters() {
        return Array.from(this.markerClusters.values());
    }
    getAnimations() {
        return Array.from(this.animations.values());
    }
    getPolylines() {
        return [...this.polylines];
    }
    getPathPlannings() {
        return [...this.pathPlannings];
    }
    getInfoWindows() {
        return [...this.infoWindows];
    }
    clearAllMarkers() {
        this.markers.forEach((marker) => marker.remove());
        this.markers.clear();
    }
    clearAllMarkerClusters() {
        this.markerClusters.forEach((cluster) => cluster.remove());
        this.markerClusters.clear();
    }
    clearAllPolylines() {
        this.polylines.forEach((polyline) => {
            if (polyline && typeof polyline.setMap === "function") {
                polyline.setMap(null);
            }
        });
        this.polylines.length = 0;
    }
    clearAllPathPlannings() {
        this.pathPlannings.forEach((planning) => {
            if (planning?.remove) {
                planning.remove();
            }
        });
        this.pathPlannings.length = 0;
    }
    clearAllInfoWindows() {
        this.infoWindows.forEach((infoWindow) => {
            if (infoWindow && typeof infoWindow.remove === "function") {
                infoWindow.remove();
            }
        });
        this.infoWindows.length = 0;
    }
    clearAllAnimations() {
        this.animations.forEach((animation) => animation.remove());
        this.animations.clear();
    }
    addPolygonToCollection(polygon) {
        this.polygons.set(polygon.id, polygon);
    }
    removePolygonFromCollection(polygonId) {
        this.polygons.delete(polygonId);
    }
    getPolygons() {
        return Array.from(this.polygons.values());
    }
    clearAllPolygons() {
        this.polygons.forEach((polygon) => polygon.remove());
        this.polygons.clear();
    }
}

/**
 * DOM操作相关的工具函数
 */
// 错误类定义
class DOMError extends Error {
    constructor(message) {
        super(message);
        this.name = "DOMError";
    }
}
/**
 * 将HTML字符串转换为DOM节点（现代浏览器首选）
 * @param htmlString HTML字符串
 * @returns 解析后的DOM节点
 */
function safeStringToDOM(htmlString) {
    try {
        const template = document.createElement("template");
        template.innerHTML = htmlString.trim();
        return template.content.firstChild;
    }
    catch (error) {
        throw new DOMError(`Failed to parse HTML string: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
/**
 * 将HTML字符串转换为DOM节点（兼容旧浏览器）
 * @param htmlString HTML字符串
 * @returns 解析后的DOM节点
 */
function legacyStringToDOM(htmlString) {
    try {
        const div = document.createElement("div");
        div.innerHTML = htmlString;
        return div.firstChild;
    }
    catch (error) {
        throw new DOMError(`Failed to parse HTML string with legacy method: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
/**
 * 创建DOM节点内容
 * @param htmlString HTML字符串
 * @returns 解析后的DOM节点
 */
function createDomContentFromString(htmlString) {
    if (!htmlString || typeof htmlString !== "string") {
        throw new DOMError("HTML string is required and must be a non-empty string");
    }
    // 检测浏览器是否支持template元素的content特性
    const isTemplateSupported = "content" in document.createElement("template");
    const domNode = isTemplateSupported ? safeStringToDOM(htmlString) : legacyStringToDOM(htmlString);
    if (!(domNode instanceof HTMLElement)) {
        throw new DOMError("无法从字符串创建有效的DOM元素");
    }
    return domNode;
}
/**
 * 检查是否在浏览器环境中
 */
function isBrowser() {
    return typeof window !== "undefined" && typeof document !== "undefined";
}
/**
 * 验证输入是否为有效的HTMLElement
 */
function isValidHTMLElement(input) {
    return isBrowser() && input instanceof HTMLElement;
}
/**
 * 将输入内容转换为DOM元素
 * @param input 输入内容（DOM元素、HTML字符串或其他类型）
 * @returns HTMLElement 转换后的DOM元素
 */
function createDomContent(input) {
    // 1. 如果已经是DOM元素，直接返回
    if (isValidHTMLElement(input)) {
        return input;
    }
    // 2. 如果是字符串，调用createDomContentFromString转换
    if (typeof input === "string") {
        try {
            return createDomContentFromString(input);
        }
        catch (error) {
            console.warn("字符串转换为DOM失败，使用默认空div", error);
        }
    }
    // 3. 其他情况返回空div
    if (!isBrowser()) {
        throw new DOMError("DOM operations are not available in this environment");
    }
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "empty";
    emptyDiv.setAttribute("data-fallback", "true");
    return emptyDiv;
}
/**
 * 安全地设置元素的innerHTML
 * @param element 目标元素
 * @param content HTML内容
 */
function safeSetInnerHTML(element, content) {
    if (!isValidHTMLElement(element)) {
        throw new DOMError("Invalid HTMLElement provided");
    }
    if (typeof content !== "string") {
        throw new DOMError("Content must be a string");
    }
    try {
        element.innerHTML = content;
    }
    catch (error) {
        throw new DOMError(`Failed to set innerHTML: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
/**
 * 安全地克隆DOM元素
 * @param element 要克隆的元素
 * @param deep 是否深度克隆
 * @returns 克隆的元素
 */
function safeCloneElement(element, deep = true) {
    if (!isValidHTMLElement(element)) {
        throw new DOMError("Invalid HTMLElement provided for cloning");
    }
    try {
        const cloned = element.cloneNode(deep);
        return cloned;
    }
    catch (error) {
        throw new DOMError(`Failed to clone element: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

class AMapProvider extends BaseMapProvider {
    /**
     * 动态加载高德地图SDK
     * @param apiKey 高德地图API密钥
     */
    async loadAMapSDK(config) {
        return new Promise(async (resolve, reject) => {
            // 检查是否已经加载
            if (window.AMap) {
                resolve();
                return;
            }
            const defaultLoadOptions = {
                version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                AMapUI: {
                    version: "1.1",
                    plugins: [],
                },
            };
            const mergedOptions = {
                ...defaultLoadOptions,
                ...config,
            };
            const newWindow = window;
            newWindow._AMapSecurityConfig = {
                securityJsCode: mergedOptions.token,
            };
            await AMapLoader.load({
                key: mergedOptions.key,
                plugins: mergedOptions.plugins,
                version: mergedOptions.version,
                AMapUI: mergedOptions.AMapUI,
            });
            resolve();
        });
    }
    async init(config) {
        this.config = config;
        // 动态加载高德地图SDK
        if (typeof window !== "undefined" && !this.AMap) {
            try {
                // 检查是否已经加载了高德地图SDK
                if (!window.AMap) {
                    // 动态加载高德地图SDK
                    await this.loadAMapSDK(config);
                }
                this.AMap = window.AMap;
            }
            catch (error) {
                throw new Error(`Failed to load AMap SDK: ${error}`);
            }
        }
        const defaultOptions = {
            zoom: 11,
            center: [116.397428, 39.90923],
            viewMode: "2D",
            mapStyle: "amap://styles/whitesmoke",
        };
        const mergedOptions = {
            ...defaultOptions,
            ...config,
        };
        const container = typeof mergedOptions.container === "string" ? document.getElementById(mergedOptions.container) : mergedOptions.container;
        if (!container) {
            throw new Error("Container element not found");
        }
        this.map = new this.AMap.Map(container, {
            center: mergedOptions.center,
            zoom: mergedOptions.zoom,
            viewMode: mergedOptions.viewMode,
            mapStyle: mergedOptions.mapStyle,
        });
    }
    async addMarker(config) {
        if (!this.map) {
            throw new Error("Map not initialized");
        }
        const markerId = this.generateId(COVERING_TYPES.MARKER);
        const defaultOptions = {
            position: [],
            content: "",
            clickable: true,
            data: {},
        };
        const mergedOptions = {
            ...defaultOptions,
            ...config,
        };
        const content = createDomContent(mergedOptions.content || "");
        const { position } = mergedOptions;
        const markerOptions = {
            position: {
                lat: position[1],
                lng: position[0],
            },
            content,
        };
        if (mergedOptions.map) {
            markerOptions.map = this.map;
        }
        const amapMarker = new this.AMap.Marker({
            ...markerOptions,
        });
        const marker = {
            id: markerId,
            position: [...mergedOptions.position],
            amapMarker,
            data: mergedOptions.data,
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
            },
        };
        if (typeof mergedOptions.onClick === "function") {
            amapMarker.on("click", (e) => {
                mergedOptions.onClick({ event: e, content, data: mergedOptions.data, position, marker });
            });
        }
        this.addMarkerToCollection(marker);
        return marker;
    }
    async addMarkerCluster(points, options) {
        if (!this.map) {
            throw new Error("Map not initialized");
        }
        const clusterId = this.generateId(COVERING_TYPES.CLUSTER);
        const defaultOptions = {
            gridSize: 60,
            maxZoom: 18,
            renderClusterMarker: '<div style="background-color: #ff6b6b; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold;">{count}</div>',
            renderMarker: {
                position: [0, 0], // 占位符，实际位置会从 point 中获取
                icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            },
            ...options,
        };
        // 创建标记点数组
        const markers = [];
        points.forEach((point) => {
            const { position: _, ...renderMarkerConfig } = defaultOptions.renderMarker;
            const { position: pointPosition, ...pointConfig } = point;
            const marker = new this.AMap.Marker({
                position: pointPosition,
                ...renderMarkerConfig,
                ...pointConfig,
            });
            markers.push(marker);
        });
        // 创建聚合插件
        const cluster = new this.AMap.MarkerCluster(this.map, markers, {
            gridSize: defaultOptions.gridSize,
            maxZoom: defaultOptions.maxZoom,
            renderClusterMarker: (context) => {
                const count = context.count;
                const div = document.createElement("div");
                div.innerHTML = defaultOptions.renderClusterMarker.replace("{count}", count.toString());
                return div.firstChild;
            },
        });
        const markerCluster = {
            id: clusterId,
            points: [...points],
            amapCluster: cluster,
            amapMarkers: markers,
            addPoint: (point) => {
                const { position: _, ...renderMarkerConfig } = defaultOptions.renderMarker;
                const { position: pointPosition, ...pointConfig } = point;
                const marker = new this.AMap.Marker({
                    position: pointPosition,
                    ...renderMarkerConfig,
                    ...pointConfig,
                });
                markers.push(marker);
                markerCluster.points.push(point);
                cluster.addMarker(marker);
            },
            removePoint: (point) => {
                const index = markerCluster.points.findIndex((p) => p.position[0] === point.position[0] && p.position[1] === point.position[1]);
                if (index !== -1) {
                    const marker = markers[index];
                    cluster.removeMarker(marker);
                    markers.splice(index, 1);
                    markerCluster.points.splice(index, 1);
                }
            },
            // clear: () => {
            //   markers.forEach((marker) => cluster.removeMarker(marker));
            //   markers.length = 0;
            //   markerCluster.points.length = 0;
            // },
            remove: () => {
                cluster.setMap(null);
                markers.forEach((marker) => cluster.removeMarker(marker));
                markers.length = 0;
                markerCluster.points.length = 0;
                this.removeClusterFromCollection(clusterId);
            },
        };
        this.addClusterToCollection(markerCluster);
        return markerCluster;
    }
    removeMarker(marker) {
        const amapMarker = marker.amapMarker;
        if (amapMarker) {
            this.map.remove(amapMarker);
            this.removeMarkerFromCollection(marker.id);
        }
    }
    removeMarkerCluster(cluster) {
        const amapCluster = cluster.amapCluster;
        if (amapCluster) {
            amapCluster.setMap(null);
            this.removeClusterFromCollection(cluster.id);
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
    setZoomAndCenter(zoom, center) {
        if (this.map) {
            this.map.setZoomAndCenter(zoom, center);
        }
    }
    async addInfoWindow(options) {
        if (!this.map) {
            throw new Error("Map not initialized");
        }
        const infoWindow = new window.AMap.InfoWindow({
            content: options.content,
            position: options.position,
            isCustom: true,
            autoMove: true,
            closeWhenClickMap: true,
        });
        if (options.open !== false) {
            infoWindow.open(this.map, options.position);
        }
        this.addInfoWindowToCollection(infoWindow);
        return infoWindow;
    }
    destroy() {
        if (this.map) {
            this.map.destroy();
            this.map = null;
        }
        this.clearMarkers();
        this.clearMarkerClusters();
    }
    getZoom() {
        if (this.map) {
            return this.map.getZoom();
        }
        return 11;
    }
    clearMarkers(params) {
        if (!this.map)
            return;
        const typeToClear = params?.type;
        const explicitMarkers = params?.markers || [];
        if (!typeToClear && explicitMarkers.length === 0) {
            this.clearAllMarkers();
            return;
        }
        if (typeToClear) {
            this.getMarkers().forEach((marker) => {
                if (marker?.type === typeToClear) {
                    marker.remove();
                }
            });
        }
        explicitMarkers.forEach((marker) => {
            marker.remove();
        });
    }
    clearMarkerClusters(params) {
        if (!this.map)
            return;
        const typeToClear = params?.type;
        const explicitClusters = params?.clusters || [];
        if (!typeToClear && explicitClusters.length === 0) {
            this.clearAllMarkerClusters();
            return;
        }
        if (typeToClear) {
            this.getMarkerClusters().forEach((cluster) => {
                if (cluster?.type === typeToClear) {
                    cluster.remove();
                }
            });
        }
        explicitClusters.forEach((cluster) => {
            cluster.remove();
        });
    }
    clearPolylines(params) {
        if (!this.map)
            return;
        const typeToClear = params?.type;
        const explicitPolylines = params?.polylines || [];
        if (!typeToClear && explicitPolylines.length === 0) {
            this.clearAllPolylines();
            return;
        }
        if (typeToClear) {
            this.polylines.forEach((polyline) => {
                if (polyline?.type === typeToClear) {
                    if (polyline.setMap) {
                        polyline.setMap(null);
                    }
                    this.removePolylineFromCollection(polyline);
                }
            });
        }
        explicitPolylines.forEach((polyline) => {
            if (polyline.setMap) {
                polyline.setMap(null);
            }
            this.removePolylineFromCollection(polyline);
        });
    }
    async addPolygon(config) {
        if (!this.map) {
            throw new Error("Map not initialized");
        }
        const polygonId = this.generateId(COVERING_TYPES.POLYGON);
        const defaultOptions = {
            id: polygonId,
            path: [],
            strokeColor: "#FF0000",
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.3,
            clickable: true,
            draggable: false,
            editable: false,
            zIndex: 1,
        };
        const mergedOptions = { ...defaultOptions, ...config };
        const polygon = new this.AMap.Polygon({
            path: mergedOptions.path.map((p) => [...p]),
            strokeColor: mergedOptions.strokeColor,
            strokeOpacity: mergedOptions.strokeOpacity,
            strokeWeight: mergedOptions.strokeWeight,
            fillColor: mergedOptions.fillColor,
            fillOpacity: mergedOptions.fillOpacity,
            clickable: mergedOptions.clickable,
            draggable: mergedOptions.draggable,
            editable: mergedOptions.editable,
            zIndex: mergedOptions.zIndex,
        });
        this.map.add(polygon);
        const amapPolygon = {
            id: polygonId,
            path: mergedOptions.path.map((point) => [...point]),
            googlePolygon: polygon,
            setPath: (path) => {
                polygon.setPath(path);
                amapPolygon.path = path;
            },
            setOptions: (options) => {
                polygon.setOptions(options);
            },
            setEditable: (editable) => {
                polygon.setOptions({ editable });
            },
            setDraggable: (draggable) => {
                polygon.setOptions({ draggable });
            },
            getBounds: () => {
                return polygon.getBounds();
            },
            contains: (point) => {
                return polygon.contains(point);
            },
            getArea: () => {
                return polygon.getArea();
            },
            show: () => {
                polygon.show();
            },
            hide: () => {
                polygon.hide();
            },
            remove: () => {
                this.map.remove(polygon);
                this.removePolygonFromCollection(polygonId);
            },
            // clear: () => {
            //   this.map.remove(polygon);
            //   this.removePolygonFromCollection(polygonId);
            // },
        };
        this.addPolygonToCollection(amapPolygon);
        return amapPolygon;
    }
    clearPolygons(params) {
        if (!this.map)
            return;
        const typeToClear = params?.type;
        const explicitPolygons = params?.polygons || [];
        if (!typeToClear && explicitPolygons.length === 0) {
            this.clearAllPolygons();
            return;
        }
        if (typeToClear) {
            this.getPolygons().forEach((polygon) => {
                if (polygon?.type === typeToClear) {
                    polygon.remove();
                }
            });
        }
        explicitPolygons.forEach((polygon) => {
            polygon.remove();
        });
    }
    clearPathPlannings(params) {
        if (!this.map)
            return;
        const typeToClear = params?.type;
        const explicitPathPlannings = params?.pathPlannings || [];
        if (!typeToClear && explicitPathPlannings.length === 0) {
            this.clearAllPathPlannings();
            return;
        }
        if (typeToClear) {
            this.getPathPlannings().forEach((planning) => {
                if (planning?.type === typeToClear) {
                    if (planning?.remove) {
                        planning.remove();
                    }
                }
            });
        }
        explicitPathPlannings.forEach((planning) => {
            if (planning?.remove) {
                planning.remove();
            }
            this.removePathPlanningFromCollection(planning);
        });
    }
    clearInfoWindow(params) {
        if (!this.map)
            return;
        const typeToClear = params?.type;
        const explicitInfoWindows = params?.infoWindows || [];
        if (!typeToClear && explicitInfoWindows.length === 0) {
            this.clearAllInfoWindows();
            return;
        }
        if (typeToClear) {
            this.getInfoWindows().forEach((infoWindow) => {
                if (infoWindow?.type === typeToClear) {
                    if (infoWindow?.remove) {
                        infoWindow.remove();
                    }
                }
            });
        }
        explicitInfoWindows.forEach((infoWindow) => {
            if (infoWindow?.remove) {
                infoWindow.remove();
            }
            this.removeInfoWindowFromCollection(infoWindow);
        });
    }
    async clearMap() {
        if (!this.map)
            return;
        this.map.clearMap();
    }
    async addAnimation(config) {
        const animationId = this.generateId(COVERING_TYPES.ANIMATION);
        const animation = {
            id: animationId,
            start: () => {
                console.warn("AMap does not support trajectory animation");
            },
            pause: () => {
                console.warn("AMap does not support trajectory animation");
            },
            resume: () => {
                console.warn("AMap does not support trajectory animation");
            },
            stop: () => {
                console.warn("AMap does not support trajectory animation");
            },
            next: () => {
                console.warn("AMap does not support trajectory animation");
            },
            previous: () => {
                console.warn("AMap does not support trajectory animation");
            },
            seek: (progress) => {
                console.warn("AMap does not support trajectory animation");
            },
            setSpeed: (speed) => {
                console.warn("AMap does not support trajectory animation");
            },
            getCurrentPosition: () => {
                return [0, 0];
            },
            getProgress: () => {
                return 0;
            },
            getStatus: () => {
                return "idle";
            },
            remove: () => {
                this.removeAnimationFromCollection(animationId);
            },
            // clear: () => {
            //   this.removeAnimationFromCollection(animationId);
            // },
        };
        this.addAnimationToCollection(animation);
        return animation;
    }
    clearAnimations(params) {
        const typeToClear = params?.type;
        const explicitAnimations = params?.animations || [];
        if (!typeToClear && explicitAnimations.length === 0) {
            this.clearAllAnimations();
            return;
        }
        if (typeToClear) {
            this.getAnimations().forEach((animation) => {
                if (animation?.type === typeToClear) {
                    animation.remove();
                }
            });
        }
        explicitAnimations.forEach((animation) => {
            animation.remove();
        });
    }
}

class GoogleMapProvider extends BaseMapProvider {
    /**
     * 动态加载Google Maps SDK
     * @param key Google Maps API密钥
     */
    async loadGoogleMapsSDK(key) {
        return new Promise(async (resolve) => {
            // 检查是否已经加载
            if (window.google && window.google.maps) {
                resolve();
                return;
            }
            const loader = new jsApiLoader.Loader({
                apiKey: key || "",
                version: "weekly",
            });
            await loader.load();
            resolve();
        });
    }
    async init(config) {
        this.config = config;
        // 动态加载Google Maps SDK
        if (typeof window !== "undefined" && !this.google) {
            try {
                // 检查是否已经加载了Google Maps SDK
                if (!window.google || !window.google.maps) {
                    await this.loadGoogleMapsSDK(config.key);
                }
                this.google = window.google;
            }
            catch (error) {
                throw new Error(`Failed to load Google Maps SDK: ${error}`);
            }
        }
        const defaultOptions = {
            zoom: 11,
            center: [116.397428, 39.90923],
        };
        const mergedOptions = {
            ...defaultOptions,
            ...config,
        };
        const container = typeof mergedOptions.container === "string" ? document.getElementById(mergedOptions.container) : mergedOptions.container;
        if (!container) {
            throw new Error("Container element not found");
        }
        const { Map } = await this.google.maps.importLibrary("maps");
        this.map = new Map(container, {
            center: {
                lat: Number(mergedOptions.center?.[1]),
                lng: Number(mergedOptions.center?.[0]),
            },
            zoom: mergedOptions.zoom,
            mapId: mergedOptions.container,
        });
    }
    setCenter(position) {
        if (this.map) {
            this.map.setCenter({
                lat: position[1],
                lng: position[0],
            });
        }
    }
    setZoom(zoom) {
        if (this.map) {
            this.map.setZoom(zoom);
        }
    }
    getZoom() {
        if (this.map) {
            return this.map.getZoom();
        }
    }
    setZoomAndCenter(zoom, center) {
        if (this.map) {
            this.map.setZoom(zoom);
            this.map.setCenter({
                lat: center[1],
                lng: center[0],
            });
        }
    }
    destroy() {
        if (this.map) {
            // Google Maps doesn't have a destroy method
            // Just clear the map reference
            this.map = null;
        }
    }
    async addMarker(config, type) {
        if (!this.map) {
            throw new Error("Map not initialized");
        }
        const markerId = this.generateId(COVERING_TYPES.MARKER);
        const defaultOptions = {
            map: true,
            id: markerId,
            clickable: true,
            draggable: false,
            // icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        };
        const mergedOptions = {
            ...defaultOptions,
            ...config,
        };
        const { AdvancedMarkerElement } = await this.google.maps.importLibrary("marker");
        const content = createDomContent(mergedOptions.content || "");
        const { position } = mergedOptions;
        const markerOptions = {
            position: {
                lat: position[1],
                lng: position[0],
            },
            content,
        };
        if (mergedOptions.map) {
            markerOptions.map = this.map;
        }
        const googleMarker = new AdvancedMarkerElement({
            ...markerOptions,
        });
        googleMarker.addListener("click", ({ domEvent, latLng }) => {
            if (typeof mergedOptions.onClick !== "function")
                return;
            const data = mergedOptions.data;
            const position = [latLng.lng(), latLng.lat()];
            mergedOptions.onClick({ event: domEvent, content, data, position, marker });
        });
        content.addEventListener("mouseover", (event) => {
            if (typeof mergedOptions.onMouseover !== "function")
                return;
            const data = mergedOptions.data;
            mergedOptions.onMouseover({ event, content, data });
        });
        content.addEventListener("mouseout", (event) => {
            if (typeof mergedOptions.onMouseout !== "function")
                return;
            const data = mergedOptions.data;
            mergedOptions.onMouseout({ event, content, data });
        });
        const marker = {
            id: markerId,
            position: [...mergedOptions.position],
            googleMarker,
            data: mergedOptions.data,
            setPosition: (position) => {
                googleMarker.setPosition({
                    lat: position[1],
                    lng: position[0],
                });
                marker.position = position;
            },
            setTitle: (title) => {
                googleMarker.setTitle(title);
            },
            setContent: (content) => {
                // Google Maps markers don't have a direct setContent method
                // You might want to use InfoWindow instead
                console.warn("setContent is not supported for Google Maps markers");
            },
            remove: () => {
                googleMarker.setMap(null);
                this.removeMarkerFromCollection(markerId);
            },
            // clear: () => {
            //   googleMarker.setMap(null);
            //   this.removeMarkerFromCollection(markerId);
            // },
        };
        if (type !== COVERING_TYPES.CLUSTER) {
            this.addMarkerToCollection(marker);
        }
        return marker;
    }
    async addMarkerCluster(points, options) {
        if (!this.map) {
            throw new Error("Map not initialized");
        }
        const clusterId = this.generateId(COVERING_TYPES.CLUSTER);
        const defaultOptions = {
            id: clusterId,
            data: {},
            gridSize: 60,
            maxZoom: 18,
            renderClusterMarker: '<div class="testtt" style="background-color: #ff6b6b; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold;">{count}</div>',
            renderMarker: (index) => ({
                position: [0, 0], // 占位符，实际位置会从 point 中获取
                // icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                content: `index: ${index}`,
            }),
        };
        const mergedOptions = {
            ...defaultOptions,
            ...options,
        };
        // 创建标记点数组（等待全部创建完成再进行聚合）
        const markerPromises = points.map(async (point, index) => {
            // const { position: _, ...renderMarkerConfig } = defaultOptions.renderMarker!
            // let { position: pointPosition, ...pointConfig } = point;
            let { position: pointPosition } = point;
            if (!pointPosition) {
                pointPosition = points[index].position;
            }
            // pointPosition = [locations[index].lng, locations[index].lat] // testtt
            const markerOptions = mergedOptions.renderMarker(index);
            const marker = await this.addMarker({
                map: true,
                position: [Number(pointPosition[0]), Number(pointPosition[1])],
                content: markerOptions.content,
                onClick: markerOptions.onClick,
                data: markerOptions.data,
            }, COVERING_TYPES.CLUSTER);
            return marker.googleMarker;
        });
        const markers = await Promise.all(markerPromises);
        this.getZoom();
        // const { MarkerClusterer } = await this.google.maps.importLibrary("marker") as any;
        const googleMarkerClusterer = new markerclusterer.MarkerClusterer({
            markers: markers,
            map: this.map,
            // renderer: {
            //   // render: ({ count, position }: any) => {
            //   //   console.log(`%c count::: `, 'color: pink;', count)
            //   //   const div = document.createElement("div");
            //   //   div.innerHTML = mergedOptions.renderClusterMarker!.replace("{count}", count.toString());
            //   //   const element = div.firstChild as HTMLElement;
            //   //   element.style.position = "absolute";
            //   //   element.style.transform = "translate(-50%, -50%)";
            //   //   return element;
            //   // },
            //   render: ({ count, position }) => createCustomClusterIcon(count)
            // },
            // 其他配置选项
            algorithmOptions: {
                // maxZoom: mergedOptions.maxZoom // 最大聚合缩放级别
                maxZoom: 18, // 最大聚合缩放级别
                // minPoints: 2,       // 最少2个点才聚合
                // gridSize: 6000        // 聚合网格大小
            },
            // algorithm: {
            //   calculate: (__namedParameters: AlgorithmInput) => {
            //     const clusters: Cluster[] = [];
            //     const zoom = this.map.getZoom();
            //     markers.forEach(marker => {
            //       const position = marker.getPosition();
            //       let addedToCluster = false;
            //       for (const cluster of clusters) {
            //         const clusterCenter = cluster.position;
            //         const distance = this.google.maps.geometry.spherical.computeDistanceBetween(
            //           position, clusterCenter
            //         );
            //         // if (distance <= this.maxDistance) {
            //         if (distance <= 1000) {
            //           cluster.markers.push(marker);
            //           addedToCluster = true;
            //           break;
            //         }
            //       }
            //       if (!addedToCluster) {
            //         clusters.push({ markers: [marker], position });
            //       }
            //     });
            //     return clusters;
            //   }
            // }
        });
        const id = mergedOptions.id;
        const markerCluster = {
            id,
            googleMarkerClusterer,
            data: mergedOptions.data,
            points: points,
            addPoint: (point) => {
                // 实现添加点的逻辑
            },
            removePoint: (point) => {
                // 实现移除点的逻辑
            },
            remove: () => {
                googleMarkerClusterer.clearMarkers();
                this.removeClusterFromCollection(id);
            },
            // clear: () => {
            //   googleMarkerClusterer.clearMarkers();
            //   this.removeClusterFromCollection(id);
            // },
        };
        this.addClusterToCollection(markerCluster);
        return markerCluster;
    }
    /**
     * 按条件清除标记点
     * - 传入 markers：清除这些标记
     * - 传入 type：清除当前已收集到的、匹配该 type 的标记
     * 两者同时存在时，两类都会被清除
     */
    clearMarkers(params) {
        if (!this.map)
            return;
        const typeToClear = params?.type;
        const explicitMarkers = params?.markers || [];
        // 1) 如果没有传入任何参数，清除所有聚合（内部私有方法）
        if (!typeToClear && explicitMarkers.length === 0) {
            this.clearAllMarkers();
            return;
        }
        // 2) 基于类型清除（从内部收集的 markers Map 里找）
        if (typeToClear) {
            this.getMarkers().forEach((m) => {
                if (m?.type === typeToClear) {
                    const googleMarker = m.googleMarker || m;
                    if (googleMarker && typeof googleMarker.setMap === "function") {
                        googleMarker.setMap(null);
                    }
                    if (m?.id) {
                        this.removeMarkerFromCollection(m.id);
                    }
                    if (typeof m.remove === "function") {
                        m.remove();
                    }
                }
            });
        }
        // 3) 清除外部显式传入的 markers
        explicitMarkers.forEach((m) => {
            const googleMarker = m.googleMarker || m;
            if (googleMarker && typeof googleMarker.setMap === "function") {
                googleMarker.setMap(null);
            }
            if (m?.id) {
                this.removeMarkerFromCollection(m.id);
            }
            if (typeof m.remove === "function") {
                m.remove();
            }
        });
    }
    /**
     * 按条件清除标记点聚合
     * - 传入 clusters：清除这些聚合
     * - 传入 type：清除当前已收集到的、匹配该 type 的聚合
     * 两者同时存在时，两类都会被清除
     * 如果没有参数，则清除所有聚合
     */
    clearMarkerClusters(params) {
        if (!this.map)
            return;
        const typeToClear = params?.type;
        const explicitClusters = params?.clusters || [];
        // 1) 如果没有传入任何参数，清除所有聚合（内部私有方法）
        if (!typeToClear && explicitClusters.length === 0) {
            this.clearAllMarkerClusters();
            return;
        }
        // 2) 基于类型清除（从内部收集的 markerClusters Map 里找）
        if (typeToClear) {
            this.getMarkerClusters().forEach((c) => {
                if (c?.type === typeToClear) {
                    const markerClusterer = c.googleMarkerClusterer || c;
                    if (markerClusterer && typeof markerClusterer.clearMarkers === "function") {
                        markerClusterer.clearMarkers();
                    }
                    if (c?.id) {
                        this.removeClusterFromCollection(c.id);
                    }
                    if (typeof c.remove === "function") {
                        c.remove();
                    }
                }
            });
        }
        // 3) 清除外部显式传入的 clusters
        explicitClusters.forEach((c) => {
            const markerClusterer = c.googleMarkerClusterer || c;
            if (markerClusterer && typeof markerClusterer.clearMarkers === "function") {
                markerClusterer.clearMarkers();
            }
            if (c?.id) {
                this.removeClusterFromCollection(c.id);
            }
            if (typeof c.remove === "function") {
                c.remove();
            }
        });
    }
    // ============================ 信息窗体 =============================
    /**
     * 添加信息窗体（InfoWindow）
     * @param options { content, position: [lng, lat], open? }
     */
    async addInfoWindow(options) {
        if (!this.map || !this.google) {
            throw new Error("Map not initialized");
        }
        const defaultOptions = { open: false };
        const mergedOptions = { ...defaultOptions, ...options };
        const { InfoWindow } = await this.google.maps.importLibrary("maps");
        const googleInfoWindow = new InfoWindow({
            content: createDomContent(mergedOptions.content),
            position: { lat: mergedOptions.position[1], lng: mergedOptions.position[0] },
            headerDisabled: true,
        });
        if (mergedOptions.open) {
            googleInfoWindow.open({ map: this.map });
        }
        const infoWindow = {
            googleInfoWindow,
            open: () => {
                googleInfoWindow.setPosition({ lat: mergedOptions.position[1], lng: mergedOptions.position[0] });
                googleInfoWindow.open(this.map);
            },
            close: () => {
                googleInfoWindow.close();
            },
            remove: () => {
                googleInfoWindow.close();
            },
        };
        this.addInfoWindowToCollection(infoWindow);
        return infoWindow;
    }
    clearInfoWindow(params) {
        if (!this.map)
            return;
        const typeToClear = params?.type;
        const explicitInfoWindows = params?.infoWindows || [];
        // 如果没有传入任何参数，清除所有信息窗体
        if (!typeToClear && explicitInfoWindows.length === 0) {
            this.getInfoWindows().forEach((infoWindow) => {
                if (infoWindow?.remove) {
                    infoWindow.remove();
                }
            });
            this.infoWindows = [];
            return;
        }
        // 1) 清除外部显式传入的 infoWindows
        explicitInfoWindows.forEach((infoWindow) => {
            if (infoWindow?.remove) {
                infoWindow.remove();
            }
            this.removeInfoWindowFromCollection(infoWindow);
        });
        // 2) 基于类型清除（从内部收集的 infoWindows 数组里找）
        if (typeToClear) {
            this.getInfoWindows().forEach((infoWindow) => {
                if (infoWindow?.type === typeToClear) {
                    if (infoWindow?.remove) {
                        infoWindow.remove();
                    }
                    this.removeInfoWindowFromCollection(infoWindow);
                }
            });
        }
    }
    // ============================ 折线 =============================
    /**
     * 绘制折线（Polyline）
     */
    async addPolyline(options) {
        if (!this.map || !this.google) {
            throw new Error("Map not initialized");
        }
        const { Polyline } = await this.google.maps.importLibrary("maps");
        const polylineId = this.generateId(COVERING_TYPES.POLYLINE);
        const defaultOptions = {
            id: polylineId,
            color: "#f00",
            opacity: 0.8,
            width: 3,
        };
        // 合并顺序：默认样式 <- options.css(如果有) <- 直接传入的顶层样式与其他字段
        // const mergedOptions = merge({}, defaultOptions, options?.css || {}, options) as {
        //   path: [number, number][]
        //   color: string
        //   opacity: number
        //   width: number
        //   css?: unknown
        // }
        const mergedOptions = {
            ...defaultOptions,
            ...options,
        };
        const id = mergedOptions.id;
        const polyline = new Polyline({
            id,
            map: this.map,
            path: mergedOptions.path.map(([lng, lat]) => ({ lat, lng })),
            strokeColor: mergedOptions.color,
            strokeOpacity: mergedOptions.opacity,
            strokeWeight: mergedOptions.width,
        });
        this.addPolylinesToCollection(polyline);
        return polyline;
    }
    clearPolylines(params) {
        if (!this.map)
            return;
        const typeToClear = params?.type;
        const explicitPolylines = params?.polylines || [];
        // 1)如果没有传入任何参数，清除所有折线
        if (!typeToClear && explicitPolylines.length === 0) {
            this.clearAllPolylines();
            return;
        }
        // 2) 基于类型清除（从内部收集的 polylines 数组里找）
        if (typeToClear) {
            this.getPolylines().forEach((polyline) => {
                if (polyline?.type === typeToClear) {
                    if (typeof polyline.setMap === "function") {
                        polyline.setMap(null);
                    }
                    this.removePolylineFromCollection(polyline);
                }
            });
        }
        // 3) 清除外部显式传入的 polylines
        explicitPolylines.forEach((polyline) => {
            if (typeof polyline.setMap === "function") {
                polyline.setMap(null);
            }
            this.removePolylineFromCollection(polyline);
        });
    }
    // ============================ 轨迹规划 =============================
    /**
     * 计算路径规划：驾车
     * @param origin 起点坐标 [lng, lat]
     * @param destination 终点坐标 [lng, lat]
     * @param waypoints 途经点坐标数组 [lng, lat][]
     * @param options 其他选项
     * @returns 驾车路线结果
     */
    async addPathPlanning(options) {
        if (!this.map || !this.google) {
            throw new Error("Map not initialized");
        }
        try {
            const pathPlanningId = this.generateId(COVERING_TYPES.PATH_PLANNING);
            const defaultOptions = {
                id: pathPlanningId,
                start: [0, 0],
                end: [0, 0],
                points: [],
                suppressMarkers: false, // 显示起点和终点标记
                suppressInfoWindows: false, // 显示信息窗口
                draggable: true,
                travelMode: this.google.maps.TravelMode.DRIVING,
                optimizeWaypoints: false,
            };
            const mergedOptions = { ...defaultOptions, ...options };
            const origin = typeof mergedOptions.start === "string"
                ? { query: mergedOptions.start }
                : { lat: mergedOptions.start[1], lng: mergedOptions.start[0] };
            const destination = typeof mergedOptions.end === "string" ? { query: mergedOptions.end } : { lat: mergedOptions.end[1], lng: mergedOptions.end[0] };
            const { DirectionsService, DirectionsRenderer } = await this.google.maps.importLibrary("routes");
            const directionsService = new DirectionsService();
            const directionsRenderer = new DirectionsRenderer({
                map: this.map,
                // suppressMarkers: mergedOptions.suppressMarkers, // 显示起点和终点标记
                // suppressInfoWindows: mergedOptions.suppressInfoWindows, // 显示信息窗口
                draggable: mergedOptions.draggable, // 是否可拖动
            });
            // 构建 Google Directions API 请求参数
            const directionsRequest = {
                origin,
                destination,
                travelMode: mergedOptions.travelMode,
                optimizeWaypoints: mergedOptions.optimizeWaypoints,
            };
            // 计算路线
            const result = await new Promise((resolve, reject) => {
                directionsService.route(directionsRequest, (res, status) => {
                    if (status === this.google.maps.DirectionsStatus.OK) {
                        resolve(res);
                    }
                    else {
                        reject(new Error(`Directions request failed: ${status}`));
                    }
                });
            });
            // 渲染路线
            directionsRenderer.setDirections(result);
            directionsRenderer.addListener("directions_changed", () => {
                const directions = directionsRenderer.getDirections();
                if (directions) {
                    const paths = directions.routes[0].overview_path;
                    const points = paths.map((path) => [path.lng(), path.lat()]);
                    if (typeof mergedOptions.onChange === "function") {
                        mergedOptions.onChange(points);
                    }
                }
            });
            const id = mergedOptions.id;
            const planning = {
                id,
                result,
                directionsRenderer,
                clear: () => {
                    directionsRenderer.setDirections({ routes: [] });
                },
                remove: () => {
                    directionsRenderer.setMap(null);
                },
            };
            this.addPathPlanningToCollection(planning);
            return planning;
        }
        catch (error) {
            throw new Error(`Failed to calculate driving route: ${error}`);
        }
    }
    clearPathPlannings(params) {
        if (!this.map)
            return;
        const typeToClear = params?.type;
        const explicitPathPlannings = params?.pathPlannings || [];
        // 1)如果没有传入任何参数，清除所有路径规划
        if (!typeToClear && explicitPathPlannings.length === 0) {
            this.clearAllPathPlannings();
            return;
        }
        // 2) 基于类型清除（从内部收集的 pathPlannings 数组里找）
        if (typeToClear) {
            this.getPathPlannings().forEach((planning) => {
                if (planning?.type === typeToClear) {
                    if (planning?.remove) {
                        planning.remove();
                    }
                    this.removePathPlanningFromCollection(planning);
                }
            });
        }
        // 3) 清除外部显式传入的 pathPlannings
        explicitPathPlannings.forEach((planning) => {
            if (planning?.remove) {
                planning.remove();
            }
            this.removePathPlanningFromCollection(planning);
        });
    }
    // ============================ 地址 =============================
    /**
     * 通过经纬度获取详细地址信息
     * @param position 坐标 [lng, lat]
     * @returns 地址信息
     */
    async getAddress(position) {
        if (!this.map || !this.google) {
            throw new Error("Map not initialized");
        }
        try {
            // const geocoder = new this.google.maps.Geocoder()
            const { Geocoder } = await this.google.maps.importLibrary("geocoding");
            const geocoder = new Geocoder();
            const result = await new Promise((resolve, reject) => {
                geocoder.geocode({ location: { lat: position[1], lng: position[0] } }, (results, status) => {
                    if (status === this.google.maps.GeocoderStatus.OK) {
                        if (results && results.length > 0) {
                            resolve(results[0]);
                        }
                        else {
                            resolve("");
                        }
                    }
                    else {
                        reject(new Error(`Geocoding failed: ${status}`));
                    }
                });
            });
            // 解析地址组件
            const addressComponents = result.address_components;
            const formattedAddress = result.formatted_address;
            // 提取详细的地址信息
            const addressInfo = {
                formattedAddress,
                premise: "",
                streetNumber: "",
                route: "",
                district: "",
                city: "",
                province: "",
                country: "",
                postalCode: "",
                coordinates: position,
                detailedAddress: "",
            };
            // 遍历地址组件，提取详细信息
            addressComponents.forEach((component) => {
                const types = component.types;
                const longName = component.long_name;
                // const shortName = component.short_name
                if (types.includes("premise")) {
                    addressInfo.premise = longName;
                }
                else if (types.includes("street_number")) {
                    addressInfo.streetNumber = longName;
                }
                else if (types.includes("route")) {
                    addressInfo.route = longName;
                }
                else if (types.includes("sublocality")) {
                    // 区
                    addressInfo.district = longName;
                }
                else if (types.includes("locality")) {
                    // 市
                    addressInfo.city = longName;
                }
                else if (types.includes("administrative_area_level_1")) {
                    // 省
                    addressInfo.province = longName;
                }
                else if (types.includes("country")) {
                    // 国家
                    addressInfo.country = longName;
                }
                else if (types.includes("postal_code")) {
                    addressInfo.postalCode = longName;
                }
            });
            addressInfo.detailedAddress = `${addressInfo.country}${addressInfo.province}${addressInfo.city}${addressInfo.district}${addressInfo.route}${addressInfo.streetNumber}`;
            return addressInfo;
        }
        catch (error) {
            throw new Error(`Failed to get address from position: ${error}`);
        }
    }
    async clearMap() {
        this.clearMarkers();
        this.clearMarkerClusters();
        this.clearPolylines();
        this.clearPolygons();
        this.clearPathPlannings();
        this.clearInfoWindow();
        this.clearAnimations();
    }
    // ============================ 多边形 =============================
    /**
     * 绘制多边形
     */
    async addPolygon(config) {
        if (!this.map || !this.google) {
            throw new Error("Map not initialized");
        }
        const polygonId = this.generateId(COVERING_TYPES.POLYGON);
        const defaultOptions = {
            id: polygonId,
            fillColor: "#00B2D5",
            fillOpacity: 0.5,
            strokeColor: "#00D3FC",
            strokeOpacity: 0.9,
            strokeWeight: 2,
            editable: false,
            draggable: false,
            clickable: true,
            zIndex: 10,
        };
        const mergedOptions = { ...defaultOptions, ...config };
        // 创建Google Maps多边形
        const { Polygon } = await this.google.maps.importLibrary("maps");
        // 处理路径，确保至少有2个点
        const paths = mergedOptions.path.map(([lng, lat]) => ({ lat, lng }));
        // 对于预览模式，根据点的数量决定显示效果
        if (paths.length === 2) {
            // 只有2个点时，显示为线段
            const polyline = new this.google.maps.Polyline({
                path: paths,
                strokeColor: mergedOptions.strokeColor,
                strokeOpacity: mergedOptions.strokeOpacity,
                strokeWeight: mergedOptions.strokeWeight,
                map: this.map,
            });
            // 返回一个包装的polyline对象，模拟polygon接口
            const previewPolygon = {
                id: polygonId,
                path: mergedOptions.path.map((p) => [...p]),
                googlePolygon: polyline,
                setPath: (path) => {
                    polyline.setPath(path.map(([lng, lat]) => ({ lat, lng })));
                    previewPolygon.path = path;
                },
                setOptions: () => { },
                setEditable: () => { },
                setDraggable: () => { },
                getBounds: () => null,
                contains: () => false,
                getArea: () => 0,
                show: () => polyline.setMap(this.map),
                hide: () => polyline.setMap(null),
                remove: () => {
                    polyline.setMap(null);
                    this.removePolygonFromCollection(polygonId);
                },
                // clear: () => {
                //   polyline.setMap(null);
                //   this.removePolygonFromCollection(polygonId);
                // },
            };
            this.addPolygonToCollection(previewPolygon);
            return previewPolygon;
        }
        // 正常多边形绘制
        const googlePolygon = new Polygon({
            paths: paths,
            fillColor: mergedOptions.fillColor,
            fillOpacity: mergedOptions.fillOpacity,
            strokeColor: mergedOptions.strokeColor,
            strokeOpacity: mergedOptions.strokeOpacity,
            strokeWeight: mergedOptions.strokeWeight,
            clickable: mergedOptions.clickable,
            draggable: mergedOptions.draggable,
            editable: mergedOptions.editable,
            zIndex: mergedOptions.zIndex,
            map: this.map,
        });
        // 绑定事件监听器
        if (typeof mergedOptions.onClick === "function") {
            googlePolygon.addListener("click", (event) => {
                const data = mergedOptions.data;
                mergedOptions.onClick({ event, polygon: polygon, data });
            });
        }
        if (typeof mergedOptions.onMouseover === "function") {
            googlePolygon.addListener("mouseover", (event) => {
                const data = mergedOptions.data;
                mergedOptions.onMouseover({ event, polygon: polygon, data });
            });
        }
        if (typeof mergedOptions.onMouseout === "function") {
            googlePolygon.addListener("mouseout", (event) => {
                const data = mergedOptions.data;
                mergedOptions.onMouseout({ event, polygon: polygon, data });
            });
        }
        if (typeof mergedOptions.onDragEnd === "function") {
            googlePolygon.addListener("dragend", (event) => {
                const path = googlePolygon
                    .getPaths()
                    .getArray()[0]
                    .getArray()
                    .map((latLng) => [latLng.lng(), latLng.lat()]);
                mergedOptions.onDragEnd({ event, polygon: polygon, path, data: mergedOptions.data });
            });
        }
        if (typeof mergedOptions.onEditEnd === "function") {
            googlePolygon.addListener("mouseup", (event) => {
                const path = googlePolygon
                    .getPaths()
                    .getArray()[0]
                    .getArray()
                    .map((latLng) => [latLng.lng(), latLng.lat()]);
                mergedOptions.onEditEnd({ event, polygon: polygon, path, data: mergedOptions.data });
            });
        }
        const polygon = {
            id: polygonId,
            path: mergedOptions.path.map((p) => [...p]),
            googlePolygon,
            setPath: (path) => {
                googlePolygon.setPaths(path.map(([lng, lat]) => ({ lat, lng })));
                polygon.path = path;
            },
            setOptions: (options) => {
                const newOptions = { ...mergedOptions, ...options };
                googlePolygon.setOptions({
                    fillColor: newOptions.fillColor,
                    fillOpacity: newOptions.fillOpacity,
                    strokeColor: newOptions.strokeColor,
                    strokeOpacity: newOptions.strokeOpacity,
                    strokeWeight: newOptions.strokeWeight,
                    clickable: newOptions.clickable,
                    draggable: newOptions.draggable,
                    editable: newOptions.editable,
                    zIndex: newOptions.zIndex,
                });
            },
            setEditable: (editable) => {
                googlePolygon.setEditable(editable);
            },
            setDraggable: (draggable) => {
                googlePolygon.setDraggable(draggable);
            },
            getPath: () => {
                return googlePolygon
                    .getPath()
                    .getArray()
                    .map((latLng) => [latLng.lng(), latLng.lat()]);
            },
            getBounds: () => {
                return googlePolygon.getBounds();
            },
            contains: (point) => {
                const bounds = googlePolygon.getBounds();
                if (!bounds)
                    return false;
                const pointLatLng = new this.google.maps.LatLng(point[1], point[0]);
                return bounds.contains(pointLatLng);
            },
            getArea: () => {
                const area = this.google.maps.geometry.spherical.computeArea(googlePolygon.getPaths().getArray()[0]);
                return area;
            },
            show: () => {
                googlePolygon.setMap(this.map);
            },
            hide: () => {
                googlePolygon.setMap(null);
            },
            remove: () => {
                googlePolygon.setMap(null);
                this.removePolygonFromCollection(polygonId);
            },
            // clear: () => {
            //   googlePolygon.setMap(null);
            //   this.removePolygonFromCollection(polygonId);
            // },
        };
        this.addPolygonToCollection(polygon);
        return polygon;
    }
    /**
     * 按条件清除多边形
     */
    clearPolygons(params) {
        if (!this.map)
            return;
        const typeToClear = params?.type;
        const explicitPolygons = params?.polygons || [];
        // 1) 如果没有传入任何参数，清除所有多边形
        if (!typeToClear && explicitPolygons.length === 0) {
            this.clearAllPolygons();
            return;
        }
        // 2) 基于类型清除
        if (typeToClear) {
            this.getPolygons().forEach((polygon) => {
                if (polygon?.type === typeToClear) {
                    if (polygon?.remove) {
                        polygon.remove();
                    }
                    this.removePolygonFromCollection(polygon.id);
                }
            });
        }
        // 3) 清除外部显式传入的多边形
        explicitPolygons.forEach((polygon) => {
            if (polygon?.remove) {
                polygon.remove();
            }
            this.removePolygonFromCollection(polygon.id);
        });
    }
    // ============================ 轨迹动画 =============================
    /**
     * 添加轨迹动画
     */
    async addAnimation(config) {
        if (!this.map || !this.google) {
            throw new Error("Map not initialized");
        }
        const animationId = this.generateId(COVERING_TYPES.ANIMATION);
        const defaultOptions = {
            duration: 5000,
            speed: 1,
            autoStart: false,
            loop: false,
        };
        const mergedOptions = { ...defaultOptions, ...config };
        // 创建移动标记
        const markerOptions = mergedOptions.markerOptions || {
            position: mergedOptions.path[0],
            content: "🚗",
            map: true,
        };
        const movingMarker = await this.addMarker(markerOptions);
        let animationFrameId = null;
        let startTime = 0;
        let pausedTime = 0;
        let currentIndex = 0;
        let status = "idle";
        let currentSpeed = mergedOptions.speed;
        const googleAnimation = {
            id: animationId,
            start: () => {
                if (status === "playing")
                    return;
                if (status === "completed" || status === "stopped") {
                    currentIndex = 0;
                    pausedTime = 0;
                }
                status = "playing";
                startTime = Date.now() - pausedTime;
                const animate = () => {
                    if (status !== "playing")
                        return;
                    const elapsed = Date.now() - startTime;
                    const totalDuration = mergedOptions.duration / currentSpeed;
                    let progress = Math.min(elapsed / totalDuration, 1);
                    if (progress >= 1) {
                        if (mergedOptions.loop) {
                            progress = 0;
                            currentIndex = 0;
                            startTime = Date.now();
                        }
                        else {
                            status = "completed";
                            if (mergedOptions.onComplete) {
                                mergedOptions.onComplete();
                            }
                            return;
                        }
                    }
                    // 计算当前位置
                    const totalPoints = mergedOptions.path.length;
                    const targetIndex = Math.floor(progress * (totalPoints - 1));
                    const segmentProgress = (progress * (totalPoints - 1)) % 1;
                    if (targetIndex !== currentIndex) {
                        currentIndex = targetIndex;
                        if (mergedOptions.onStep) {
                            mergedOptions.onStep(currentIndex, mergedOptions.path[currentIndex]);
                        }
                    }
                    // 插值计算当前位置
                    const currentPos = mergedOptions.path[Math.min(currentIndex, totalPoints - 2)];
                    const nextPos = mergedOptions.path[Math.min(currentIndex + 1, totalPoints - 1)];
                    const lat = currentPos[1] + (nextPos[1] - currentPos[1]) * segmentProgress;
                    const lng = currentPos[0] + (nextPos[0] - currentPos[0]) * segmentProgress;
                    const position = [lng, lat];
                    movingMarker.setPosition(position);
                    // 触发进度回调
                    if (mergedOptions.onProgress) {
                        mergedOptions.onProgress(progress, position);
                    }
                    animationFrameId = requestAnimationFrame(animate);
                };
                if (mergedOptions.onStart) {
                    mergedOptions.onStart();
                }
                animate();
            },
            pause: () => {
                if (status !== "playing")
                    return;
                status = "paused";
                pausedTime = Date.now() - startTime;
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
                if (mergedOptions.onPause) {
                    mergedOptions.onPause();
                }
            },
            resume: () => {
                if (status !== "paused")
                    return;
                googleAnimation.start();
                if (mergedOptions.onResume) {
                    mergedOptions.onResume();
                }
            },
            stop: () => {
                status = "stopped";
                pausedTime = 0;
                currentIndex = 0;
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
                // 重置到起始位置
                movingMarker.setPosition(mergedOptions.path[0]);
                if (mergedOptions.onStop) {
                    mergedOptions.onStop();
                }
            },
            next: () => {
                if (status === "playing")
                    return;
                currentIndex = Math.min(currentIndex + 1, mergedOptions.path.length - 1);
                const position = mergedOptions.path[currentIndex];
                movingMarker.setPosition(position);
                if (mergedOptions.onStep) {
                    mergedOptions.onStep(currentIndex, position);
                }
            },
            previous: () => {
                if (status === "playing")
                    return;
                currentIndex = Math.max(currentIndex - 1, 0);
                const position = mergedOptions.path[currentIndex];
                movingMarker.setPosition(position);
                if (mergedOptions.onStep) {
                    mergedOptions.onStep(currentIndex, position);
                }
            },
            seek: (progress) => {
                const clampedProgress = Math.max(0, Math.min(1, progress));
                const totalPoints = mergedOptions.path.length;
                currentIndex = Math.floor(clampedProgress * (totalPoints - 1));
                const position = mergedOptions.path[currentIndex];
                movingMarker.setPosition(position);
                if (status === "playing") {
                    startTime = Date.now() - (clampedProgress * mergedOptions.duration) / currentSpeed;
                }
                else {
                    pausedTime = (clampedProgress * mergedOptions.duration) / currentSpeed;
                }
                if (mergedOptions.onProgress) {
                    mergedOptions.onProgress(clampedProgress, position);
                }
                if (mergedOptions.onStep) {
                    mergedOptions.onStep(currentIndex, position);
                }
            },
            setSpeed: (speed) => {
                currentSpeed = Math.max(0.1, speed);
                if (status === "playing") {
                    startTime = Date.now() - pausedTime;
                }
            },
            getCurrentPosition: () => {
                return [...mergedOptions.path[Math.min(currentIndex, mergedOptions.path.length - 1)]];
            },
            getProgress: () => {
                if (status === "idle" || status === "stopped")
                    return 0;
                if (status === "completed")
                    return 1;
                const elapsed = status === "playing" ? Date.now() - startTime : pausedTime;
                return Math.min(elapsed / (mergedOptions.duration / currentSpeed), 1);
            },
            getStatus: () => {
                return status;
            },
            remove: () => {
                googleAnimation.stop();
                movingMarker.remove();
                this.removeAnimationFromCollection(animationId);
            },
            // clear: () => {
            //   googleAnimation.remove();
            // },
        };
        this.addAnimationToCollection(googleAnimation);
        // 自动开始
        if (mergedOptions.autoStart) {
            setTimeout(() => googleAnimation.start(), 100);
        }
        return googleAnimation;
    }
    /**
     * 按条件清除轨迹动画
     */
    clearAnimations(params) {
        if (!this.map)
            return;
        const typeToClear = params?.type;
        const explicitAnimations = params?.animations || [];
        // 1) 如果没有传入任何参数，清除所有动画
        if (!typeToClear && explicitAnimations.length === 0) {
            this.clearAllAnimations();
            return;
        }
        // 2) 基于类型清除
        if (typeToClear) {
            this.getAnimations().forEach((animation) => {
                if (animation?.type === typeToClear) {
                    if (animation?.remove) {
                        animation.remove();
                    }
                    this.removeAnimationFromCollection(animation.id);
                }
            });
        }
        // 3) 清除外部显式传入的动画
        explicitAnimations.forEach((animation) => {
            if (animation?.remove) {
                animation.remove();
            }
            this.removeAnimationFromCollection(animation.id);
        });
    }
    // ============================ 其他 =============================
    generateId(type) {
        return `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }
}
// 扩展window对象以包含Google Maps和MarkerClusterer

class OpenLayersProvider extends BaseMapProvider {
    /**
     * 动态加载OpenLayers SDK
     */
    async loadOpenLayersSDK() {
        return new Promise((resolve, reject) => {
            // 检查是否已经加载
            if (window.ol) {
                resolve();
                return;
            }
            // 创建script标签
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "https://cdn.jsdelivr.net/npm/ol@v7.4.0/dist/ol.js";
            script.async = true;
            script.defer = true;
            // 加载成功回调
            script.onload = () => {
                if (window.ol) {
                    resolve();
                }
                else {
                    reject(new Error("OpenLayers SDK failed to load"));
                }
            };
            // 加载失败回调
            script.onerror = () => {
                reject(new Error("Failed to load OpenLayers SDK"));
            };
            // 添加到页面
            document.head.appendChild(script);
        });
    }
    async init(config) {
        this.config = config;
        // 动态加载OpenLayers SDK
        if (typeof window !== "undefined" && !this.ol) {
            try {
                // 检查是否已经加载了OpenLayers SDK
                if (!window.ol) {
                    // 动态加载OpenLayers SDK
                    await this.loadOpenLayersSDK();
                }
                this.ol = window.ol;
            }
            catch (error) {
                throw new Error(`Failed to load OpenLayers SDK: ${error}`);
            }
        }
        const container = typeof config.container === "string" ? document.getElementById(config.container) : config.container;
        if (!container) {
            throw new Error("Container element not found");
        }
        // 创建矢量图层用于放置markers
        this.vectorLayer = new this.ol.layer.Vector({
            source: new this.ol.source.Vector(),
        });
        this.map = new this.ol.Map({
            target: container,
            layers: [
                new this.ol.layer.Tile({
                    source: new this.ol.source.OSM(),
                }),
                this.vectorLayer,
            ],
            view: new this.ol.View({
                center: this.ol.proj.fromLonLat(config.center || [116.397428, 39.90923]),
                zoom: config.zoom || 11,
            }),
            ...config,
        });
    }
    async addMarker(config) {
        if (!this.map || !this.vectorLayer) {
            throw new Error("Map not initialized");
        }
        const markerId = this.generateId(COVERING_TYPES.MARKER);
        const { position, ...otherConfig } = config;
        // 创建marker要素
        const feature = new this.ol.Feature({
            geometry: new this.ol.geom.Point(this.ol.proj.fromLonLat(position)),
        });
        // 创建marker样式
        const markerStyle = new this.ol.style.Style({
            image: new this.ol.style.Icon({
                src: config.icon ||
                    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill="red"/></svg>',
                scale: 1,
            }),
        });
        feature.setStyle(markerStyle);
        // 添加到矢量图层
        this.vectorLayer.getSource().addFeature(feature);
        const marker = {
            id: markerId,
            position: [...position],
            olMarker: feature,
            olFeature: feature,
            setPosition: (newPosition) => {
                feature.getGeometry().setCoordinates(this.ol.proj.fromLonLat(newPosition));
                marker.position = newPosition;
            },
            setTitle: (title) => {
                feature.set("title", title);
            },
            setContent: (content) => {
                feature.set("content", content);
            },
            remove: () => {
                this.vectorLayer.getSource().removeFeature(feature);
                this.removeMarkerFromCollection(markerId);
            },
        };
        this.addMarkerToCollection(marker);
        return marker;
    }
    async addMarkerCluster(points, options) {
        if (!this.map) {
            throw new Error("Map not initialized");
        }
        const clusterId = this.generateId(COVERING_TYPES.CLUSTER);
        const defaultOptions = {
            renderClusterMarker: '<div style="background-color: #ff6b6b; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold;">{count}</div>',
            renderMarker: {
                icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill="red"/></svg>',
            },
            ...options,
        };
        // 创建聚合源
        const clusterSource = new this.ol.source.Vector();
        // 创建要素数组
        const features = [];
        points.forEach((point) => {
            const feature = new this.ol.Feature({
                geometry: new this.ol.geom.Point(this.ol.proj.fromLonLat(point.position)),
            });
            // 设置样式
            const markerStyle = new this.ol.style.Style({
                image: new this.ol.style.Icon({
                    src: defaultOptions.renderMarker?.icon ||
                        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill="red"/></svg>',
                    scale: 1,
                }),
            });
            feature.setStyle(markerStyle);
            features.push(feature);
            clusterSource.addFeature(feature);
        });
        // 创建聚合图层
        const clusterLayer = new this.ol.layer.Vector({
            source: clusterSource,
            style: (feature) => {
                const features = feature.get("features");
                if (features && features.length > 1) {
                    // 聚合样式
                    const count = features.length;
                    const div = document.createElement("div");
                    div.innerHTML = defaultOptions.renderClusterMarker.replace("{count}", count.toString());
                    const element = div.firstChild;
                    return new this.ol.style.Style({
                        image: new this.ol.style.Icon({
                            src: "data:image/svg+xml;utf8," + element.outerHTML,
                            scale: 1,
                        }),
                    });
                }
                else {
                    // 单个标记点样式
                    return new this.ol.style.Style({
                        image: new this.ol.style.Icon({
                            src: defaultOptions.renderMarker?.icon ||
                                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill="red"/></svg>',
                            scale: 1,
                        }),
                    });
                }
            },
        });
        // 添加到地图
        this.map.addLayer(clusterLayer);
        const markerCluster = {
            id: clusterId,
            points: [...points],
            olClusterSource: clusterSource,
            olClusterLayer: clusterLayer,
            olFeatures: features,
            addPoint: (point) => {
                const feature = new this.ol.Feature({
                    geometry: new this.ol.geom.Point(this.ol.proj.fromLonLat(point.position)),
                });
                const markerStyle = new this.ol.style.Style({
                    image: new this.ol.style.Icon({
                        src: defaultOptions.renderMarker?.icon ||
                            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill="red"/></svg>',
                        scale: 1,
                    }),
                });
                feature.setStyle(markerStyle);
                features.push(feature);
                markerCluster.points.push(point);
                clusterSource.addFeature(feature);
            },
            removePoint: (point) => {
                const index = markerCluster.points.findIndex((p) => p.position[0] === point.position[0] && p.position[1] === point.position[1]);
                if (index !== -1) {
                    const feature = features[index];
                    clusterSource.removeFeature(feature);
                    features.splice(index, 1);
                    markerCluster.points.splice(index, 1);
                }
            },
            // clear: () => {
            //   features.forEach((feature) => clusterSource.removeFeature(feature));
            //   features.length = 0;
            //   markerCluster.points.length = 0;
            // },
            remove: () => {
                this.map.removeLayer(clusterLayer);
                features.forEach((feature) => clusterSource.removeFeature(feature));
                features.length = 0;
                markerCluster.points.length = 0;
                this.removeClusterFromCollection(clusterId);
            },
        };
        this.addClusterToCollection(markerCluster);
        return markerCluster;
    }
    removeMarker(marker) {
        const olMarker = marker.olFeature;
        if (olMarker && this.vectorLayer) {
            this.vectorLayer.getSource().removeFeature(olMarker);
            this.removeMarkerFromCollection(marker.id);
        }
    }
    removeMarkerCluster(cluster) {
        const olCluster = cluster.olClusterLayer;
        if (olCluster) {
            this.map.removeLayer(olCluster);
            this.removeClusterFromCollection(cluster.id);
        }
    }
    setCenter(position) {
        if (this.map) {
            this.map.getView().setCenter(this.ol.proj.fromLonLat(position));
        }
    }
    setZoom(zoom) {
        if (this.map) {
            this.map.getView().setZoom(zoom);
        }
    }
    setZoomAndCenter(zoom, center) {
        if (this.map) {
            this.map.getView().setZoom(zoom);
            this.map.getView().setCenter(this.ol.proj.fromLonLat(center));
        }
    }
    async addInfoWindow(options) {
        if (!this.map) {
            throw new Error("Map not initialized");
        }
        const overlay = new this.ol.Overlay({
            element: typeof options.content === "string" ? createDomContent(options.content) : options.content,
            position: this.ol.proj.fromLonLat(options.position),
            positioning: "bottom-center",
            stopEvent: false,
        });
        this.map.addOverlay(overlay);
        this.addInfoWindowToCollection(overlay);
        return overlay;
    }
    destroy() {
        if (this.map) {
            this.map.setTarget(undefined);
            this.map = null;
        }
        this.clearMarkers();
        this.clearMarkerClusters();
    }
    getZoom() {
        if (this.map) {
            return Math.round(this.map.getView().getZoom());
        }
        return 11;
    }
    clearMarkers(params) {
        if (!this.map || !this.vectorLayer)
            return;
        const typeToClear = params?.type;
        const explicitMarkers = params?.markers || [];
        if (!typeToClear && explicitMarkers.length === 0) {
            this.clearAllMarkers();
            return;
        }
        if (typeToClear) {
            this.getMarkers().forEach((marker) => {
                if (marker?.type === typeToClear) {
                    marker.remove();
                }
            });
        }
        explicitMarkers.forEach((marker) => {
            marker.remove();
        });
    }
    clearMarkerClusters(params) {
        if (!this.map)
            return;
        const typeToClear = params?.type;
        const explicitClusters = params?.clusters || [];
        if (!typeToClear && explicitClusters.length === 0) {
            this.clearAllMarkerClusters();
            return;
        }
        if (typeToClear) {
            this.getMarkerClusters().forEach((cluster) => {
                if (cluster?.type === typeToClear) {
                    cluster.remove();
                }
            });
        }
        explicitClusters.forEach((cluster) => {
            cluster.remove();
        });
    }
    clearPolylines(params) {
        if (!this.map)
            return;
        const typeToClear = params?.type;
        const explicitPolylines = params?.polylines || [];
        if (!typeToClear && explicitPolylines.length === 0) {
            this.clearAllPolylines();
            return;
        }
        if (typeToClear) {
            this.polylines.forEach((polyline) => {
                if (polyline?.type === typeToClear) {
                    if (polyline.setMap) {
                        polyline.setMap(null);
                    }
                    this.removePolylineFromCollection(polyline);
                }
            });
        }
        explicitPolylines.forEach((polyline) => {
            if (polyline.setMap) {
                polyline.setMap(null);
            }
            this.removePolylineFromCollection(polyline);
        });
    }
    async addPolygon(config) {
        if (!this.map || !this.vectorLayer) {
            throw new Error("Map not initialized");
        }
        const polygonId = this.generateId(COVERING_TYPES.POLYGON);
        const defaultOptions = {
            id: polygonId,
            path: [],
            strokeColor: "#FF0000",
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.3,
            clickable: true,
            draggable: false,
            editable: false,
            zIndex: 1,
        };
        const mergedOptions = { ...defaultOptions, ...config };
        const polygonFeature = new this.ol.Feature({
            geometry: new this.ol.geom.Polygon([mergedOptions.path.map((point) => this.ol.proj.fromLonLat([point[0], point[1]]))]),
        });
        const polygonStyle = new this.ol.style.Style({
            fill: new this.ol.style.Fill({
                color: `rgba(${this.hexToRgb(mergedOptions.fillColor)}, ${mergedOptions.fillOpacity})`,
            }),
            stroke: new this.ol.style.Stroke({
                color: mergedOptions.strokeColor,
                width: mergedOptions.strokeWeight,
                opacity: mergedOptions.strokeOpacity,
            }),
        });
        polygonFeature.setStyle(polygonStyle);
        this.vectorLayer.getSource().addFeature(polygonFeature);
        const olPolygon = {
            id: polygonId,
            path: mergedOptions.path.map((p) => [...p]),
            googlePolygon: polygonFeature,
            setPath: (path) => {
                const geometry = polygonFeature.getGeometry();
                geometry.setCoordinates([path.map(([lng, lat]) => this.ol.proj.fromLonLat([lng, lat]))]);
                olPolygon.path = path;
            },
            setOptions: (options) => {
                const newStyle = new this.ol.style.Style({
                    fill: new this.ol.style.Fill({
                        color: `rgba(${this.hexToRgb(options.fillColor || mergedOptions.fillColor)}, ${options.fillOpacity || mergedOptions.fillOpacity})`,
                    }),
                    stroke: new this.ol.style.Stroke({
                        color: options.strokeColor || mergedOptions.strokeColor,
                        width: options.strokeWeight || mergedOptions.strokeWeight,
                        opacity: options.strokeOpacity || mergedOptions.strokeOpacity,
                    }),
                });
                polygonFeature.setStyle(newStyle);
            },
            setEditable: (editable) => {
                // OpenLayers editable implementation would be complex
                console.warn("OpenLayers polygon editing not implemented");
            },
            setDraggable: (draggable) => {
                // OpenLayers draggable implementation would be complex
                console.warn("OpenLayers polygon dragging not implemented");
            },
            getBounds: () => {
                return polygonFeature.getGeometry().getExtent();
            },
            contains: (point) => {
                const geometry = polygonFeature.getGeometry();
                return geometry.intersectsCoordinate(this.ol.proj.fromLonLat(point));
            },
            getArea: () => {
                const geometry = polygonFeature.getGeometry();
                return this.ol.Sphere.getArea(geometry);
            },
            show: () => {
                polygonFeature.setStyle(polygonStyle);
            },
            hide: () => {
                polygonFeature.setStyle(new this.ol.style.Style({}));
            },
            remove: () => {
                this.vectorLayer.getSource().removeFeature(polygonFeature);
                this.removePolygonFromCollection(polygonId);
            },
            // clear: () => {
            //   this.vectorLayer.getSource().removeFeature(polygonFeature);
            //   this.removePolygonFromCollection(polygonId);
            // },
        };
        this.addPolygonToCollection(olPolygon);
        return olPolygon;
    }
    clearPolygons(params) {
        if (!this.map)
            return;
        const typeToClear = params?.type;
        const explicitPolygons = params?.polygons || [];
        if (!typeToClear && explicitPolygons.length === 0) {
            this.clearAllPolygons();
            return;
        }
        if (typeToClear) {
            this.getPolygons().forEach((polygon) => {
                if (polygon?.type === typeToClear) {
                    polygon.remove();
                }
            });
        }
        explicitPolygons.forEach((polygon) => {
            polygon.remove();
        });
    }
    clearPathPlannings(params) {
        if (!this.map)
            return;
        const typeToClear = params?.type;
        const explicitPathPlannings = params?.pathPlannings || [];
        if (!typeToClear && explicitPathPlannings.length === 0) {
            this.clearAllPathPlannings();
            return;
        }
        if (typeToClear) {
            this.getPathPlannings().forEach((planning) => {
                if (planning?.type === typeToClear) {
                    if (planning?.remove) {
                        planning.remove();
                    }
                }
            });
        }
        explicitPathPlannings.forEach((planning) => {
            if (planning?.remove) {
                planning.remove();
            }
            this.removePathPlanningFromCollection(planning);
        });
    }
    clearInfoWindow(params) {
        if (!this.map)
            return;
        const typeToClear = params?.type;
        const explicitInfoWindows = params?.infoWindows || [];
        if (!typeToClear && explicitInfoWindows.length === 0) {
            this.clearAllInfoWindows();
            return;
        }
        if (typeToClear) {
            this.getInfoWindows().forEach((infoWindow) => {
                if (infoWindow?.type === typeToClear) {
                    if (infoWindow?.remove) {
                        infoWindow.remove();
                    }
                }
            });
        }
        explicitInfoWindows.forEach((infoWindow) => {
            if (infoWindow?.remove) {
                infoWindow.remove();
            }
            this.removeInfoWindowFromCollection(infoWindow);
        });
    }
    async clearMap() {
        this.clearMarkers();
        this.clearMarkerClusters();
        this.clearPolylines();
        this.clearPolygons();
        this.clearPathPlannings();
        this.clearInfoWindow();
        this.clearAnimations();
    }
    async addAnimation(config) {
        const animationId = this.generateId(COVERING_TYPES.ANIMATION);
        const animation = {
            id: animationId,
            start: () => {
                console.warn("OpenLayers does not support trajectory animation");
            },
            pause: () => {
                console.warn("OpenLayers does not support trajectory animation");
            },
            resume: () => {
                console.warn("OpenLayers does not support trajectory animation");
            },
            stop: () => {
                console.warn("OpenLayers does not support trajectory animation");
            },
            next: () => {
                console.warn("OpenLayers does not support trajectory animation");
            },
            previous: () => {
                console.warn("OpenLayers does not support trajectory animation");
            },
            seek: (progress) => {
                console.warn("OpenLayers does not support trajectory animation");
            },
            setSpeed: (speed) => {
                console.warn("OpenLayers does not support trajectory animation");
            },
            getCurrentPosition: () => {
                return [0, 0];
            },
            getProgress: () => {
                return 0;
            },
            getStatus: () => {
                return "idle";
            },
            remove: () => {
                this.removeAnimationFromCollection(animationId);
            },
            // clear: () => {
            //   this.removeAnimationFromCollection(animationId);
            // },
        };
        this.addAnimationToCollection(animation);
        return animation;
    }
    clearAnimations(params) {
        const typeToClear = params?.type;
        const explicitAnimations = params?.animations || [];
        if (!typeToClear && explicitAnimations.length === 0) {
            this.clearAllAnimations();
            return;
        }
        if (typeToClear) {
            this.getAnimations().forEach((animation) => {
                if (animation?.type === typeToClear) {
                    animation.remove();
                }
            });
        }
        explicitAnimations.forEach((animation) => {
            animation.remove();
        });
    }
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "255, 0, 0";
    }
}
// 扩展window对象以包含OpenLayers

// 错误类定义
class MapProviderError extends Error {
    constructor(message, provider) {
        super(message);
        this.provider = provider;
        this.name = "MapProviderError";
    }
}
class MapProviderFactory {
    /**
     * 注册地图提供者
     * @param provider 地图提供者类型
     * @param providerClass 提供者构造函数
     */
    static registerProvider(provider, providerClass) {
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
    static createProvider(provider) {
        const ProviderClass = this.providers.get(provider);
        if (!ProviderClass) {
            throw new MapProviderError(`Unsupported map provider: ${provider}. Supported providers: ${this.getSupportedProviders().join(", ")}`, provider);
        }
        try {
            return new ProviderClass();
        }
        catch (error) {
            throw new MapProviderError(`Failed to create provider instance for ${provider}: ${error instanceof Error ? error.message : "Unknown error"}`, provider);
        }
    }
    /**
     * 获取所有支持的地图提供者
     * @returns 支持的地图提供者数组
     */
    static getSupportedProviders() {
        return Array.from(this.providers.keys());
    }
    /**
     * 检查地图提供者是否被支持
     * @param provider 地图提供者
     * @returns 是否支持
     */
    static isProviderSupported(provider) {
        return this.providers.has(provider);
    }
    /**
     * 取消注册地图提供者
     * @param provider 地图提供者类型
     */
    static unregisterProvider(provider) {
        return this.providers.delete(provider);
    }
    /**
     * 清除所有注册的提供者（主要用于测试）
     */
    static clearProviders() {
        this.providers.clear();
    }
}
MapProviderFactory.providers = new Map();
(() => {
    // 注册所有可用的提供者
    MapProviderFactory.registerProvider(MAP_PROVIDERS.AMAP, AMapProvider);
    MapProviderFactory.registerProvider(MAP_PROVIDERS.GOOGLE, GoogleMapProvider);
    MapProviderFactory.registerProvider(MAP_PROVIDERS.OPENLAYERS, OpenLayersProvider);
})();

// SDK错误类定义
class MapSDKError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = "MapSDKError";
    }
}
// 错误代码常量
const ERROR_CODES = {
    NOT_INITIALIZED: "NOT_INITIALIZED",
    ALREADY_INITIALIZED: "ALREADY_INITIALIZED",
    UNSUPPORTED_PROVIDER: "UNSUPPORTED_PROVIDER",
    INVALID_CONFIG: "INVALID_CONFIG",
};
class MapSDK {
    constructor(provider) {
        this.isInitialized = false;
        try {
            if (!MapProviderFactory.isProviderSupported(provider)) {
                throw new MapSDKError(`Unsupported map provider: ${provider}`, ERROR_CODES.UNSUPPORTED_PROVIDER);
            }
            this.provider = MapProviderFactory.createProvider(provider);
        }
        catch (error) {
            if (error instanceof MapProviderError) {
                throw new MapSDKError(error.message, ERROR_CODES.UNSUPPORTED_PROVIDER);
            }
            throw error;
        }
    }
    /**
     * 检查地图是否已初始化，未初始化则抛出错误
     */
    ensureInitialized() {
        if (!this.isInitialized) {
            throw new MapSDKError("Map is not initialized. Call init() first.", ERROR_CODES.NOT_INITIALIZED);
        }
    }
    /**
     * 验证配置参数
     */
    validateConfig(config) {
        if (!config) {
            throw new MapSDKError("Config is required", ERROR_CODES.INVALID_CONFIG);
        }
        if (!config.container) {
            throw new MapSDKError("Container is required", ERROR_CODES.INVALID_CONFIG);
        }
    }
    /**
     * 初始化地图
     * @param config 地图配置
     */
    async init(config) {
        if (this.isInitialized) {
            throw new MapSDKError("Map is already initialized", ERROR_CODES.ALREADY_INITIALIZED);
        }
        this.validateConfig(config);
        try {
            await this.provider.init(config);
            this.isInitialized = true;
        }
        catch (error) {
            throw new MapSDKError(`Failed to initialize map: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    /**
     * 添加标记点
     * @param config 标记点配置
     * @returns 标记点实例
     */
    async addMarker(config) {
        this.ensureInitialized();
        if (!config?.position) {
            throw new MapSDKError("Marker position is required", ERROR_CODES.INVALID_CONFIG);
        }
        try {
            return await this.provider.addMarker(config);
        }
        catch (error) {
            throw new MapSDKError(`Failed to add marker: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    /**
     * 批量/条件清除标记点
     */
    clearMarkers(params) {
        this.ensureInitialized();
        this.provider.clearMarkers(params);
    }
    /**
     * 添加标记点聚合
     * @param points 坐标点数组
     * @param options 聚合选项
     * @returns 标记点聚合实例
     */
    async addMarkerCluster(points, options) {
        this.ensureInitialized();
        if (!points || points.length === 0) {
            throw new MapSDKError("Cluster points are required", ERROR_CODES.INVALID_CONFIG);
        }
        try {
            return await this.provider.addMarkerCluster(points, options);
        }
        catch (error) {
            throw new MapSDKError(`Failed to add marker cluster: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    /**
     * 批量/条件清除聚合
     */
    clearMarkerClusters(params) {
        this.ensureInitialized();
        this.provider.clearMarkerClusters(params);
    }
    /**
     * 设置地图中心点
     * @param position 中心点坐标 [经度, 纬度]
     */
    setCenter(position) {
        this.ensureInitialized();
        if (!position || position.length !== 2) {
            throw new MapSDKError("Invalid position format", ERROR_CODES.INVALID_CONFIG);
        }
        this.provider.setCenter(position);
    }
    /**
     * 设置地图缩放级别
     * @param zoom 缩放级别
     */
    setZoom(zoom) {
        this.ensureInitialized();
        if (typeof zoom !== "number" || zoom < 0) {
            throw new MapSDKError("Invalid zoom level", ERROR_CODES.INVALID_CONFIG);
        }
        this.provider.setZoom(zoom);
    }
    /**
     * 同时设置地图缩放级别和中心点
     * @param zoom 缩放级别
     * @param center 中心点坐标 [经度, 纬度]
     */
    setZoomAndCenter(zoom, center) {
        this.ensureInitialized();
        if (typeof zoom !== "number" || zoom < 0) {
            throw new MapSDKError("Invalid zoom level", ERROR_CODES.INVALID_CONFIG);
        }
        if (!center || center.length !== 2) {
            throw new MapSDKError("Invalid center position format", ERROR_CODES.INVALID_CONFIG);
        }
        this.provider.setZoomAndCenter(zoom, center);
    }
    /**
     * 获取地图缩放级别
     */
    getZoom() {
        this.ensureInitialized();
        return this.provider.getZoom();
    }
    /**
     * 添加路径规划：驾车
     */
    async addPathPlanning(options) {
        this.ensureInitialized();
        if (!options?.start || !options?.end) {
            throw new MapSDKError("Start and end points are required", ERROR_CODES.INVALID_CONFIG);
        }
        try {
            return await this.provider.addPathPlanning(options);
        }
        catch (error) {
            throw new MapSDKError(`Failed to add path planning: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    /**
     * 通过经纬度获取详细地址信息
     */
    async getAddress(position) {
        this.ensureInitialized();
        if (!position || position.length !== 2) {
            throw new MapSDKError("Invalid position format", ERROR_CODES.INVALID_CONFIG);
        }
        try {
            return await this.provider.getAddress(position);
        }
        catch (error) {
            throw new MapSDKError(`Failed to get address: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    /**
     * 添加信息窗体（InfoWindow）
     */
    async addInfoWindow(options) {
        this.ensureInitialized();
        if (!options?.content || !options?.position) {
            throw new MapSDKError("Content and position are required", ERROR_CODES.INVALID_CONFIG);
        }
        try {
            return await this.provider.addInfoWindow(options);
        }
        catch (error) {
            throw new MapSDKError(`Failed to add info window: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    /**
     * 绘制折线（Polyline）
     */
    async addPolyline(options) {
        this.ensureInitialized();
        if (!options?.path || options.path.length < 2) {
            throw new MapSDKError("Path with at least 2 points is required", ERROR_CODES.INVALID_CONFIG);
        }
        try {
            return await this.provider.addPolyline(options);
        }
        catch (error) {
            throw new MapSDKError(`Failed to add polyline: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    /**
     * 添加多边形
     */
    async addPolygon(config) {
        this.ensureInitialized();
        // if (!config.editable && (!config?.path || config.path.length < 3)) {
        //   throw new MapSDKError("Path with at least 3 points is required", ERROR_CODES.INVALID_CONFIG);
        // }
        try {
            return await this.provider.addPolygon(config);
        }
        catch (error) {
            throw new MapSDKError(`Failed to add polygon: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    /**
     * 清除多边形
     */
    clearPolygons(params) {
        this.ensureInitialized();
        this.provider.clearPolygons(params);
    }
    /**
     * 获取所有标记点
     * @returns 标记点数组
     */
    getMarkers() {
        this.ensureInitialized();
        return this.provider.getMarkers() || [];
    }
    /**
     * 清除所有折线
     */
    clearPolylines(params) {
        this.ensureInitialized();
        this.provider.clearPolylines(params);
    }
    /**
     * 添加轨迹动画
     */
    async addAnimation(config) {
        this.ensureInitialized();
        if (!config?.path || config.path.length < 2) {
            throw new MapSDKError("Animation path with at least 2 points is required", ERROR_CODES.INVALID_CONFIG);
        }
        try {
            return await this.provider.addAnimation(config);
        }
        catch (error) {
            throw new MapSDKError(`Failed to add animation: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    /**
     * 清除轨迹动画
     */
    clearAnimations(params) {
        this.ensureInitialized();
        this.provider.clearAnimations(params);
    }
    /**
     * 清除路径规划
     */
    clearPathPlannings(params) {
        this.ensureInitialized();
        this.provider.clearPathPlannings(params);
    }
    /**
     * 清除信息窗体
     */
    clearInfoWindow(params) {
        this.ensureInitialized();
        this.provider.clearInfoWindow(params);
    }
    /**
     * 清空地图所有内容
     */
    async clearMap() {
        this.ensureInitialized();
        try {
            await this.provider.clearMap();
        }
        catch (error) {
            throw new MapSDKError(`Failed to clear map: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    /**
     * 销毁地图
     */
    destroy() {
        if (this.isInitialized) {
            try {
                this.provider.destroy();
            }
            catch (error) {
                console.warn("Error during map destruction:", error);
            }
            finally {
                this.isInitialized = false;
            }
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
        try {
            MapProviderFactory.registerProvider(provider, providerClass);
        }
        catch (error) {
            throw new MapSDKError(`Failed to register provider: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
}

// 主类

exports.AMapProvider = AMapProvider;
exports.BaseMapProvider = BaseMapProvider;
exports.COVERING_TYPES = COVERING_TYPES;
exports.CoveringType = CoveringType;
exports.DOMError = DOMError;
exports.ERROR_CODES = ERROR_CODES;
exports.GoogleMapProvider = GoogleMapProvider;
exports.MAP_PROVIDERS = MAP_PROVIDERS;
exports.MapProvider = MapProvider;
exports.MapProviderError = MapProviderError;
exports.MapProviderFactory = MapProviderFactory;
exports.MapSDK = MapSDK;
exports.MapSDKError = MapSDKError;
exports.OpenLayersProvider = OpenLayersProvider;
exports.createDomContent = createDomContent;
exports.default = MapSDK;
exports.safeCloneElement = safeCloneElement;
exports.safeSetInnerHTML = safeSetInnerHTML;
//# sourceMappingURL=index.cjs.map
