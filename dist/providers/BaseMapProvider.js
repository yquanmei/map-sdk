export class BaseMapProvider {
    constructor() {
        this.markers = new Map();
        this.markerClusters = new Map();
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
    getMarkers() {
        return Array.from(this.markers.values());
    }
    getMarkerClusters() {
        return Array.from(this.markerClusters.values());
    }
    clearMarkers() {
        this.markers.forEach(marker => marker.remove());
        this.markers.clear();
    }
    clearMarkerClusters() {
        this.markerClusters.forEach(cluster => cluster.remove());
        this.markerClusters.clear();
    }
}
