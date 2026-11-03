/*
==================================================
URBAN 3D MANAGER
GeoViewer Framework
==================================================
*/

/*
==================================================
ACTIVAR MODO 3D
==================================================
*/

/* import {

    addSky,

    showSky,

    hideSky

}
from "../providers/SkyProvider"; */


import {

    OpenFreeMapProvider,

    addProviderSource,

    addProviderBuildings,

    removeProviderBuildings

}
from "../providers/OpenFreeMapProvider";

export function activate3D(map) {

    if (!map)
        return;

    map.easeTo({

        pitch: 60,

        bearing: -20,

        duration: 1200

    });

    /*
    ==============================
    SKY
    ==============================
    */

/*     addSky(map);

    showSky(map); */

}

/*
==================================================
DESACTIVAR MODO 3D
==================================================
*/

export function deactivate3D(map) {

    if (!map)
        return;

    map.easeTo({

        pitch: 0,

        bearing: 0,

        duration: 1200

    });

    // La visibilidad de edificios se controla desde la casilla del panel.
    // Cambiar el mapa base solo restablece la cámara y conserva esa selección.

}

/*
==================================================
AGREGAR EDIFICIOS
==================================================
*/

/* export function addBuildings(map) {

    if (!map)
        return;

    if (map.getLayer("3d-buildings"))
        return;

    console.log("Creando capa de edificios...");

} */

export function addBuildings(map) {

    addProviderSource(map);

    addProviderBuildings(map);

}

/*
==================================================
ELIMINAR EDIFICIOS
==================================================
*/

export function removeBuildings(map) {

    removeProviderBuildings(map);

}

/*
==================================================
BUSCAR CAPA DE ETIQUETAS
==================================================
*/

function findLabelLayer(map) {

    const layers = map.getStyle().layers;

    for (const layer of layers) {

        if (

            layer.type === "symbol"

            &&

            layer.layout?.["text-field"]

        ) {

            return layer.id;

        }

    }

    return undefined;

}

/*
==================================================
PROVEEDOR ACTIVO
==================================================
*/

export function getProvider() {

    return OpenFreeMapProvider;

}
