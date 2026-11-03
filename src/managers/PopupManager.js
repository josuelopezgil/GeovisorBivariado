/*
==================================================
POPUP MANAGER
GeoViewer Framework
Versión 1.0
==================================================
*/

import * as maplibregl from "maplibre-gl";

import BaseManager from "./BaseManager";

class PopupManager extends BaseManager {

    constructor() {

        super();

        this.map = null;

        this.popup = null;

        this.clickLayer = null;

        this.featureCallback = null;

    }

    /*
    ==================================================
    INICIALIZAR
    ==================================================
    */

    initialize(map, clickLayer) {

        if (!map)
            return;

        super.initialize(map);

        this.clickLayer = clickLayer;

        this.popup = new maplibregl.Popup({

            closeButton: true,

            closeOnClick: true,

            maxWidth: "320px"

        });

        this.registerEvents();

    }

    /*
    ==================================================
    EVENTOS
    ==================================================
    */

    registerEvents() {

        console.log(
            "POPUP MANAGER REGISTRADO"
        );

        if (!this.map)
            return;

        if (!this.clickLayer)
            return;

        this.map.on(

            "click",

            this.clickLayer,

            (e) => {

                console.log(
                    "CLICK POPUP MANAGER"
                );
                
                if (!e.features.length)
                    return;

                const feature = e.features[0];

                if (this.featureCallback) {

                    this.featureCallback(

                        feature,

                        e.lngLat

                    );

                }

            }

        );

    }

    /*
    ==================================================
    CALLBACK
    ==================================================
    */

    setFeatureCallback(callback) {

        this.featureCallback = callback;

    }

    /*
    ==================================================
    MOSTRAR POPUP
    ==================================================
    */

    show(lngLat, content) {

        if (!this.popup)
            return;

        this.popup

            .setLngLat(lngLat)

            .setHTML(content)

            .addTo(this.map);

    }

    /*
    ==================================================
    CERRAR
    ==================================================
    */

    hide() {

        if (!this.popup)
            return;

        this.popup.remove();

    }

    /*
    ==================================================
    FORMATO NUMÉRICO
    ==================================================
    */

    formatNumber(value) {

        if (
            value === null ||
            value === undefined
        )
            return "-";

        return Number(value)

            .toLocaleString(

                "es-CO",

                {

                    minimumFractionDigits:2,

                    maximumFractionDigits:2

                }

            );

    }

    /*
    ==================================================
    CREAR ATRIBUTO HTML
    ==================================================
    */

    createAttribute(label, value) {

        return `

        <div style="margin-bottom:4px;">

            <b>${label}:</b>

            ${value}

        </div>

        `;

    }

    /*
    ==================================================
    CREAR INDICADOR HTML
    ==================================================
    */

    createIndicator(title, value) {

        return `

        <hr>

        <div
            style="
                font-weight:bold;
                color:#16858f;
                margin-bottom:6px;
            "
        >

            ${title}

        </div>

        <div>

            ${value}

        </div>

        `;

    }

    /*
    ==================================================
    CONSTRUIR POPUP
    ==================================================
    */

    buildPopup(options = {}) {

        const {

            title = "Información",

            attributes = [],

            indicators = []

        } = options;

        let html = `

        <div
            style="
                min-width:260px;
                max-width:320px;
                font-family:Arial,sans-serif;
                font-size:12px;
                line-height:1.4;
            "
        >

            <div
                style="
                    font-size:14px;
                    font-weight:bold;
                    color:#16858f;
                    margin-bottom:10px;
                "
            >

                ${title}

            </div>

        `;

        /*
        ==========================================
        ATRIBUTOS
        ==========================================
        */

        attributes.forEach(attribute => {

            html += this.createAttribute(

                attribute.label,

                attribute.value

            );

        });

        /*
        ==========================================
        INDICADORES
        ==========================================
        */

        indicators.forEach(indicator => {

            html += this.createIndicator(

                indicator.title,

                indicator.value

            );

        });

        html += "</div>";

        return html;

    }

    /*
    ==================================================
    POPUP COMPLETO
    ==================================================
    */

    showPopup(lngLat, options) {

        const html =

            this.buildPopup(options);

        this.show(

            lngLat,

            html

        );

    }

    /*
    ==================================================
    ACTUALIZAR POPUP
    ==================================================
    */

    update(lngLat, options) {

        this.showPopup(

            lngLat,

            options

        );

    }

    /*
    ==================================================
    LIMPIAR
    ==================================================
    */

    clear() {

        this.hide();

    }

    /*
    ==================================================
    DESTRUIR
    ==================================================
    */

    destroy() {

        this.hide();

        this.featureCallback = null;

        this.clickLayer = null;

        super.destroy();

    }

}

/*
==================================================
SINGLETON
==================================================
*/

const popupManager = new PopupManager();

/*
==================================================
EXPORTACIÓN PRINCIPAL
==================================================
*/

export default popupManager;

/*
==================================================
COMPATIBILIDAD
==================================================
*/

export function initializePopup(
    map,
    layer
) {

    popupManager.initialize(

        map,

        layer

    );

}

export function setPopupCallback(
    callback
) {

    popupManager.setFeatureCallback(

        callback

    );

}

export function showPopup(
    lngLat,
    options
) {

    popupManager.showPopup(

        lngLat,

        options

    );

}

export function hidePopup() {

    popupManager.hide();

}

export function destroyPopup() {

    popupManager.destroy();

}
