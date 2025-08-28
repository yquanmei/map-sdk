export var MapProvider;
(function (MapProvider) {
    MapProvider["AMAP"] = "amap";
    MapProvider["GOOGLE"] = "google";
    MapProvider["OPENLAYERS"] = "openlayers";
})(MapProvider || (MapProvider = {}));
export var CoveringType;
(function (CoveringType) {
    CoveringType["MARKER"] = "marker";
    CoveringType["CLUSTER"] = "cluster";
    CoveringType["POLYLINE"] = "polyline";
    CoveringType["POLYGON"] = "polygon";
    CoveringType["PATH_PLANNING"] = "path_planning";
    CoveringType["INFO_WINDOW"] = "info_window";
})(CoveringType || (CoveringType = {}));
