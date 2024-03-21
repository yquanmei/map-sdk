export interface LoadOptions {
  key: string;
  version: string;
}

interface PositionWithR {
  lng: number;
  lat: number;
}

type PossiblePosition = (PositionWithR | [number, number] | [number, number, number])[]

export interface CurrentPoint {
  betweenTwoPoint: boolean,
  path: PossiblePosition,
  pathWithRInfo: PossiblePosition,
  allPath: [number, number][],
  animationPath: PossiblePosition,
  shouldConcatBefore: boolean,
  oldPath: PossiblePosition | [],
  animationStatus: string,
  duration: number,
  directResume: boolean,
}