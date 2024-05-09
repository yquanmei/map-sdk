export interface LoadOptions {
    key: string;
    version: string;
}
type positionItem = {
    lng: number;
    lat: number;
} | [number, number] | [number, number, number];
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
export interface LoaderOptions {
    url?: string;
}
export interface OverlaysArr {
    iconArr: any[];
    infoWindowArr: any[];
    labelInfoWindowArr: any[];
    lineArr: any[];
}
export declare function isLatLngObject(obj: any): obj is {
    lng: number;
    lat: number;
};
export {};
