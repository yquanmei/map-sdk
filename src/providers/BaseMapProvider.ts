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
  PolylineConfig,
  PolygonConfig,
  IPolyline,
  IPolygon,
  ClearParams,
} from "../types";

export abstract class BaseMapProvider implements IMapProvider {
  protected map: any;
  protected readonly markers: Map<string, IMarker> = new Map();
  protected readonly markerClusters: Map<string, IMarkerCluster> = new Map();
  protected polylines: any[] = [];
  protected readonly polygons: Map<string, IPolygon> = new Map();
  protected pathPlannings: Array<{
    directionsRenderer: any;
    clear?: () => void;
    remove?: () => void;
  }> = [];
  protected infoWindows: any[] = [];
  protected readonly animations: Map<string, IAnimation> = new Map();
  protected config!: MapConfig;

  abstract init(config: MapConfig): Promise<void>;
  abstract addMarker(config: MarkerConfig): Promise<IMarker>;
  abstract clearMarkers(params?: ClearParams<IMarker>): void;
  abstract addMarkerCluster(points: readonly MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster>;
  abstract clearMarkerClusters(params?: ClearParams<IMarkerCluster>): void;
  abstract addAnimation(config: AnimationConfig): Promise<IAnimation>;
  abstract clearAnimations(params?: ClearParams<IAnimation>): void;
  abstract addPolyline(config: PolylineConfig): Promise<IPolyline>;
  abstract clearPolylines(params?: ClearParams<unknown>): void;
  abstract addPolygon(config: PolygonConfig): Promise<IPolygon>;
  abstract clearPolygons(params?: ClearParams<IPolygon>): void;
  abstract clearPathPlannings(params?: ClearParams<unknown>): void;
  abstract clearInfoWindows(params?: ClearParams<unknown>): void;
  abstract addInfoWindow(options: { content: string | HTMLElement; position: readonly [number, number]; open?: boolean }): Promise<any>;
  abstract setCenter(position: readonly [number, number]): void;
  abstract setZoom(zoom: number): void;
  abstract setZoomAndCenter(zoom: number, center: readonly [number, number]): void;
  abstract getZoom(): number;
  abstract setFitView(options?: { padding?: number; maxZoom?: number }): void;
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

  protected addPathPlanningToCollection(pathPlanning: { directionsRenderer: any; clear?: () => void; remove?: () => void }): void {
    this.pathPlannings.push(pathPlanning);
  }

  protected removePathPlanningFromCollection(pathPlanning: { directionsRenderer: any; clear?: () => void; remove?: () => void }): void {
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

  public getMarkers(): readonly IMarker[] {
    return Array.from(this.markers.values());
  }

  public getMarkerClusters(): readonly IMarkerCluster[] {
    return Array.from(this.markerClusters.values());
  }

  public getAnimations(): readonly IAnimation[] {
    return Array.from(this.animations.values());
  }

  public getPolylines(): readonly any[] {
    return [...this.polylines];
  }

  public getPathPlannings(): readonly any[] {
    return [...this.pathPlannings];
  }

  public getInfoWindows(): readonly any[] {
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
        polyline.remove();
      }
    });
    this.polylines.length = 0;
  }

  protected clearAllPathPlannings(): void {
    this.pathPlannings.forEach((planning) => {
      if (planning?.remove) {
        planning.remove();
      }
    });
    this.pathPlannings.length = 0;
  }

  protected clearAllInfoWindows(): void {
    this.infoWindows.forEach((infoWindow) => {
      if (infoWindow && typeof infoWindow.remove === "function") {
        infoWindow.remove();
      }
    });
    this.infoWindows.length = 0;
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

  public getPolygons(): readonly IPolygon[] {
    return Array.from(this.polygons.values());
  }

  protected clearAllPolygons(): void {
    this.polygons.forEach((polygon) => polygon.remove());
    this.polygons.clear();
  }
}
