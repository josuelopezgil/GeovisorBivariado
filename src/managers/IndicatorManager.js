/*
==================================================
INDICATOR MANAGER
GeoViewer Framework
Versión 1.0
==================================================
*/

import {

    obtenerIndicador

} from "../services/geoportalApi";

import {

    clasificarVariable,

    generarCruceBivariado,

    generarExpresionBivariada

} from "../utils/bivariado";

import BaseManager from "./BaseManager";

class IndicatorManager extends BaseManager {

    constructor() {

        super();
        this.map = null;

        this.layerId = null;

        this.variableA = null;

        this.variableB = null;

        this.nombreVariableA = "";

        this.nombreVariableB = "";

        this.dataA = {};

        this.dataB = {};

        this.crossData = {};

        this.expression = [];

        this.callbacks = {

            update: null,

            loaded: null

        };
        // =====================================
        // CONTEXTO GEOGRÁFICO
        // =====================================

        this.nivelGeografico = "MPIO";

        this.filtroGeografico = null;

    }

    /*
    ==================================================
    INICIALIZAR
    ==================================================
    */

    initialize(map, layerId) {

        super.initialize(map);

        this.layerId = layerId;

    }

    /*
    ==================================================
    CALLBACKS
    ==================================================
    */

    setUpdateCallback(callback) {

        this.callbacks.update = callback;

    }

    setLoadedCallback(callback) {

        this.callbacks.loaded = callback;

    }

    /*
    ==================================================
    VARIABLES
    ==================================================
    */

    setVariables(variableA, variableB) {

        this.variableA = variableA;

        this.variableB = variableB;

    }

    /*
    ==================================================
    NOMBRES
    ==================================================
    */

    getVariableAName() {

        return this.nombreVariableA;

    }

    getVariableBName() {

        return this.nombreVariableB;

    }

    /*
    ==================================================
    DATOS
    ==================================================
    */

    getDataA() {

        return this.dataA;

    }

    getDataB() {

        return this.dataB;

    }

    getCrossData() {

        return this.crossData;

    }

    /*
    ==================================================
    CARGAR VARIABLE A
    ==================================================
    */

    async loadVariableA(variable) {

        if (!variable)
            return;

        this.variableA = variable;

        const response =

            await obtenerIndicador(

            variable.COD_SUBGRUPO,

            this.nivelGeografico,

            this.filtroGeografico

            );

        if (!response?.resultado)
            return;

        const key =

            Object.keys(

                response.resultado

            )[0];

        this.dataA =

            response.resultado[key];

        this.nombreVariableA =

            `${variable.SUBGRUPO} - ${variable.CATEGORIA}`;

        if (this.callbacks.loaded)

            this.callbacks.loaded("A");

    }

    /*
    ==================================================
    CARGAR VARIABLE B
    ==================================================
    */

    async loadVariableB(variable) {

        if (!variable)
            return;

        this.variableB = variable;

        const response =

            await obtenerIndicador(

                variable.COD_SUBGRUPO

            );

        if (!response?.resultado)
            return;

        const key =

            Object.keys(

                response.resultado

            )[0];

        this.dataB =

            response.resultado[key];

        this.nombreVariableB =

            `${variable.SUBGRUPO} - ${variable.CATEGORIA}`;

        if (this.callbacks.loaded)

            this.callbacks.loaded("B");

    }

    /*
    ==================================================
    VALIDACIÓN
    ==================================================
    */

    isReady() {

        return (

            Object.keys(this.dataA).length > 0 &&

            Object.keys(this.dataB).length > 0

        );

    }

        /*
    ==================================================
    CLASIFICACIÓN
    ==================================================
    */

    classify() {

        if (!this.isReady())
            return null;

        const classesA =

            clasificarVariable(

                this.dataA

            );

        const classesB =

            clasificarVariable(

                this.dataB

            );

        this.crossData =

            generarCruceBivariado(

                classesA,

                classesB

            );

        return this.crossData;

    }

    /*
    ==================================================
    EXPRESIÓN MAPLIBRE
    ==================================================
    */

    buildExpression() {

        if (

            !this.crossData ||

            Object.keys(

                this.crossData

            ).length === 0

        )

            return [];

        this.expression =

            generarExpresionBivariada(

                this.crossData

            );

        return this.expression;

    }

    /*
    ==================================================
    ACTUALIZAR MAPA
    ==================================================
    */

