/******************************************************************************
 *
 * GeoViewer Framework v1.0
 *
 * Componente:
 * GeographicLevels.js
 *
 * Descripción:
 * Configuración de los niveles geográficos soportados por el GeoViewer
 * Framework. En esta primera versión se parametrizan únicamente los elementos
 * necesarios para reutilizar el mapa bivariado entre Municipio y Manzana.
 *
 * Desarrollo colaborativo
 * ---------------------------------------------------------------------------
 *
 * Diseño conceptual, arquitectura funcional, integración temática y
 * validación:
 *
 * Josué López Gil
 * Profesional Especializado
 *
 * Arquitectura de software, diseño de componentes y generación asistida
 * mediante Inteligencia Artificial:
 *
 * OpenAI ChatGPT
 *
 ******************************************************************************/

/**
 * Identificadores de niveles geográficos
 */
export const GEOGRAPHIC_LEVELS = {
    DEPARTAMENTO: "departamento",
    MUNICIPIO: "municipio",
    MANZANA: "manzana"
};

/**
 * Configuración de niveles geográficos
 */
export const GEOGRAPHIC_CONFIG = {

    departamento: {

        id: "departamento",

        nombre: "Departamento",

        // El catálogo de este proyecto ofrece los mismos indicadores que
        // Municipio para el nivel departamental.
        filterCode: "M",

        serviceLevel: "DPTO",

        serviceField: "ND",

        navigation: {

            zoomDepartamento: 6,

            zoomMunicipio: 6,

            duration: 1500

        },

        vectorTiles: {

            sourceId: "departamentos-tematicos",

            type: "vector",

            tiles: [
                "https://geoportal.dane.gov.co/laboratorio/serviciosjson/vector-tiles/vectortile.php?params=capas_geovisores/mgn2025_dpto/mgn_2020_dpto_politico/dpto_ccdgo/{z}/{x}/{y}"
            ],

            promoteId: "dpto_ccdgo"

        },

        layers: {

            sourceLayer: "mgn_2020_dpto_politico",

            fill: "departamentos-tematicos-fill",

            line: "departamentos-tematicos-line",

            highlight: "departamento-highlight"

        }

    },

    municipio: {

        id: "municipio",

        nombre: "Municipio",

        filterCode: "M",

        navigation: {

            zoomDepartamento: 7,

            zoomMunicipio: 12,

            duration: 1500

        },

        vectorTiles: {

            sourceId: "municipios",

            type: "vector",

            tiles: [
                "https://geoportal.dane.gov.co/laboratorio/serviciosjson/vector-tiles/vectortile.php?params=capas_geovisores/mgn2025_mpio/mgn_2020_mpio_politico/mpio_cdpmp/{z}/{x}/{y}"
            ],

            promoteId: "mpio_cdpmp"

        },

        layers: {

            sourceLayer: "mgn_2020_mpio_politico",

            fill: "municipios-fill",

            line: "municipios-line",

            highlight: "municipio-highlight"

        }

    },



    manzana: {

        id: "manzana",

        nombre: "Manzana",

        filterCode: "MZ",

        navigation: {

            zoomDepartamento: 7,

            zoomMunicipio: 12,

            duration: 1500

        },

        vectorTiles: {

            sourceId: "manzanas",

            type: "vector",

            tiles: [
                "https://geoportal.dane.gov.co/laboratorio/serviciosjson/vector-tiles/vectortile3.php?params=capas_geovisores/mgn2025_mzn/MGN_2018_URB_MANZANA/cod_dane-viviendas/{z}/{x}/{y}"
            ],

            promoteId: "cod_dane"

        },

        layers: {

            sourceLayer: "MGN_2018_URB_MANZANA",

            fill: "manzanas-fill",

            line: "manzanas-line",

            highlight: "manzana-highlight"

        }

    },



};

/**
 * Nivel por defecto
 */
export const DEFAULT_LEVEL = GEOGRAPHIC_LEVELS.MUNICIPIO;

/**
 * Retorna la configuración del nivel geográfico.
 */
export function getGeographicLevel(level) {

    return GEOGRAPHIC_CONFIG[level] || GEOGRAPHIC_CONFIG[DEFAULT_LEVEL];

}

/**
 * Obtiene la configuración de navegación.
 */
export function getNavigationConfig(level) {

    return getGeographicLevel(level).navigation;

}

/**
 * Obtiene la configuración del Vector Tile.
 */
export function getVectorTileConfig(level) {

    return getGeographicLevel(level).vectorTiles;

}

/**
 * Obtiene la configuración de capas.
 */
export function getLayerConfig(level) {

    return getGeographicLevel(level).layers;

}

/*
==================================================
OBTIENE EL CÓDIGO DE FILTRO DE INDICADORES
==================================================
*/

export function getFilterCode(level) {

    return getGeographicLevel(level).filterCode;

}

/**
 * Obtiene el código utilizado por los servicios (MPIO, MNZN, etc.)
 */
export function getServiceLevel(level) {

    return getGeographicLevel(level).serviceLevel;

}



/**
 * Indica si el nivel requiere filtro geográfico.
 */
export function requiresGeographicFilter(level) {

    return getGeographicLevel(level).requiresFilter;

}

/**
 * Obtiene el filtro geográfico por defecto.
 */
export function getDefaultFilter(level) {

    return getGeographicLevel(level).defaultFilter;

}

/**
 * Campo identificador utilizado para el join.
 */
export function getIdField(level) {

    return getGeographicLevel(level).idField;

}

