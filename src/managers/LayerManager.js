/*
==================================================
LAYER MANAGER
GeoViewer Framework
Versión 2.1
Framework Architecture
==================================================
*/


import {
    DEFAULT_LEVEL,
    getVectorTileConfig,
    getLayerConfig
} from "../config/GeographicLevels";

import BaseManager from "./BaseManager";
import { LAYERS } from "../config/layers";


/*
==================================================
LAYER MANAGER
==================================================
*/

class LayerManager extends BaseManager {


    constructor() {

        super();

        this.currentLevel =
            DEFAULT_LEVEL;

        this.vectorConfig =
            getVectorTileConfig(
                this.currentLevel
            );

        this.layerConfig =
            getLayerConfig(
                this.currentLevel
            );

        console.log(
            "Nivel Geográfico:",
            this.currentLevel
        );

    }


    /*
    ==================================================
    NIVEL GEOGRÁFICO
    ==================================================
    */


    setLevel(level) {

        this.currentLevel = level;


        this.vectorConfig =
            getVectorTileConfig(level);


        this.layerConfig =
            getLayerConfig(level);

        console.log(
            "Nuevo source:",
            this.vectorConfig.sourceId
        );

    }


    getCurrentLevel() {

        return this.currentLevel;

    }



    /*
    ==================================================
    INICIALIZACIÓN
    ==================================================
    */


    initialize(map) {

        super.initialize(map);


        if (!map)
            return;


        this.addSource(map);


        this.addBaseLayers(map);

        this.addHighlightLayers(map);

        this.addDepartmentLayer(map);

    }



    /*
    ==================================================
    SOURCE VECTOR TILE
    ==================================================
    */


    addSource(map) {


        if (!map)
            return;


        const sourceId =
            this.vectorConfig.sourceId;



        if (map.getSource(sourceId))
            return;



        const sourceConfig = {

            type:
                this.vectorConfig.type,


            tiles:
                this.vectorConfig.tiles

        };

        if (this.vectorConfig.promoteId) {

            sourceConfig.promoteId =
                this.vectorConfig.promoteId;

        }

        map.addSource(

            sourceId,

            sourceConfig

        );


    }

    /*
    ==================================================
    FUENTE DEPARTAMENTOS
    ==================================================
    */

    addDepartmentLayer(map) {

        if (map.getSource("departamentos"))
            return;

        map.addSource("departamentos", {

            type: "vector",

            tiles: [

                "https://geoportal.dane.gov.co/laboratorio/serviciosjson/vector-tiles/vectortile3.php?params=capas_geovisores/mgn2025_dpto/mgn2025_dpto/dpto_ccdgo-dpto_cnmbr/{z}/{x}/{y}"

            ]

        });

        if (!map.getLayer("departamentos-line")) {

            map.addLayer({

                id: "departamentos-line",

                type: "line",

                source: "departamentos",

                "source-layer": "mgn2025_dpto",

                paint: {

                    "line-color": "#b721e5",

                    "line-width": 1.0,

                    "line-opacity": 0.9

                }

            });

        }

    }


    /*
    ==================================================
    CAPAS BASE
    ==================================================
    */

    addBaseLayers(map) {

        if (!map)
            return;

        this.createFillLayer(map);

        this.createLineLayer(map);

    }

    createFillLayer(map) {


        const layerId =
            this.layerConfig.fill;



        if (map.getLayer(layerId))
            return;

        map.addLayer({

            id: layerId,


            type: "fill",


            source:
                this.vectorConfig.sourceId,


            "source-layer":
                this.layerConfig.sourceLayer,


            paint: {

                "fill-color":
                    "rgb(222, 221, 221)",

                "fill-opacity":
                    0.8

            }

        });


    }



    createLineLayer(map) {


        const layerId =
            this.layerConfig.line;



        if (map.getLayer(layerId))
            return;



        map.addLayer({


            id: layerId,


            type: "line",


            source:
                this.vectorConfig.sourceId,


            "source-layer":
                this.layerConfig.sourceLayer,


            paint: {


                "line-color":
                    "#f6f7f7",


                "line-width":
                    0.4


            }


        });


    }

    /*
    ==================================================
    CAPAS DE RESALTADO
    ==================================================
    */


    addHighlightLayers(map) {


        if (!map)
            return;


        this.createHighlightLayer(map);


    }



    createHighlightLayer(map) {


        const layerId =
            this.layerConfig.highlight;



        if (map.getLayer(layerId))
            return;



        map.addLayer({


            id: layerId,


            type: "line",


            source:
                this.vectorConfig.sourceId,


            "source-layer":
                this.layerConfig.sourceLayer,

            filter: [

                "==",

                this.vectorConfig.promoteId,

                ""

            ],

            paint: {


                "line-color":
                    "#00FFFF",

                "line-width":
                    3,

                "line-opacity":
                    1

            }


        });


    }

    /*
    ==================================================
    ELIMINAR CAPAS
    ==================================================
    */

    removeLayers(map) {


        if (!map)
            return;

        [
            LAYERS.BIVARIATE_EXTRUSION,
            this.layerConfig.highlight,


            this.layerConfig.line,


            this.layerConfig.fill

        ].forEach(layerId => {

            if (map.getLayer(layerId)) {

                map.removeLayer(layerId);

            }

        });

        // NUEVO
        if (map.getLayer("bivariado-hover")) {

            map.removeLayer("bivariado-hover");

        }

        if (
            map.getSource(
                this.vectorConfig.sourceId
            )
        ) {

            console.log(
                "=================================="
            );

            console.log(
                "Source a eliminar:",
                this.vectorConfig.sourceId
            );

            console.log(
                "Fill:",
                map.getLayer(
                    this.layerConfig.fill
                )
            );

            console.log(
                "Line:",
                map.getLayer(
                    this.layerConfig.line
                )
            );

            console.log(
                "Highlight:",
                map.getLayer(
                    this.layerConfig.highlight
                )
            );

            console.log(
                "bivariado-hover:",
                map.getLayer(
                    "bivariado-hover"
                )
            );

            console.log(
                "=================================="
            );

            map.removeSource(
                this.vectorConfig.sourceId
            );

        }


    }

