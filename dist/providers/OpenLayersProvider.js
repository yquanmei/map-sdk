import { BaseMapProvider } from "./BaseMapProvider";
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
        const markerId = this.generateMarkerId();
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
            position,
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
        const clusterId = this.generateClusterId();
        const defaultOptions = {
            gridSize: 60,
            maxZoom: 18,
            renderClusterMarker: '<div style="background-color: #ff6b6b; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold;">{count}</div>',
            renderMarker: {
                position: [0, 0], // 占位符
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
            clear: () => {
                features.forEach((feature) => clusterSource.removeFeature(feature));
                features.length = 0;
                markerCluster.points.length = 0;
            },
            remove: () => {
                this.map.removeLayer(clusterLayer);
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
        const polygonId = this.generatePolygonId();
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
            geometry: new this.ol.geom.Polygon([mergedOptions.path.map(([lng, lat]) => this.ol.proj.fromLonLat([lng, lat]))]),
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
            path: mergedOptions.path,
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
            clear: () => {
                this.vectorLayer.getSource().removeFeature(polygonFeature);
                this.removePolygonFromCollection(polygonId);
            },
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
        const animationId = this.generateAnimationId();
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
            clear: () => {
                this.removeAnimationFromCollection(animationId);
            },
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
