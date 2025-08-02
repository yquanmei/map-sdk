import { IMapProvider, IMarker, MapConfig, MarkerConfig } from '../types';

export abstract class BaseMapProvider implements IMapProvider {
  protected map: any;
  protected markers: Map<string, IMarker> = new Map();
  protected config!: MapConfig;

  abstract init(config: MapConfig): Promise<void>;
  abstract addMarker(config: MarkerConfig): Promise<IMarker>;
  abstract removeMarker(marker: IMarker): void;
  abstract setCenter(position: [number, number]): void;
  abstract setZoom(zoom: number): void;
  abstract destroy(): void;

  protected generateMarkerId(): string {
    return `marker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  protected addMarkerToCollection(marker: IMarker): void {
    this.markers.set(marker.id, marker);
  }

  protected removeMarkerFromCollection(markerId: string): void {
    this.markers.delete(markerId);
  }

  public getMarkers(): IMarker[] {
    return Array.from(this.markers.values());
  }

  public clearMarkers(): void {
    this.markers.forEach(marker => marker.remove());
    this.markers.clear();
  }
} 