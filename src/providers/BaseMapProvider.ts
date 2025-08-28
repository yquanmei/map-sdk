import {
  IMapProvider,
  IMarker,
  MapConfig,
  MarkerConfig,
  MarkerClusterPoint,
  MarkerClusterOptions,
  IMarkerCluster,
  IAnimation,
  AnimationConfig,
  PolygonConfig,
  IPolygon,
} from "../types";

export abstract class BaseMapProvider implements IMapProvider {
  protected map: any;
  protected markers: Map<string, IMarker> = new Map();
  protected markerClusters: Map<string, IMarkerCluster> = new Map();
  protected polylines: any[] = [];
  protected polygons: Map<string, IPolygon> = new Map();
  protected pathPlannings: Array<{ directionsRenderer: any; clear?: () => void; remove?: () => void }> = [];
  protected infoWindows: any[] = [];
  protected animations: Map<string, IAnimation> = new Map();
  protected config!: MapConfig;

  abstract init(config: MapConfig): Promise<void>;
  abstract addMarker(config: MarkerConfig): Promise<IMarker>;
  abstract clearMarkers(params?: { type?: string; markers?: Array<IMarker> }): void;
  abstract addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster>;
  abstract clearMarkerClusters(params?: { type?: string; clusters?: Array<IMarkerCluster> }): void;
  abstract addAnimation(config: AnimationConfig): Promise<IAnimation>;
  abstract clearAnimations(params?: { type?: string; animations?: Array<IAnimation> }): void;
  abstract clearPolylines(params?: { type?: string; polylines?: any[] }): void;
  abstract addPolygon(config: PolygonConfig): Promise<IPolygon>;
  abstract clearPolygons(params?: { type?: string; polygons?: Array<IPolygon> }): void;
  abstract clearPathPlannings(params?: { type?: string; pathPlannings?: any[] }): void;
  abstract clearInfoWindow(params?: { type?: string; infoWindows?: any[] }): void;
  abstract setCenter(position: [number, number]): void;
  abstract setZoom(zoom: number): void;
  abstract getZoom(): void;
  abstract destroy(): void;
  abstract clearMap(): Promise<void>;

  protected generateId(type: string): string {
    return `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  protected addMarkerToCollection(marker: IMarker): void {
    this.markers.set(marker.id, marker);
  }

  protected removeMarkerFromCollection(markerId: string): void {
    this.markers.delete(markerId);
  }

  protected addClusterToCollection(cluster: IMarkerCluster): void {
    this.markerClusters.set(cluster.id, cluster);
  }

  protected removeClusterFromCollection(clusterId: string): void {
    this.markerClusters.delete(clusterId);
  }

  protected addPolylinesToCollection(polyline: any): void {
    this.polylines.push(polyline);
  }

  protected removePolylineFromCollection(polyline: any): void {
    const index = this.polylines.indexOf(polyline);
    if (index > -1) {
      this.polylines.splice(index, 1);
    }
  }

  protected addPathPlanningToCollection(pathPlanning: any): void {
    this.pathPlannings.push(pathPlanning);
  }

  protected removePathPlanningFromCollection(pathPlanning: any): void {
    const index = this.pathPlannings.indexOf(pathPlanning);
    if (index > -1) {
      this.pathPlannings.splice(index, 1);
    }
  }

  protected addInfoWindowToCollection(infoWindow: any): void {
    this.infoWindows.push(infoWindow);
  }

  protected removeInfoWindowFromCollection(infoWindow: any): void {
    const index = this.infoWindows.indexOf(infoWindow);
    if (index > -1) {
      this.infoWindows.splice(index, 1);
    }
  }

  protected addAnimationToCollection(animation: IAnimation): void {
    this.animations.set(animation.id, animation);
  }

  protected removeAnimationFromCollection(animationId: string): void {
    this.animations.delete(animationId);
  }

  public getMarkers(): IMarker[] {
    return Array.from(this.markers.values());
  }

  public getMarkerClusters(): IMarkerCluster[] {
    return Array.from(this.markerClusters.values());
  }

  public getAnimations(): IAnimation[] {
    return Array.from(this.animations.values());
  }

  public getPolylines(): any[] {
    return [...this.polylines];
  }

  public getPathPlannings(): any[] {
    return [...this.pathPlannings];
  }

  public getInfoWindows(): any[] {
    return [...this.infoWindows];
  }

  protected clearAllMarkers(): void {
    this.markers.forEach((marker) => marker.remove());
    this.markers.clear();
  }

  protected clearAllMarkerClusters(): void {
    this.markerClusters.forEach((cluster) => cluster.remove());
    this.markerClusters.clear();
  }

  protected clearAllPolylines(): void {
    this.polylines.forEach((polyline) => {
      if (polyline && typeof polyline.setMap === "function") {
        polyline.setMap(null);
      }
    });
    this.polylines = [];
  }

  protected clearAllPathPlannings(): void {
    this.pathPlannings.forEach((planning) => {
      if (planning?.remove) {
        planning.remove();
      }
    });
    this.pathPlannings = [];
  }

  protected clearAllInfoWindows(): void {
    this.infoWindows.forEach((infoWindow) => {
      if (infoWindow?.remove) {
        infoWindow.remove();
      }
    });
    this.infoWindows = [];
  }

  protected clearAllAnimations(): void {
    this.animations.forEach((animation) => animation.remove());
    this.animations.clear();
  }

  protected addPolygonToCollection(polygon: IPolygon): void {
    this.polygons.set(polygon.id, polygon);
  }

  protected removePolygonFromCollection(polygonId: string): void {
    this.polygons.delete(polygonId);
  }

  public getPolygons(): IPolygon[] {
    return Array.from(this.polygons.values());
  }

  protected clearAllPolygons(): void {
    this.polygons.forEach((polygon) => polygon.remove());
    this.polygons.clear();
  }
}
