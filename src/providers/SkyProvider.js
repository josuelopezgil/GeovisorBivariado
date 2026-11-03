/*
==================================================
SKY PROVIDER
GeoViewer Framework
==================================================
*/

const SKY_LAYER = "sky-layer";

/*
==================================================
AGREGAR CIELO
==================================================
*/

export function addSky(map) {

    if (!map)
        return;

    if (map.getLayer(SKY_LAYER))
        return;

    map.addLayer({

        id: SKY_LAYER,

        type: "sky",

        paint: {

            "sky-type": "atmosphere",

            "sky-atmosphere-sun": [0, 0],

            "sky-atmosphere-sun-intensity": 10

        }

    });

}

/*
==================================================
MOSTRAR
==================================================
*/

export function showSky(map) {

    if (!map)
        return;

    if (!map.getLayer(SKY_LAYER))
        return;

    map.setLayoutProperty(

        SKY_LAYER,

        "visibility",

        "visible"

    );

}

/*
==================================================
OCULTAR
==================================================
*/

export function hideSky(map) {

    if (!map)
        return;

    if (!map.getLayer(SKY_LAYER))
        return;

    map.setLayoutProperty(

        SKY_LAYER,

        "visibility",

        "none"

    );

}