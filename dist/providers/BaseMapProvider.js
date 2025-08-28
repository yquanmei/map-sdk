export class BaseMapProvider {
    constructor() {
        this.markers = new Map();
        this.markerClusters = new Map();
        this.polylines = [];
        this.polygons = new Map();
        this.pathPlannings = [];
        this.infoWindows = [];
        this.animations = new Map();
    }
    generateMarkerId() {
        return `marker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateClusterId() {
        return `cluster_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
        this.polylines = [];
    }
    clearAllPathPlannings() {
        this.pathPlannings.forEach((planning) => {
            if (planning?.remove) {
                planning.remove();
            }
        });
        this.pathPlannings = [];
    }
    clearAllInfoWindows() {
        this.infoWindows.forEach((infoWindow) => {
            if (infoWindow?.remove) {
                infoWindow.remove();
            }
        });
        this.infoWindows = [];
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
    generateAnimationId() {
        return `animation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generatePolygonId() {
        return `polygon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
