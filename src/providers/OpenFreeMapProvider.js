/*
==================================================
OPEN FREE MAP PROVIDER
GeoViewer Framework
==================================================
*/

export const OpenFreeMapProvider = {

    id: "openfreemap",

    name: "OpenFreeMap",

    style: "https://tiles.openfreemap.org/styles/bright",

    buildingsSource: "openfreemap",

    buildingsLayer: "building",

    supports3D: true,

    supportsTerrain: false,

    supportsLighting: true

};

/*
==================================================
CREAR SOURCE
==================================================
*/

export function addProviderSource(map) {

    if (!map)
        return;

    if (map.getSource("openfreemap"))
        return;

    map.addSource("openfreemap", {

        type: "vector",

        url: "https://tiles.openfreemap.org/planet",

        attribution: '<a href="https://openfreemap.org/">OpenFreeMap</a> &copy; OpenMapTiles. Data from <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

    });

}

/*
==================================================
CREAR CAPA
==================================================
*/

export function addProviderBuildings(map) {

    if (!map)
        return;

    const beforeLayerId = [
        "manzanas-line",
        "municipios-line",
        "departamentos-tematicos-line"
    ].find(layerId => map.getLayer(layerId));

    if (map.getLayer("3d-buildings")) {
        if (beforeLayerId) map.moveLayer("3d-buildings", beforeLayerId);
        return;
    }

    map.addLayer({

        id: "3d-buildings",

        type: "fill-extrusion",

        source: "openfreemap",

        "source-layer": "building",

        minzoom: 13,

        paint: {

            "fill-extrusion-color": "#d0d0d0",

            "fill-extrusion-opacity": 0.85,

            "fill-extrusion-height": [

                "get",

                "render_height"

            ],

            "fill-extrusion-base": [

                "coalesce",

                ["get", "render_min_height"],

                0

            ]

        }

    }, beforeLayerId);

}

/*
==================================================
ELIMINAR
==================================================
*/

export function removeProviderBuildings(map) {

    if (!map)
        return;

    if (map.getLayer("3d-buildings")) {

        map.removeLayer("3d-buildings");

    }

    if (map.getSource("openfreemap")) {

        map.removeSource("openfreemap");

    }

}

export function hideProviderBuildings(map) {

    if (!map)
        return;

    if (!map.getLayer("3d-buildings"))
        return;

    map.setLayoutProperty(

        "3d-buildings",

        "visibility",

        "none"

    );

}

export function showProviderBuildings(map) {

    if (!map)
        return;

    if (!map.getLayer("3d-buildings"))
        return;

    map.setLayoutProperty(

        "3d-buildings",

        "visibility",

        "visible"

    );

}
