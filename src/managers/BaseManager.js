/*
==================================================
BASE MANAGER
GeoViewer Framework
Versión 1.0
==================================================

Clase base para todos los Managers
del GeoViewer Framework.

Todos los managers deberán extender
esta clase.

==================================================
*/

class BaseManager {

    constructor() {

        /*
        ==========================================
        MAPA
        ==========================================
        */

        this.map = null;

        /*
        ==========================================
        ESTADO
        ==========================================
        */

        this.initialized = false;

        this.enabled = true;

        /*
        ==========================================
        CONFIGURACIÓN
        ==========================================
        */

        this.options = {};

        /*
        ==========================================
        CALLBACKS
        ==========================================
        */

        this.callbacks = {};

    }

    /*
    ==================================================
    INICIALIZAR
    ==================================================
    */

    initialize(map, options = {}) {

        this.map = map;

        this.options = options;

        this.initialized = true;

    }

    /*
    ==================================================
    ACTUALIZAR OPCIONES
    ==================================================
    */

    setOptions(options = {}) {

        this.options = {

            ...this.options,

            ...options

        };

    }

    getOptions() {

        return this.options;

    }

    /*
    ==================================================
    MAPA
    ==================================================
    */

    getMap() {

        return this.map;

    }

    hasMap() {

        return this.map !== null;

    }

    /*
    ==================================================
    ESTADO
    ==================================================
    */

    isInitialized() {

        return this.initialized;

    }

    enable() {

        this.enabled = true;

    }

    disable() {

        this.enabled = false;

    }

    isEnabled() {

        return this.enabled;

    }

    /*
    ==================================================
    CALLBACKS
    ==================================================
    */

    setCallback(name, callback) {

        this.callbacks[name] = callback;

    }

    getCallback(name) {

        return this.callbacks[name];

    }

    executeCallback(name, ...args) {

        const callback = this.callbacks[name];

        if (typeof callback === "function") {

            callback(...args);

        }

    }

    clearCallbacks() {

        this.callbacks = {};

    }

    /*
    ==================================================
    LIMPIEZA
    ==================================================
    */

    clear() {

        /*
        Método sobrescribible.
        */

    }

    /*
    ==================================================
    ACTUALIZAR
    ==================================================
    */

    update() {

        /*
        Método sobrescribible.
        */

    }

    /*
    ==================================================
    DESTRUIR
    ==================================================
    */

    destroy() {

        this.clearCallbacks();

        this.options = {};

        this.map = null;

        this.initialized = false;

        this.enabled = true;

    }

}

export default BaseManager;