    updateMap() {

        if (!this.map)
            return;

        if (!this.layerId)
            return;

        if (!this.isReady())
            return;

        this.classify();

        this.buildExpression();

        if (

            !this.map.getLayer(

                this.layerId

            )

        )

            return;

        this.map.setPaintProperty(

            this.layerId,

            "fill-color",

            this.expression

        );

        if (

            this.callbacks.update

        ) {

            this.callbacks.update(

                this.crossData

            );

        }

    }

    /*
    ==================================================
    ESTADÍSTICAS
    ==================================================
    */

    getStatistics() {

        const statistics = {};

        Object.values(

            this.crossData

        ).forEach(item => {

            const key = item.clase;

            statistics[key] =

                (statistics[key] || 0) + 1;

        });

        return statistics;

    }

    /*
    ==================================================
    MUNICIPIOS POR CLASE
    ==================================================
    */

    getFeaturesByClass(clase) {

        return Object.entries(

            this.crossData

        )

        .filter(

            ([codigo, info]) =>

                info.clase === clase

        )

        .map(

            ([codigo]) => codigo

        );

    }

    /*
    ==================================================
    INFORMACIÓN DE UNA ENTIDAD
    ==================================================
    */

    getFeatureInformation(id) {

        return {

            indicadorA:

                this.dataA[id] || null,

            indicadorB:

                this.dataB[id] || null,

            clase:

                this.crossData[id] || null

        };

    }

    /*
    ==================================================
    VALIDAR EXISTENCIA
    ==================================================
    */

    hasFeature(id) {

        return (

            this.dataA[id] ||

            this.dataB[id]

        );

    }

    /*
    ==================================================
    LIMPIAR INDICADORES
    ==================================================
    */

    clear() {

        this.variableA = null;

        this.variableB = null;

        this.nombreVariableA = "";

        this.nombreVariableB = "";

        this.dataA = {};

        this.dataB = {};

        this.crossData = {};

        this.expression = [];

    }

    /*
    ==================================================
    REFRESCAR
    ==================================================
    */

    refresh() {

        this.updateMap();

    }

        /*
    ==================================================
    CONSULTAS
    ==================================================
    */

    getExpression() {

        return this.expression;

    }

    getClasses() {

        return this.crossData;

    }

    getVariables() {

        return {

            variableA: this.variableA,

            variableB: this.variableB,

            nombreVariableA: this.nombreVariableA,

            nombreVariableB: this.nombreVariableB

        };

    }

    getFeatureClass(id) {

        if (!this.crossData[id])
            return null;

        return this.crossData[id].clase;

    }

    getFeatureValueA(id) {

        return this.dataA[id] || null;

    }

    getFeatureValueB(id) {

        return this.dataB[id] || null;

    }

    /*
    ==================================================
    REINICIALIZAR
    ==================================================
    */

    reset() {

        this.clear();

    }

    /*
    ==================================================
    DESTRUIR
    ==================================================
    */

    destroy() {

        this.clear();

        super.destroy();

        this.layerId = null;

        this.callbacks = {

            update: null,

            loaded: null

        };

    }

}

/*
==================================================
SINGLETON
==================================================
*/

const indicatorManager = new IndicatorManager();

/*
==================================================
EXPORTACIÓN PRINCIPAL
==================================================
*/

export default indicatorManager;

/*
==================================================
COMPATIBILIDAD
==================================================
*/

export function initializeIndicators(
    map,
    layerId
) {

    indicatorManager.initialize(
        map,
        layerId
    );

}

export function loadVariableA(variable) {

    return indicatorManager.loadVariableA(
        variable
    );

}

export function loadVariableB(variable) {

    return indicatorManager.loadVariableB(
        variable
    );

}

export function updateIndicators() {

    indicatorManager.updateMap();

}

export function getCrossData() {

    return indicatorManager.getCrossData();

}

export function getStatistics() {

    return indicatorManager.getStatistics();

}

export function getFeaturesByClass(clase) {

    return indicatorManager.getFeaturesByClass(
        clase
    );

}

export function getFeatureInformation(id) {

    return indicatorManager.getFeatureInformation(
        id
    );

}

export function getVariables() {

    return indicatorManager.getVariables();

}

export function clearIndicators() {

    indicatorManager.clear();

}

export function destroyIndicators() {

    indicatorManager.destroy();

}
