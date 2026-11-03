/*
==================================================
SELECTION MANAGER
GeoViewer Framework
Versión 2.1
Framework Architecture
==================================================
*/


import {

    DEFAULT_LEVEL,

    getLayerConfig,

    getVectorTileConfig

} from "../config/GeographicLevels";


import BaseManager from "./BaseManager";




/*
==================================================
SELECTION MANAGER CLASS
==================================================
*/


class SelectionManager extends BaseManager {

    constructor() {
        super();

        this.level =
            DEFAULT_LEVEL;

        this.vectorConfig =
            getVectorTileConfig(
                this.level
            );

        this.layerConfig =
            getLayerConfig(
                this.level
            );

        this.hoverClass =
            null;

        this.hoverInfo =
            null;

        this.crossData =
            {};

        this.selectedFeature =
            null;

        this.hoverLayerId =
            "bivariado-hover";


        this.callbacks = {


            hoverInfo:
                null,
            hoverClass:
                null

        };


    }


    /*
    ==================================================
    INICIALIZACIÓN
    ==================================================
    */


    initialize(
        map,
        level = DEFAULT_LEVEL
    ) {


        if (!map)
            return;



        super.initialize(
            map
        );



        this.level =
            level;



        this.vectorConfig =
            getVectorTileConfig(
                level
            );



        this.layerConfig =
            getLayerConfig(
                level
            );



        this.createHoverLayer();


    }


    /*
    ==================================================
    CREAR CAPA HOVER
    ==================================================
    */

    createHoverLayer() {

        if (!this.map)
            return;

        const style = this.map.getStyle?.();

        if (!style || !Array.isArray(style.layers))
            return;

        if (
            this.map.getLayer(
                this.hoverLayerId
            )
        )
            return;

        console.log(
            "🔎 CAPAS ANTES DE CREAR HOVER:",
            style.layers.map(l => l.id)
        );

        this.map.addLayer({

            id:
                this.hoverLayerId,

            type:
                "line",

            source:
                this.vectorConfig.sourceId,

            "source-layer":
                this.layerConfig.sourceLayer,

            filter:[

                "==",

                this.vectorConfig.promoteId,


                ""

            ],

            paint:{


                "line-color":
                    "#00E5FF",

                "line-width":
                    1.5,

                "line-opacity":
                    1

            }


        });

        console.log(
            "🔎 CAPAS DESPUÉS DE CREAR HOVER:",
            this.map.getStyle?.()?.layers?.map(l => l.id) ?? []
        );


    }

    
    /*
    ==================================================
    CALLBACKS
    ==================================================
    */


    setHoverInfoCallback(callback) {


        this.callbacks.hoverInfo =
            callback;


    }




    setHoverClassCallback(callback) {


        this.callbacks.hoverClass =
            callback;


    }





    /*
    ==================================================
    DATOS DEL CRUCE
    ==================================================
    */


    setCrossData(crossData) {


        this.crossData =
            crossData || {};


    }





    /*
    ==================================================
    LIMPIAR HOVER
    ==================================================
    */


    clearHover() {

        if (!this.map || typeof this.map.getLayer !== 'function')
            return;

        if (
            !this.map.getLayer(
                this.hoverLayerId
            )
        )
            return;


            

        this.map.setFilter(


            this.hoverLayerId,


            [

                "==",


                this.vectorConfig.promoteId,


                ""

            ]


        );



        if (
            this.callbacks.hoverInfo
        )


            this.callbacks.hoverInfo(
                null
            );



        this.hoverInfo =
            null;



    }





    /*
    ==================================================
    ACTUALIZAR HOVER
    ==================================================
    */


    updateHover(
        hoverClass
    ) {


        if (!this.map)
            return;



        this.hoverClass =
            hoverClass;



        if (!hoverClass) {


            this.clearHover();


            return;


        }


        const elementosClase =
            Object.entries(this.crossData)
                .filter(([, info]) => info.clase === hoverClass)
                .map(([codigo]) => codigo);

        console.log("🔎 HOVER CLASE:", hoverClass);
        console.log("🔎 ELEMENTOS:", elementosClase.slice(0, 10));
        console.log("🔎 PROMOTE ID:", this.vectorConfig.promoteId);



        const [
            nivelA,
            nivelB
        ] = hoverClass.split("-");





        const textoClase = {


            "1":
                "Bajo",


            "2":
                "Medio",


            "3":
                "Alto"


        };





        this.hoverInfo = {


            clase:
                hoverClass,


            cantidad:
                elementosClase.length,


            claseA:
                textoClase[nivelA],


            claseB:
                textoClase[nivelB]


        };





        if (
            this.callbacks.hoverInfo
        )

            this.callbacks.hoverInfo(
                this.hoverInfo
            );


        if (
            elementosClase.length === 0
        )
            return;

        console.log("🔎 HOVER LAYER EXISTE:", !!this.map.getLayer(this.hoverLayerId));
        console.log("🔎 HOVER SOURCE:", this.vectorConfig.sourceId);
        console.log("🔎 HOVER SOURCE-LAYER:", this.layerConfig.sourceLayer);

        if (!this.map.getLayer(this.hoverLayerId)) {
            console.warn(
                "⚠️ No existe la capa de hover:",
                this.hoverLayerId
            );
            return;
        }

        this.map.setFilter(
            this.hoverLayerId,
            ["in", this.vectorConfig.promoteId, ...elementosClase]
        );
        console.log(
            "🔎 FILTRO APLICADO:",
            this.map.getFilter(this.hoverLayerId)
        );




    }





