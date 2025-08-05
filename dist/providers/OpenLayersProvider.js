import { BaseMapProvider } from './BaseMapProvider';
export class OpenLayersProvider extends BaseMapProvider {
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
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://cdn.jsdelivr.net/npm/ol@v7.4.0/dist/ol.js';
            script.async = true;
            script.defer = true;
            // 加载成功回调
            script.onload = () => {
                if (window.ol) {
                    resolve();
                }
                else {
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
    async init(config) {
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
            }
            catch (error) {
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
    async addMarker(config) {
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
        const marker = {
            id: markerId,
            position,
            olMarker: feature,
            olFeature: feature,
            setPosition: (newPosition) => {
                feature.getGeometry().setCoordinates(this.ol.proj.fromLonLat(newPosition));
                marker.position = newPosition;
            },
            setTitle: (title) => {
                feature.set('title', title);
            },
            setContent: (content) => {
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
    async addMarkerCluster(points, options) {
        if (!this.map) {
            throw new Error('Map not initialized');
        }
        const clusterId = this.generateClusterId();
        const defaultOptions = {
            gridSize: 60,
            maxZoom: 18,
            renderClusterMarker: '<div style="background-color: #ff6b6b; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold;">{count}</div>',
            renderMarker: {
                position: [0, 0], // 占位符
                icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill="red"/></svg>'
            },
            ...options
        };
        // 创建聚合源
        const clusterSource = new this.ol.source.Vector();
        // 创建要素数组
        const features = [];
        points.forEach(point => {
            const feature = new this.ol.Feature({
                geometry: new this.ol.geom.Point(this.ol.proj.fromLonLat(point.position))
            });
            // 设置样式
            const markerStyle = new this.ol.style.Style({
                image: new this.ol.style.Icon({
                    src: defaultOptions.renderMarker?.icon || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill="red"/></svg>',
                    scale: 1
                })
            });
            feature.setStyle(markerStyle);
            features.push(feature);
            clusterSource.addFeature(feature);
        });
        // 创建聚合图层
        const clusterLayer = new this.ol.layer.Vector({
            source: clusterSource,
            style: (feature) => {
                const features = feature.get('features');
                if (features && features.length > 1) {
                    // 聚合样式
                    const count = features.length;
                    const div = document.createElement('div');
                    div.innerHTML = defaultOptions.renderClusterMarker.replace('{count}', count.toString());
                    const element = div.firstChild;
                    return new this.ol.style.Style({
                        image: new this.ol.style.Icon({
                            src: 'data:image/svg+xml;utf8,' + element.outerHTML,
                            scale: 1
                        })
                    });
                }
                else {
                    // 单个标记点样式
                    return new this.ol.style.Style({
                        image: new this.ol.style.Icon({
                            src: defaultOptions.renderMarker?.icon || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill="red"/></svg>',
                            scale: 1
                        })
                    });
                }
            }
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
                    geometry: new this.ol.geom.Point(this.ol.proj.fromLonLat(point.position))
                });
                const markerStyle = new this.ol.style.Style({
                    image: new this.ol.style.Icon({
                        src: defaultOptions.renderMarker?.icon || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill="red"/></svg>',
                        scale: 1
                    })
                });
                feature.setStyle(markerStyle);
                features.push(feature);
                markerCluster.points.push(point);
                clusterSource.addFeature(feature);
            },
            removePoint: (point) => {
                const index = markerCluster.points.findIndex(p => p.position[0] === point.position[0] && p.position[1] === point.position[1]);
                if (index !== -1) {
                    const feature = features[index];
                    clusterSource.removeFeature(feature);
                    features.splice(index, 1);
                    markerCluster.points.splice(index, 1);
                }
            },
            clear: () => {
                features.forEach(feature => clusterSource.removeFeature(feature));
                features.length = 0;
                markerCluster.points.length = 0;
            },
            remove: () => {
                this.map.removeLayer(clusterLayer);
                this.removeClusterFromCollection(clusterId);
            }
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
    destroy() {
        if (this.map) {
            this.map.setTarget(undefined);
            this.map = null;
        }
        this.clearMarkers();
        this.clearMarkerClusters();
    }
}
