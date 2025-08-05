import { IMapProvider, IMarker, MapConfig, MarkerConfig, MarkerClusterPoint, MarkerClusterOptions, IMarkerCluster } from '../types';

export abstract class BaseMapProvider implements IMapProvider {
  protected map: any;
  protected markers: Map<string, IMarker> = new Map();
  protected markerClusters: Map<string, IMarkerCluster> = new Map();
  protected config!: MapConfig;

  abstract init(config: MapConfig): Promise<void>;
  abstract addMarker(config: MarkerConfig): Promise<IMarker>;
  abstract removeMarker(marker: IMarker): void;
  abstract addMarkerCluster(points: MarkerClusterPoint[], options?: MarkerClusterOptions): Promise<IMarkerCluster>;
  abstract removeMarkerCluster(cluster: IMarkerCluster): void;
  abstract setCenter(position: [number, number]): void;
  abstract setZoom(zoom: number): void;
  abstract destroy(): void;

  protected generateMarkerId(): string {
    return `marker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  protected generateClusterId(): string {
    return `cluster_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

  public getMarkers(): IMarker[] {
    return Array.from(this.markers.values());
  }

  public getMarkerClusters(): IMarkerCluster[] {
    return Array.from(this.markerClusters.values());
  }

  public clearMarkers(): void {
    this.markers.forEach(marker => marker.remove());
    this.markers.clear();
  }

  public clearMarkerClusters(): void {
    this.markerClusters.forEach(cluster => cluster.remove());
    this.markerClusters.clear();
  }
} 