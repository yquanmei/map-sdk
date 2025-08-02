export class BaseMapProvider {
    constructor() {
        this.markers = new Map();
    }
    generateMarkerId() {
        return `marker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    addMarkerToCollection(marker) {
        this.markers.set(marker.id, marker);
    }
    removeMarkerFromCollection(markerId) {
        this.markers.delete(markerId);
    }
    getMarkers() {
        return Array.from(this.markers.values());
    }
    clearMarkers() {
        this.markers.forEach(marker => marker.remove());
        this.markers.clear();
    }
}
