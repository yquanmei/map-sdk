export interface LoadOptions {
  key: string;
  version: string;
}

// interface PositionWithR {
//   lng: number;
//   lat: number;
// }
// type positionItem = PositionWithR | [number, number] | [number, number, number]
type positionItem =
  | {
      lng: number;
      lat: number;
    }
  | [number, number]
  | [number, number, number];

type PossiblePosition = positionItem[];

export interface CurrentPoint {
  betweenTwoPoint: boolean;
  path: PossiblePosition;
  pathWithRInfo: PossiblePosition;
  allPath: [number, number][];
  animationPath: PossiblePosition;
  shouldConcatBefore: boolean;
  oldPath: PossiblePosition | [];
  animationStatus: string;
  duration: number;
  directResume: boolean;
}

export interface Options {
  container?: string;
  zoom?: number;
  center?: [number, number];
  url?: string;
}

export interface OverlaysArr {
  iconArr: any[];
  infoWindowArr: any[];
  labelInfoWindowArr: any[];
  lineArr: any[];
}

// 类型守卫函数
// export function isLatLngObject(obj: positionItem): obj is { lng: number; lat: number } {
export function isLatLngObject(obj: any): obj is { lng: number; lat: number } {
  return typeof obj === "object" && "lng" in obj && "lat" in obj;
}