    /*
    ==================================================
    CAMBIAR NIVEL GEOGRÁFICO
    ==================================================
    */


    changeLevel(map, level) {

        if (!map) return;

        console.log("=== CAMBIO DE NIVEL ===");

        console.log("Antes:", this.currentLevel);

        if (level === this.currentLevel)
            return;

        console.log("1. Eliminando capas");
        this.removeLayers(map);

        console.log("2. Cambiando configuración");
        this.setLevel(level);

        console.log("Config actual:", this.layerConfig);

        console.log("3. Inicializando");
        this.initialize(map);

        console.log(
            "Existe source:",
            map.getSource(
                this.vectorConfig.sourceId
            )
        );

        console.log(
            "Existe fill:",
            map.getLayer(
                this.layerConfig.fill
            )
        );

        console.log(
            "Existe line:",
            map.getLayer(
                this.layerConfig.line
            )
        );

        console.log(
            "Existe highlight:",
            map.getLayer(
                this.layerConfig.highlight
            )
        );

        console.log(
            "Después:",
            this.currentLevel
        );

    }

    /*
    ==================================================
    VISIBILIDAD DE CAPAS
    ==================================================
    */


    setLayerVisibility(map, visible = true) {


        if (!map)
            return;



        const visibility =
            visible
                ? "visible"
                : "none";



        [
            this.layerConfig.fill,


            this.layerConfig.line,


            this.layerConfig.highlight

        ].forEach(layerId => {

            if (map.getLayer(layerId)) {


                map.setLayoutProperty(


                    layerId,


                    "visibility",


                    visibility


                );


            }


        });


    }

    /*
    ==================================================
    CAPA BIVARIADA
    ==================================================
    */

    toggleBivariateLayer(map, visible = true) {


        if (!map)
            return;



        const visibility =
            visible
                ? "visible"
                : "none";



        [


            this.layerConfig.fill,


            this.layerConfig.line

        ].forEach(layerId => {



            if (map.getLayer(layerId)) {


                map.setLayoutProperty(


                    layerId,


                    "visibility",


                    visibility


                );


            }


        });


    }


    /*
    ==================================================
    CAPA DE RESALTADO
    ==================================================
    */


    toggleHighlightLayer(map, visible = true) {


        if (!map)
            return;



        const layerId =
            this.layerConfig.highlight;



        if (!map.getLayer(layerId))
            return;



        map.setLayoutProperty(


            layerId,


            "visibility",


            visible
                ? "visible"
                : "none"


        );


    }


    /*
    ==================================================
    ACTUALIZAR FILTRO DEL RESALTADO
    ==================================================
    */


    updateHighlight(map, value) {


        if (!map)
            return;



        const layerId =
            this.layerConfig.highlight;



        if (!map.getLayer(layerId))
            return;



        map.setFilter(


            layerId,


            [


                "==",


                this.vectorConfig.promoteId,


                value


            ]


        );


    }

        /*
    ==================================================
    RESTABLECER RESALTADO
    ==================================================
    */


    clearHighlight(map) {


        if (!map)
            return;



        const layerId =
            this.layerConfig.highlight;



        if (!map.getLayer(layerId))
            return;



        map.setFilter(


            layerId,


            [


                "==",


                this.vectorConfig.promoteId,


                ""


            ]


        );


    }


    /*
    ==================================================
    EDIFICIOS 3D
    ==================================================
    */


    toggleBuildingsLayer(map, visible = true) {


        if (!map)
            return;

        const layerId =
            "3d-buildings";

        if (!map.getLayer(layerId))
            return;

        map.setLayoutProperty(

            layerId,


            "visibility",


            visible
                ? "visible"
                : "none"


        );


    }


    /*
    ==================================================
    EXISTENCIA
    ==================================================
    */


    hasLayer(map, layerId) {


        if (!map)
            return false;



        return !!map.getLayer(layerId);


    }




    hasSource(map, sourceId) {


        if (!map)
            return false;



        return !!map.getSource(sourceId);


    }

    /*
    ==================================================
    INFORMACIÓN
    ==================================================
    */


    getLayerIds() {


        return {


            fill:
                this.layerConfig.fill,



            line:
                this.layerConfig.line,



            highlight:
                this.layerConfig.highlight



        };


    }




    getSourceId() {


        return this.vectorConfig.sourceId;


    }


}

/*
==================================================
SINGLETON
==================================================
*/

const layerManager =
    new LayerManager();

/*
==================================================
EXPORTACIÓN PRINCIPAL
==================================================
*/

export default layerManager;


/*
==================================================
COMPATIBILIDAD VERSIONES ANTERIORES
==================================================
*/

export function initializeLayers(map) {

    layerManager.initialize(map);

}


export function toggleBuildingsLayer(
    map,
    visible
) {


    layerManager.toggleBuildingsLayer(
        map,
        visible
    );


}


export function toggleBivariateLayer(
    map,
    visible
) {


    layerManager.toggleBivariateLayer(
        map,
        visible
    );


}


export function changeGeographicLevel(
    map,
    level
) {


    layerManager.changeLevel(
        map,
        level
    );


}

export function updateHighlight(
    map,
    value
) {


    layerManager.updateHighlight(
        map,
        value
    );


}


export function clearHighlight(map) {


    layerManager.clearHighlight(map);


}
