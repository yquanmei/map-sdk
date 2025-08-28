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
            script.src = `https://webapi.amap.com/maps?v=2.0&key=${apiKey || ''}&plugin=AMap.Marker,AMap.MarkerCluster`;
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
                position: [0, 0], // 占位符，实际位置会从 point 中获取
                icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png'
            },
            ...options
        };
        // 创建标记点数组
        const markers = [];
        points.forEach(point => {
            const { position: _, ...renderMarkerConfig } = defaultOptions.renderMarker;
            const { position: pointPosition, ...pointConfig } = point;
            const marker = new this.AMap.Marker({
                position: pointPosition,
                ...renderMarkerConfig,
                ...pointConfig
            });
            markers.push(marker);
        });
        // 创建聚合插件
        const cluster = new this.AMap.MarkerCluster(this.map, markers, {
            gridSize: defaultOptions.gridSize,
            maxZoom: defaultOptions.maxZoom,
            renderClusterMarker: (context) => {
                const count = context.count;
                const div = document.createElement('div');
                div.innerHTML = defaultOptions.renderClusterMarker.replace('{count}', count.toString());
                return div.firstChild;
            }
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
                    ...pointConfig
                });
                markers.push(marker);
                markerCluster.points.push(point);
                cluster.addMarker(marker);
            },
            removePoint: (point) => {
                const index = markerCluster.points.findIndex(p => p.position[0] === point.position[0] && p.position[1] === point.position[1]);
                if (index !== -1) {
                    const marker = markers[index];
                    cluster.removeMarker(marker);
                    markers.splice(index, 1);
                    markerCluster.points.splice(index, 1);
                }
            },
            clear: () => {
                markers.forEach(marker => cluster.removeMarker(marker));
                markers.length = 0;
                markerCluster.points.length = 0;
            },
            remove: () => {
                cluster.setMap(null);
                this.removeClusterFromCollection(clusterId);
            }
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
        const polygon = new this.AMap.Polygon({
            path: mergedOptions.path,
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
            path: mergedOptions.path,
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
            clear: () => {
                this.map.remove(polygon);
                this.removePolygonFromCollection(polygonId);
            },
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
                console.warn('AMap does not support trajectory animation');
            },
            pause: () => {
                console.warn('AMap does not support trajectory animation');
            },
            resume: () => {
                console.warn('AMap does not support trajectory animation');
            },
            stop: () => {
                console.warn('AMap does not support trajectory animation');
            },
            next: () => {
                console.warn('AMap does not support trajectory animation');
            },
            previous: () => {
                console.warn('AMap does not support trajectory animation');
            },
            seek: (progress) => {
                console.warn('AMap does not support trajectory animation');
            },
            setSpeed: (speed) => {
                console.warn('AMap does not support trajectory animation');
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
}