    /*
    ==================================================
    SELECCIÓN DE ENTIDADES
    ==================================================
    */


    selectFeature(
        feature
    ) {


        if (!feature)
            return;



        this.selectedFeature =
            feature;


    }





    getSelectedFeature() {


        return this.selectedFeature;


    }





    clearSelection() {


        this.selectedFeature =
            null;


    }


    /*
    ==================================================
    CAMBIAR NIVEL GEOGRÁFICO
    ==================================================
    */

    changeLevel(
        level
    ) {


        this.level =
            level;

        this.vectorConfig =
            getVectorTileConfig(
                level
            );

        this.layerConfig =
            getLayerConfig(
                level
            );


        if (!this.map)
            return;

        if (
            this.map.getLayer(
                this.hoverLayerId
            )
        ) {

            this.map.removeLayer(
                this.hoverLayerId
            );


        }


        this.createHoverLayer();


    }

    
    /*
    ==================================================
    EVENTOS DEL MAPA
    ==================================================
    */


    registerEvents() {


        if (!this.map)
            return;



        /*
        Este método queda preparado
        para centralizar eventos del Framework.

        Ejemplo futuro:

        map.on("mousemove", layer, callback)

        */


    }


    unregisterEvents() {


        if (!this.map)
            return;

        /*
        Aquí se removerán eventos
        registrados mediante map.on()
        */


    }


    /*
    ==================================================
    HIGHLIGHT
    ==================================================
    */


    showHighlight(
        ids = []
    ) {


        if (!this.map)
            return;



        if (
            !this.map.getLayer(
                this.hoverLayerId
            )
        )
            return;




        if (!ids.length) {


            this.clearHover();


            return;


        }


        this.map.setFilter(


            this.hoverLayerId,


            [

                "in",


                this.vectorConfig.promoteId,


                ...ids


            ]


        );


    }


    hideHighlight() {


        this.clearHover();


    }


    /*
    ==================================================
    INFORMACIÓN
    ==================================================
    */


    getHoverInfo() {


        return this.hoverInfo;


    }


    getHoverClass() {


        return this.hoverClass;


    }


    /*
    ==================================================
    LIMPIEZA
    ==================================================
    */


    destroy() {


        if (!this.map)
            return;

        if (
            this.map.getLayer(
                this.hoverLayerId
            )
        ) {


            this.map.removeLayer(
                this.hoverLayerId
            );


        }

        this.hoverClass =
            null;

        this.hoverInfo =
            null;



        this.crossData =
            {};



        this.selectedFeature =
            null;



        super.destroy();


    }



}


/*
==================================================
SINGLETON
==================================================
*/


const selectionManager =
    new SelectionManager();


/*
==================================================
EXPORTACIÓN PRINCIPAL
==================================================
*/


export default selectionManager;

/*
==================================================
COMPATIBILIDAD VERSIONES ANTERIORES
==================================================
*/


export function initializeSelection(
    map,
    level
) {


    selectionManager.initialize(

        map,

        level

    );


}


export function updateHover(
    hoverClass
) {


    selectionManager.updateHover(

        hoverClass

    );


}


export function clearHover() {


    selectionManager.clearHover();


}


export function setCrossData(
    crossData
) {


    selectionManager.setCrossData(

        crossData

    );


}

export function setHoverInfoCallback(
    callback
) {


    selectionManager.setHoverInfoCallback(

        callback

    );


}

export function setHoverClassCallback(
    callback
) {


    selectionManager.setHoverClassCallback(

        callback

    );


}


export function showHighlight(
    ids
) {


    selectionManager.showHighlight(

        ids

    );


}


export function hideHighlight() {


    selectionManager.hideHighlight();


}


export function changeSelectionLevel(
    level
) {


    selectionManager.changeLevel(

        level

    );


}