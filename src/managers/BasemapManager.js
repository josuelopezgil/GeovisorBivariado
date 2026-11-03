/*
==================================================
BASEMAP MANAGER
GeoViewer Framework
Versión 2.1
Framework Architecture
==================================================
*/


import BaseManager from "./BaseManager";



/*
==================================================
CONFIGURACIÓN CAPAS BASE
==================================================
*/


const BASEMAP_LAYERS = {


    estadistico:
        "estadistico-layer",


    callejero:
        "callejero-layer",


    satelital:
        "satelital-layer",


    urbano3d:
        "urbano3d-layer",


    noche:
        "noche-layer"


};





/*
==================================================
BASEMAP MANAGER CLASS
==================================================
*/


class BasemapManager extends BaseManager {



    constructor() {


        super();


        this.currentBasemap =
            "noche";


        this.layers =
            BASEMAP_LAYERS;


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



        this.map = map;



    }





    /*
    ==================================================
    CAMBIO DE MAPA BASE
    ==================================================
    */


    changeBasemap(
        basemap
    ) {


        if (!this.map)
            return;



        Object.values(
            this.layers
        ).forEach(layer => {



            if (
                this.map.getLayer(layer)
            ) {


                this.map.setLayoutProperty(


                    layer,


                    "visibility",


                    "none"


                );


            }


        });





        const activeLayer =
            this.layers[basemap];




        if (
            activeLayer &&
            this.map.getLayer(activeLayer)
        ) {



            this.map.setLayoutProperty(


                activeLayer,


                "visibility",


                "visible"


            );



        }



        this.currentBasemap =
            basemap;


    }





    /*
    ==================================================
    OBTENER MAPA BASE ACTUAL
    ==================================================
    */


    getCurrentBasemap() {


        return this.currentBasemap;


    }

        /*
    ==================================================
    ACTUALIZAR CÁMARA
    ==================================================
    */


    updateCamera(
        basemap
    ) {


        if (!this.map)
            return;



        if (basemap === "urbano3d") {


            this.map.easeTo({


                pitch: 60,


                bearing: -20,


                duration: 1200


            });



        } else {



            this.map.easeTo({


                pitch: 0,


                bearing: 0,


                duration: 1200


            });



        }


    }





    /*
    ==================================================
    OBTENER CAPAS BASE
    ==================================================
    */


    getBasemapLayers() {


        return this.layers;


    }





    /*
    ==================================================
    VALIDAR CAPA
    ==================================================
    */


    hasBasemapLayer(
        layerId
    ) {


        if (!this.map)
            return false;



        return !!this.map.getLayer(
            layerId
        );


    }



}





/*
==================================================
SINGLETON
==================================================
*/


const basemapManager =
    new BasemapManager();





/*
==================================================
EXPORTACIÓN PRINCIPAL
==================================================
*/


export default basemapManager;





/*
==================================================
COMPATIBILIDAD VERSIONES ANTERIORES
==================================================
*/


export function initialize(
    map
) {


    basemapManager.initialize(
        map
    );


}





export function changeBasemap(
    map,
    basemap
) {


    basemapManager.initialize(
        map
    );


    basemapManager.changeBasemap(
        basemap
    );


}





export function updateCamera(
    map,
    basemap
) {


    basemapManager.initialize(
        map
    );


    basemapManager.updateCamera(
        basemap
    );


}





export function getBasemapLayers() {


    return basemapManager.getBasemapLayers();


}
