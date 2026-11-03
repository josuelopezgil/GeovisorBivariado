/*
==================================================
DATA MANAGER
GeoViewer Framework
Versión 1.0
==================================================
*/

import BaseManager from "./BaseManager";

class DataManager extends BaseManager {

    constructor() {

        super();

        /*
        ==========================================
        CACHE
        ==========================================
        */

        this.cache = new Map();

        /*
        ==========================================
        CATÁLOGOS
        ==========================================
        */

        this.catalogs = {

            departamentos: [],

            municipios: [],

            variables: [],

            temas: []

        };

        /*
        ==========================================
        DATOS AUXILIARES
        ==========================================
        */

        this.centroides = {};

        this.divipola = {};

        /*
        ==========================================
        SERVICIOS
        ==========================================
        */

        this.services = {};

    }

    /*
    ==================================================
    INICIALIZAR
    ==================================================
    */

    initialize(map, options = {}) {

        super.initialize(map, options);

    }

    /*
    ==================================================
    REGISTRAR SERVICIO
    ==================================================
    */

    registerService(name, url) {

        this.services[name] = url;

    }

    getService(name) {

        return this.services[name];

    }

    /*
    ==================================================
    CONSULTA REST
    ==================================================
    */

    async request(url) {

        if (!url)
            return null;

        const response = await fetch(url);

        if (!response.ok)

            throw new Error(

                `Error ${response.status}`

            );

        return await response.json();

    }

    /*
    ==================================================
    CACHE
    ==================================================
    */

    setCache(key, value) {

        this.cache.set(

            key,

            value

        );

    }

    getCache(key) {

        return this.cache.get(key);

    }

    hasCache(key) {

        return this.cache.has(key);

    }

    clearCache() {

        this.cache.clear();

    }

    /*
    ==================================================
    DIVIPOLA
    ==================================================
    */

    setDivipola(data) {

        this.divipola = data;

    }

    getDivipola() {

        return this.divipola;

    }

    getMunicipio(codigo) {

        return this.divipola[codigo];

    }

    /*
    ==================================================
    CENTROIDES
    ==================================================
    */

    setCentroides(data) {

        this.centroides = data;

    }

    getCentroides() {

        return this.centroides;

    }

    getCentroide(codigo) {

        return this.centroides[codigo];

    }

    /*
    ==================================================
    CATÁLOGOS
    ==================================================
    */

    setCatalog(name, data) {

        this.catalogs[name] = data;

    }

    getCatalog(name) {

        return this.catalogs[name];

    }

    hasCatalog(name) {

        return (

            this.catalogs[name] !== undefined

        );

    }


        /*
    ==================================================
    CARGAR CATÁLOGO DESDE SERVICIO
    ==================================================
    */

    async loadCatalog(name, url) {

        if (this.hasCache(url)) {

            this.catalogs[name] = this.getCache(url);

            return this.catalogs[name];

        }

        const data = await this.request(url);

        this.catalogs[name] = data;

        this.setCache(url, data);

        return data;

    }

    /*
    ==================================================
    CARGAR GEOJSON
    ==================================================
    */

    async loadGeoJSON(url) {

        if (this.hasCache(url)) {

            return this.getCache(url);

        }

        const geojson = await this.request(url);

        this.setCache(url, geojson);

        return geojson;

    }

    /*
    ==================================================
    BÚSQUEDA
    ==================================================
    */

    searchCatalog(name, field, value) {

        if (!this.catalogs[name])

            return null;

        return this.catalogs[name].find(

            item => item[field] === value

        );

    }

    filterCatalog(name, field, value) {

        if (!this.catalogs[name])

            return [];

        return this.catalogs[name].filter(

            item => item[field] === value

        );

    }

    /*
    ==================================================
    INFORMACIÓN
    ==================================================
    */

    getStatistics() {

        return {

            services:

                Object.keys(this.services).length,

            cache:

                this.cache.size,

            catalogs:

                Object.keys(this.catalogs).length,

            municipios:

                Object.keys(this.divipola).length,

            centroides:

                Object.keys(this.centroides).length

        };

    }

    /*
    ==================================================
    LIMPIAR
    ==================================================
    */

    clear() {

        this.clearCache();

        this.catalogs = {

            departamentos: [],

            municipios: [],

            variables: [],

            temas: []

        };

        this.divipola = {};

        this.centroides = {};

        this.services = {};

    }

    /*
    ==================================================
    DESTRUIR
    ==================================================
    */

    destroy() {

        this.clear();

        super.destroy();

    }

}

/*
==================================================
SINGLETON
==================================================
*/

const dataManager = new DataManager();

/*
==================================================
EXPORTACIÓN PRINCIPAL
==================================================
*/

export default dataManager;

/*
==================================================
COMPATIBILIDAD
==================================================
*/

export function initializeDataManager(
    map,
    options
) {

    dataManager.initialize(

        map,

        options

    );

}

export function registerService(
    name,
    url
) {

    dataManager.registerService(

        name,

        url

    );

}

export function loadCatalog(
    name,
    url
) {

    return dataManager.loadCatalog(

        name,

        url

    );

}

export function loadGeoJSON(url) {

    return dataManager.loadGeoJSON(

        url

    );

}

export function getCatalog(name) {

    return dataManager.getCatalog(

        name

    );

}

export function setDivipola(data) {

    dataManager.setDivipola(

        data

    );

}

export function getDivipola() {

    return dataManager.getDivipola();

}

export function setCentroides(data) {

    dataManager.setCentroides(

        data

    );

}

export function getCentroides() {

    return dataManager.getCentroides();

}

export function clearDataManager() {

    dataManager.clear();

}

export function destroyDataManager() {

    dataManager.destroy();

}