/*
==================================================
NAVIGATION MANAGER
GeoViewer Framework
Versión 2.1
Framework Architecture
==================================================
*/


import BaseManager from "./BaseManager";


import {
    DEFAULT_LEVEL,
    getNavigationConfig,
    getVectorTileConfig,
    getLayerConfig
} from "../config/GeographicLevels";



/*
==================================================
NAVIGATION MANAGER CLASS
==================================================
*/


class NavigationManager extends BaseManager {


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


        this.navigationConfig =
            getNavigationConfig(
                this.currentLevel
            );


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
        
        console.log(
            "NavigationManager inicializado:",
            this.map
        );

    }





    /*
    ==================================================
    CAMBIO DE NIVEL GEOGRÁFICO
    ==================================================
    */


    setLevel(level) {


        this.currentLevel =
            level;



        this.vectorConfig =
            getVectorTileConfig(
                level
            );



        this.layerConfig =
            getLayerConfig(
                level
            );



        this.navigationConfig =
            getNavigationConfig(
                level
            );


    }





    getCurrentLevel() {


        return this.currentLevel;


    }





    /*
    ==================================================
    ZOOM GENÉRICO
    ==================================================
    */


    flyTo(
        coordinates,
        zoom
    ) {


        if (!this.map)
            return;



        if (!coordinates)
            return;



        this.map.flyTo({


            center: coordinates,


            zoom,


            duration:
                this.navigationConfig.duration


        });


    }

    /*
    ==================================================
    ZOOM A DEPARTAMENTO
    ==================================================
    */


    zoomToDepartamento(
        departamento,
        centroidesDepto
    ) {


        if (!this.map)
            return;


        if (!departamento)
            return;



        if (!centroidesDepto)
            return;



        const feature =
            centroidesDepto.find(

                item =>
                    item.id === departamento

            );



        if (!feature) {


            console.warn(

                "Departamento no encontrado:",
                departamento

            );


            return;

        }



        const coordinates =
            feature.geometry.coordinates;



        console.log(

            "ZOOM DEPTO:",
            departamento,
            coordinates

        );



        this.flyTo(

            coordinates,

            this.navigationConfig.zoomDepartamento

        );


    }





    /*
    ==================================================
    ZOOM A NIVEL GEOGRÁFICO
    ==================================================
    */

    zoomToMunicipio(
        municipio,
        centroidesMpio
    ) {

        if (!this.map)
            return;

        if (!municipio)
            return;

        if (!centroidesMpio)
            return;

        const feature =
            centroidesMpio.find(

                item =>
                    item.id === municipio

            );

        if (!feature) {


            console.warn(

                "Municipio no encontrado:",
                municipio

            );


            return;

        }

        const coordinates =
            feature.geometry.coordinates;

        console.log(
            "Feature:",
            feature
        );

        console.log(
            "Coordinates:",
            coordinates
        );

        console.log(
            "Zoom:",
            this.navigationConfig.zoomMunicipio
        );

        console.log(
            "Map:",
            this.map
        );

        console.log(
            "Ejecutando flyTo..."
        );

        console.log(

            "ZOOM MUNICIPIO:",
            municipio,
            coordinates

        );

        this.updateHighlight(
            municipio

        );



        this.flyTo(

            coordinates,

            this.navigationConfig.zoomMunicipio

        );


    }





    /*
    ==================================================
    ACTUALIZAR RESALTADO
    ==================================================
    */


    updateHighlight(value) {


        if (!this.map)
            return;



        const highlightLayer =
            this.layerConfig.highlight;



        if (
            !this.map.getLayer(
                highlightLayer
            )
        )
            return;



        this.map.setFilter(


            highlightLayer,


            [

                "==",


                this.vectorConfig.promoteId,


                value

            ]


        );


    }





    /*
    ==================================================
    LIMPIAR RESALTADO
    ==================================================
    */


    clearHighlight() {


        if (!this.map)
            return;



        const highlightLayer =
            this.layerConfig.highlight;



        if (
            !this.map.getLayer(
                highlightLayer
            )
        )
            return;



        this.map.setFilter(


            highlightLayer,


            [

                "==",


                this.vectorConfig.promoteId,


                ""

            ]


        );


    }



}



/*
==================================================
SINGLETON
==================================================
*/


const navigationManager =
    new NavigationManager();




/*
==================================================
EXPORTACIÓN PRINCIPAL
==================================================
*/


export default navigationManager;





/*
==================================================
COMPATIBILIDAD CON VERSIONES ANTERIORES
==================================================
*/

export function initialize(map) {

    navigationManager.initialize(map);

}


export function zoomToDepartamento(
    map,
    departamento,
    centroidesDepto
) {

    navigationManager.initialize(map);

    navigationManager.zoomToDepartamento(
        departamento,
        centroidesDepto
    );

}


export function zoomToMunicipio(
    map,
    municipio,
    centroidesMpio
) {

    navigationManager.initialize(map);

    navigationManager.zoomToMunicipio(
        municipio,
        centroidesMpio
    );

}

export function setLevel(level) {

    navigationManager.setLevel(
        level
    );

}