import { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';

maplibregl.setWorkerUrl(maplibreWorkerUrl);

import {
  obtenerIndicador,
  extraerRegistrosIndicador
} from '../services/geoportalApi';

import {
  clasificarVariable,
  parseIndicatorValue,
  generarCruceBivariado,
  generarExpresionBivariada,
  generarExpresionAlturaExtrusion
} from '../utils/bivariado';

/* import HelpModal from './HelpModal'; */

import { changeBasemap } from '../managers/BasemapManager';

import {

    initializeLayers,

    toggleBivariateLayer,

    toggleBuildingsLayer

} from "../managers/LayerManager";


import {
    zoomToMunicipio
} from "../managers/NavigationManager";




import {
    activate3D,
    deactivate3D,
    addBuildings
} from "../managers/Urban3DManager";

import layerManager from "../managers/LayerManager";
import { getGeographicLevel } from "../config/GeographicLevels";
import * as navigationManager from "../managers/NavigationManager";
import selectionManager from "../managers/SelectionManager";
import popupManager from "../managers/PopupManager";
import indicatorManager from "../managers/IndicatorManager";
import dataManager from "../managers/DataManager";

import {
    getLayerConfig,
    getVectorTileConfig
} from "../config/GeographicLevels";
import { LAYERS } from "../config/layers";

// Keep diagnostic arguments out of the browser console. Logging complete
// centroid collections there makes DevTools retain a second copy of them.
const debugLog = () => {};

function formatearValorIndicador(valor) {
    const numero = parseIndicatorValue(valor);
    if (!Number.isFinite(numero)) return "Sin dato";

    return numero.toLocaleString("es-CO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function filtrarCrucesPorMunicipio(cruce, codigoMunicipio) {
    if (!codigoMunicipio) return cruce;
    return Object.fromEntries(
        Object.entries(cruce || {}).filter(([codigo]) =>
            String(codigo).startsWith(String(codigoMunicipio))
        )
    );
}

function MapView({
  variableA,
  variableB,
  departamento,
  municipio,
  claseCensal,
  centroPoblado,

  nivelGeografico,

  basemap,
  showBivariate,
  showBivariate3D,
  extrusionVariable,
  extrusionMaxHeight,
  hoverClase,
  showBuildings,
  setHoverInfo,
  setLoading,
  setLoadingMessage,
  setShowNoDataModal

}) {
    debugLog(
        "MAPVIEW - DEPARTAMENTO:",
        departamento
    );
    debugLog(
        "MAPVIEW - MUNICIPIO:",
        municipio
    );
    debugLog(
        "MAPVIEW - NIVEL:",
        nivelGeografico
    );


  debugLog(
        "MapView - Nivel geográfico:",
        nivelGeografico
  );

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const popupLayerRef = useRef(null);
  const popupHandlerRef = useRef(null);
  const showBivariate3DRef = useRef(showBivariate3D);
  useEffect(() => {
      showBivariate3DRef.current = showBivariate3D;
  }, [showBivariate3D]);

  const datosARef = useRef({});
  const datosBRef = useRef({});

  const cruceRef = useRef({});
  const bivariateColorExpressionRef = useRef(null);

  const quantilesARef = useRef(null);

  const quantilesBRef = useRef(null);

  
  const nombreVariableARef = useRef('');
  const nombreVariableBRef = useRef('');

  const centroidesDeptoRef = useRef([]);
  const centroidesMpioRef = useRef([]);

  const firstManzanaZoomRef =
    useRef(false);

  const municipiosInfoRef = useRef({});
  const departamentosInfoRef = useRef({});

  const [mapReady, setMapReady] = useState(false);
  const [indicatorDataVersion, setIndicatorDataVersion] = useState(0);

  const latestLoadARef = useRef(0);
  const latestLoadBRef = useRef(0);
  const pendingIndicatorLoadsRef = useRef(new Set());

  const finishIndicatorLoad = useCallback((indicator, requestId, requestRef) => {
      if (requestId !== requestRef.current) return;
      pendingIndicatorLoadsRef.current.delete(indicator);
      if (pendingIndicatorLoadsRef.current.size === 0) {
          setLoading(false);
      }
  }, [setLoading]);

  const frameworkRef = useRef({

      initialized: false,

      level: nivelGeografico

  });

/*
==================================================
FRAMEWORK
==================================================
*/


/*
==================================================
NIVEL MANZANA
==================================================
*/
/* const geographicLevel = "manzana";


const MANZANA_SOURCE = "manzanas";

const MANZANA_LAYER = "MGN_2018_URB_MANZANA";

const MANZANA_TILE_URL =
"https://geoportal.dane.gov.co/laboratorio/serviciosjson/vector-tiles/vectortile3.php?params=capas_geovisores/mgn2025_mzn/MGN_2018_URB_MANZANA/cod_dane-viviendas/{z}/{x}/{y}";
 */

 /*  const [showHelp, setShowHelp] = useState(true); */

/*
==================================================
FRAMEWORK
==================================================
*/

const initializeFramework = (map) => {

    if (!map) return;

    if (frameworkRef.current.initialized) return;

    /*
    LayerManager
    */

    layerManager.initialize(map);

    /*
    Managers que ya implementan initialize()
    */

    selectionManager.initialize(
        map,
        frameworkRef.current.level
    );

    popupManager.initialize(
        map,
        getLayerConfig(
            frameworkRef.current.level
        ).fill
    );

    indicatorManager.initialize(
        map,
        getLayerConfig(
            frameworkRef.current.level
        ).fill
    );

    dataManager.initialize(map);

    /*
    Managers funcionales
    (Navigation y Basemap todavía
    funcionan mediante funciones
    exportadas y no requieren
    initialize()).
    */

    frameworkRef.current.initialized = true;

    debugLog(
        "GeoViewer Framework inicializado."
    );

};

/*
==================================================
REGISTRAR POPUP
==================================================
*/

/*
==================================================
REGISTRO DEL POPUP
==================================================
*/

const registerPopup = (map) => {

    if (!map) return;

    const fillLayer =
        getLayerConfig(
            frameworkRef.current.level
        ).fill;

    debugLog(
        "Registrando Popup para:",
        fillLayer
    );

    if (popupLayerRef.current && popupHandlerRef.current) {
        map.off(
            "click",
            popupLayerRef.current,
            popupHandlerRef.current
        );
    }

    const popupHandler = (e) => {

            if (
                !e.features ||
                !e.features.length
            )
                return;

            const feature =
                e.features[0];

            const properties =
                feature.properties || {};

            debugLog(
                "CLICK SOBRE:",
                fillLayer
            );

            debugLog(
                "PROPIEDADES:",
                properties
            );

            const idField =
                getVectorTileConfig(frameworkRef.current.level).promoteId;
            let codigo = String(
                feature.id ??
                properties[idField] ??
                properties.id ??
                ""
            );

            if (!codigo) return;

            const esManzana =
                frameworkRef.current.level ===
                "manzana";
            const esDepartamento =
                frameworkRef.current.level ===
                "departamento";

            if (esDepartamento) {
                codigo = codigo.padStart(2, "0");
            }

            debugLog(
                "Código:",
                codigo
            );

            debugLog(
                "Nivel:",
                frameworkRef.current.level
            );

            let codigoMunicipio;
            let codigoDepartamento;

            if (esDepartamento) {

                codigoDepartamento = codigo.padStart(2, "0");

            } else if (esManzana) {

                codigoMunicipio =
                    codigo.substring(0,5);

                codigoDepartamento =
                    codigo.substring(0,2);

            }

            else {

                codigoMunicipio =
                    codigo;

                codigoDepartamento =
                    codigo.substring(0,2);

            }

            debugLog(
                "Municipio:",
                codigoMunicipio
            );

            debugLog(
                "Departamento:",
                codigoDepartamento
            );

            const registroA =
                datosARef.current[codigo];

            const registroB =
                datosBRef.current[codigo];

            const clasificacion =
                cruceRef.current[codigo];

            debugLog(
                "Clasificación:",
                clasificacion
            );
                debugLog(
                "Registro A:",
                registroA
            );

            debugLog(
                "Registro B:",
                registroB
            );
              /*
            ============================================
            INFORMACIÓN GEOGRÁFICA
            ============================================
            */

            let nombreMunicipio =
                "No disponible";

            let nombreDepartamento =
                "No disponible";

            if (esDepartamento) {

                nombreDepartamento =
                    departamentosInfoRef.current[codigoDepartamento] ||
                    "No disponible";

            } else if (esManzana) {

                const infoMunicipio =

                    municipiosInfoRef.current[
                        codigoMunicipio
                    ];

                if (infoMunicipio) {

                    nombreMunicipio =
                        infoMunicipio.nombreMunicipio;

                    const codigoDepto =

                        infoMunicipio.codigoDepartamento;

                    nombreDepartamento =

                        departamentosInfoRef.current[
                            codigoDepto
                        ] ||

                        "No disponible";

                }

            }

            else {

                const infoMunicipio =

                    municipiosInfoRef.current[
                        codigo
                    ];

                if (infoMunicipio) {

                    nombreMunicipio =
                        infoMunicipio.nombreMunicipio;

                    const codigoDepto =

                        infoMunicipio.codigoDepartamento;

                    nombreDepartamento =

                        departamentosInfoRef.current[
                            codigoDepto
                        ] ||

                        "No disponible";

                }

            }

            debugLog(

                "Municipio:",

                nombreMunicipio

            );

            debugLog(

                "Departamento:",

                nombreDepartamento

            );

            /*
            ============================================
            INICIO HTML
            ============================================
            */

            let html = "";

            /*
            ============================================
            CABECERA
            ============================================
            */

            html += `

            <div style="
                min-width:260px;
                max-width:300px;
                font-family:Arial,sans-serif;
                font-size:11px;
                line-height:1.35;
            ">

                <div style="
                    font-size:13px;
                    font-weight:bold;
                    color:#16858f;
                    margin-bottom:8px;
                ">
                    Información Territorial
                </div>

                <div style="margin-bottom:4px;">
                    <b>Departamento:</b><br>
                    ${codigoDepartamento} - ${nombreDepartamento}
                </div>

                ${esDepartamento ? "" : `
                    <div style="margin-bottom:4px;">
                        <b>Municipio:</b><br>
                        ${codigoMunicipio} - ${nombreMunicipio}
                    </div>
                `}

            `;

            /*
            ============================================
            MANZANA
            ============================================
            */

            if (esManzana) {

                html += `

                    <div style="margin-bottom:8px;">
                        <b>Manzana:</b><br>
                        ${codigo}
                    </div>

                `;

            }

            /*
            ============================================
            INDICADOR A
            ============================================
            */
            debugLog(
                "Registro A completo:",
                registroA
            );

            if (registroA) {

                html += `

                    <hr style="
                        border:none;
                        border-top:1px solid #DDD;
                    ">

                    <div style="
                        font-weight:bold;
                        color:#16858f;
                        margin-bottom:4px;
                    ">
                        Indicador A
                    </div>

                    <div>

                        <b>

                            ${nombreVariableARef.current}

                        </b>

                        <br>

                        Valor:

                        ${formatearValorIndicador(registroA.PP)}

                        <br>

                        Clase:

                        <b>${clasificacion?.claseA ?? "Sin clasificación"}</b>



                    </div>

                `;

            }

            /*
            ============================================
            INDICADOR B
            ============================================
            */
            debugLog(
                "Registro B completo:",
                registroB
            );

            if (registroB) {

                html += `

                    <hr style="
                        border:none;
                        border-top:1px solid #DDD;
                    ">

                    <div style="
                        font-weight:bold;
                        color:#16858f;
                        margin-bottom:4px;
                    ">
                        Indicador B
                    </div>

                    <div>

                        <b>

                            ${nombreVariableBRef.current}

                        </b>

                        <br>

                        Valor:

                        ${formatearValorIndicador(registroB.PP)}

                        <br>

                        Clase:

                        <b>${clasificacion?.claseB ?? "Sin clasificación"}</b>

                        <br>

                    </div>

                `;

            }

            html += `

                <hr style="
                    border:none;
                    border-top:1px solid #DDD;
                ">

                <div style="
                    font-weight:bold;
                    color:#8B008B;
                    margin-bottom:4px;
                ">
                    Clasificación Bivariada
                </div>

                <div>

                    <b>${clasificacion?.clase ?? "Sin cruce disponible"}</b>

                </div>

            `;

            html += `

            </div>

            `;
            /*
            ============================================
            MOSTRAR POPUP
            ============================================
            */

            new maplibregl.Popup({

                closeButton: true,

                closeOnClick: true,

                maxWidth: "320px"

            })

            .setLngLat(

                e.lngLat

            )

            .setHTML(

                html

            )

            .addTo(

                map

            );

        };

    map.on("click", fillLayer, popupHandler);
    popupLayerRef.current = fillLayer;
    popupHandlerRef.current = popupHandler;

};

useEffect(() => {
    selectionManager.setHoverInfoCallback(setHoverInfo);
    return () => selectionManager.setHoverInfoCallback(null);
}, [setHoverInfo]);

  /*
  ============================================
  MAPA BASE (SOLO UNA VEZ)
  ============================================
  */
  useEffect(() => {

    const map = new maplibregl.Map({
    container: mapContainer.current,
    style: {
        version: 8,
        
        
        sources: {

            callejero: {
                type: 'raster',
                tiles: [
                    'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                ],
                tileSize: 256,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
            },

            estadistico: {
                type: 'raster',
                tiles: [
                    'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
                ],
                tileSize: 256,
                attribution: 'Tiles &copy; Esri'
            },

            urbano3d: {
                type: 'raster',
                tiles: [
                    'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                ],
                tileSize: 256,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
            },

            satelital: {
                type: 'raster',
                tiles: [
                    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                ],
                tileSize: 256,
                attribution: 'Sources: Esri, DigitalGlobe, GeoEye, i-cubed, USDA FSA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community'
            },

            noche: {
                type: 'raster',
                tiles: [
                    'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png'
                ],
                tileSize: 256,
                attribution: '&copy; <a href="https://stadiamaps.com/attribution/">Stadia Maps</a> &copy; Stamen Design &copy; OpenMapTiles &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }

        },


        layers: [

        {
            id: 'estadistico-layer',
            type: 'raster',
            source: 'estadistico',
            layout: {
                visibility: 'none'
            }
        },

        {
            id: 'urbano3d-layer',
            type: 'raster',
            source: 'urbano3d',
            layout: {
                visibility: 'none'
            }
        },
        
        {
            id: 'callejero-layer',
            type: 'raster',
            source: 'callejero',
            layout: {
                visibility: 'none'
            }
        },

        {
            id: 'satelital-layer',
            type: 'raster',
            source: 'satelital',
            layout: {
                visibility: 'none'
            }
        },

        {
            id: 'noche-layer',
            type: 'raster',
            source: 'noche',
            layout: {
                visibility: 'visible'
            }
        }

        ]




    },
    center: [-74.0721, 4.7110],
    zoom: 4.7,
    maxTileCacheSize: 64,
    maxTileCacheZoomLevels: 2
    });



    mapRef.current = map;

    map.addControl(
      new maplibregl.NavigationControl(),
      'top-right'
    );

    map.on('load', () => {

      /************************************************
       * Inicialización del GeoViewer Framework
       ************************************************/

      initializeFramework(map);

      /************************************************
       * Inicialización de capas
       ************************************************/

      initializeLayers(map);

      debugLog(
          "Terrain disponible:",
          typeof map.setTerrain
      );

      setMapReady(true);
    });




    return () => map.remove();

  }, []);






/*
============================================
CAMBIO MAPA BASE
============================================
*/

useEffect(() => {

    const map = mapRef.current;
    if (!map || !mapReady) return;

    changeBasemap(
        map,
        basemap
    );

    if (basemap === "urbano3d") {

        activate3D(map);

    } else {

        deactivate3D(map);

    }

/*     updateCamera(
        mapRef.current,
        basemap
    ); */

}, [basemap, mapReady]);

/*
============================================
VISIBILIDAD CAPA BIVARIADA
============================================
*/

useEffect(() => {

    if (!mapRef.current)
        return;

    toggleBivariateLayer(

        mapRef.current,

        showBivariate

    );

}, [showBivariate]);


/*
============================================
VISIBILIDAD EDIFICIOS 3D
============================================
*/

useEffect(() => {

    const map = mapRef.current;
    if (!map || !mapReady) return;

    if (showBuildings) addBuildings(map);
    toggleBuildingsLayer(map, showBuildings);

}, [showBuildings, mapReady, nivelGeografico]);

/*
============================================
CÁMARA PARA EXTRUSIÓN TEMÁTICA
============================================
*/
useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    if (showBivariate3D) {
        map.easeTo({
            pitch: nivelGeografico === "municipio" ? 68 : 55,
            bearing: -20,
            duration: 700
        });
    } else if (basemap !== "urbano3d") {
        map.easeTo({
            pitch: 0,
            bearing: 0,
            duration: 700
        });
    }
}, [showBivariate3D, basemap, mapReady, nivelGeografico]);

/* Hide the white boundary stroke while thematic polygons are extruded. */
useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const lineLayer = getLayerConfig(nivelGeografico).line;
    if (map.getLayer(lineLayer)) {
        map.setPaintProperty(
            lineLayer,
            "line-opacity",
            showBivariate3D ? 0 : 1
        );
    }
}, [showBivariate3D, nivelGeografico, mapReady]);

/* Las divisiones departamentales distraen sobre la extrusión temática. */
useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !map.getLayer("departamentos-line")) return;

    map.setLayoutProperty(
        "departamentos-line",
        "visibility",
        showBivariate3D ? "none" : "visible"
    );
}, [showBivariate3D, mapReady]);


/*
==================================================
FRAMEWORK
Pendiente migrar a DataManager
==================================================

Los centroides deberán cargarse desde
DataManager para ser reutilizados por:

- NavigationManager
- PopupManager
- SelectionManager
- futuros niveles geográficos.

MapView dejará únicamente la llamada:

await dataManager.loadCentroids();

==================================================
*/

  /*
============================================
CENTROIDES
============================================
*/
useEffect(() => {

  async function cargarCentroides() {

    try {

      const respDepto =
        await fetch(
          'https://geoportal.dane.gov.co/laboratorio/serviciosjson/licencias-construccion/centroides.php?capa=mgn2021_dpto&id=dpto_ccdgo'
        );

      const respMpio =
        await fetch(
          'https://geoportal.dane.gov.co/laboratorio/serviciosjson/licencias-construccion/centroides.php?capa=mgn2021_mpio&id=mpio_cdpmp'
        );

      const dataDepto =
        await respDepto.json();

      const dataMpio =
        await respMpio.json();

      debugLog(
        'CENTROIDES DEPTO:',
        dataDepto
      );

      debugLog(
        'PRIMER DEPTO:',
        dataDepto[0]
      );

      debugLog(
        'CAMPOS DEPTO:',
        Object.keys(dataDepto[0])
      );

/*       debugLog(
        JSON.stringify(
          dataDepto[0],
          null,
          2
        )
      ); */

      debugLog(
        'CENTROIDES MPIO:',
        dataMpio
      );

      debugLog(
        'PRIMER MPIO:',
        dataMpio[0]
      );

      debugLog(
        'CAMPOS MPIO:',
        Object.keys(dataMpio[0])
      );

/*       debugLog(
        JSON.stringify(
          dataMpio[0],
          null,
          2
        )
      ); */


      const geojsonDepto =
        JSON.parse(
          dataDepto[0].geojson
        );

      const geojsonMpio =
        JSON.parse(
          dataMpio[0].geojson
        );

      centroidesDeptoRef.current =
        geojsonDepto.features;

      centroidesMpioRef.current =
        geojsonMpio.features;

      debugLog(
        'PRIMER FEATURE DEPTO:',
        geojsonDepto.features[0]
      );

      debugLog(
        'PRIMER FEATURE MPIO:',
        geojsonMpio.features[0]
      );

    } catch(error) {

      console.error(
        'Error cargando centroides:',
        error
      );

    }

  }

  cargarCentroides();

}, []);

/*
==================================================
FRAMEWORK
PENDIENTE MIGRACIÓN A DATAMANAGER
==================================================

Este bloque será reemplazado por:

const divipola =
    await dataManager.loadDivipola();

departamentosInfoRef.current =
    divipola.departamentos;

municipiosInfoRef.current =
    divipola.municipios;

==================================================
*/


/*
============================================
CATÁLOGO DIVIPOLA
============================================
*/
useEffect(() => {

  async function cargarDivipola() {

    try {

      /*
      DEPARTAMENTOS
      */
      const respDeptos =
        await fetch(
          'https://geoportal.dane.gov.co/laboratorio/serviciosjson/gdivipola/servicios/departamentos.php'
        );

      const dataDeptos =
        await respDeptos.json();

      const deptos = {};

      dataDeptos.resultado.forEach(
        d => {

          deptos[
            d.CODIGO_DEPARTAMENTO
          ] =
            d.NOMBRE_DEPARTAMENTO;

        }
      );

      departamentosInfoRef.current =
        deptos;

      /*
      NIVEL GEOGRÁFICO
      */

      const departamentos =
        dataDeptos.resultado;

      const municipios = {};

      for (const d of departamentos) {

        const respMpio =
          await fetch(
            `https://geoportal.dane.gov.co/laboratorio/serviciosjson/gdivipola/servicios/municipios.php?codigo_departamento=${d.CODIGO_DEPARTAMENTO}`
          );

        const dataMpio =
          await respMpio.json();

        dataMpio.resultado.forEach(
          m => {

            municipios[
              m.CODIGO_DPTO_MPIO
            ] = {

              nombreMunicipio:
                m.NOMBRE_MUNICIPIO,

              codigoDepartamento:
                m.CODIGO_DEPARTAMENTO

            };

          }
        );

      }

      municipiosInfoRef.current =
        municipios;

      debugLog(
        'DIVIPOLA cargado:',
        Object.keys(
          municipios
        ).length,
        'municipios'
      );

    } catch(error) {

      console.error(
        'Error cargando DIVIPOLA',
        error
      );

    }

  }

  cargarDivipola();

}, []);


/*
============================================
ZOOM DEPARTAMENTO
============================================
*/


useEffect(() => {

    navigationManager.zoomToDepartamento(

        mapRef.current,

        departamento,

        centroidesDeptoRef.current

    );

}, [departamento]);


/*
============================================
ZOOM MUNICIPIO
============================================
*/

useEffect(() => {

    navigationManager.zoomToMunicipio(

        mapRef.current,

        municipio,

        centroidesMpioRef.current

    );

}, [municipio]);

useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || nivelGeografico !== 'manzana' || !municipio || !claseCensal) return undefined;

    const controller = new AbortController();
    const where = [
        `COD_MPIO='${String(municipio).padStart(5, '0')}'`,
        `COD_CLAS='${claseCensal}'`,
        centroPoblado ? `COD_CPOB='${String(centroPoblado).replace(/'/g, "''")}'` : null
    ].filter(Boolean).join(' AND ');
    const params = new URLSearchParams({
        where,
        returnGeometry: 'true',
        outFields: 'COD_CPOB,NOM_CPOB',
        outSR: '4326',
        f: 'geojson'
    });

    fetch(`https://geoportal.dane.gov.co/mparcgis/rest/services/MGN2018/Serv_CapasMGN_2018/FeatureServer/305/query?${params}`, { signal: controller.signal })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (controller.signal.aborted) return;
            const features = data.features || [];
            if (!features.length) return;

            const bounds = new maplibregl.LngLatBounds();
            const addCoordinates = coordinates => {
                if (!Array.isArray(coordinates)) return;
                if (coordinates.length >= 2 && coordinates.every(Number.isFinite)) {
                    bounds.extend(coordinates);
                    return;
                }
                coordinates.forEach(addCoordinates);
            };
            features.forEach(feature => addCoordinates(feature.geometry?.coordinates));
            if (!bounds.isEmpty()) {
                map.fitBounds(bounds, {
                    padding: 48,
                    maxZoom: centroPoblado ? 13 : 11,
                    duration: 1100
                });
            }
        })
        .catch(error => {
            if (error.name !== 'AbortError') {
                console.error('No se pudo acercar a la clase censal:', error);
            }
        });

    return () => controller.abort();
}, [centroPoblado, claseCensal, mapReady, municipio, nivelGeografico]);

/*
============================================
RESALTAR CLASE BIVARIADA
============================================
*/
useEffect(() => {
    if (!mapRef.current) return;
    if (!hoverClase) {
        selectionManager.clearHover();
        setHoverInfo(null);
        return;
    }
    selectionManager.updateHover(hoverClase);
}, [hoverClase, setHoverInfo]);

  /*
  ============================================
  UPDATE MAP (BIVARIADO)
  ============================================
  */
  const updateMap = useCallback(() => {

      if (
          !mapRef.current ||
          !mapReady
      ) return;

      if (
          !Object.keys(datosARef.current).length ||
          !Object.keys(datosBRef.current).length
      ) return;

      if (pendingIndicatorLoadsRef.current.size > 0) return;

      setLoading(true);

      setLoadingMessage(
          "Generando mapa bivariado..."
      );

        const resultadoA =
            clasificarVariable(
                datosARef.current
            );

        const resultadoB =
            clasificarVariable(
                datosBRef.current
            );

        const clasesA =
            resultadoA?.clases ?? {};

        const clasesB =
            resultadoB?.clases ?? {};

        if (
            Object.keys(clasesA).length === 0 ||
            Object.keys(clasesB).length === 0
        ) {
            console.warn(
                "No hay valores clasificables para ambos indicadores en el nivel actual.",
                {
                    nivelGeografico,
                    cantidadA: Object.keys(clasesA).length,
                    cantidadB: Object.keys(clasesB).length
                }
            );
            setLoading(false);
            return;
        }

        quantilesARef.current =
            resultadoA;

        quantilesBRef.current =
            resultadoB;

      debugLog(
          "Cantidad clases A:",
          Object.keys(clasesA).length
      );

      debugLog(
          "Primeras clases A:",
          Object.entries(clasesA).slice(0,5)
      );

      debugLog(
          "Cantidad clases B:",
          Object.keys(clasesB).length
      );

      debugLog(
          "Primeras clases B:",
          Object.entries(clasesB).slice(0,5)
      );

      const cruce =
          generarCruceBivariado(
              clasesA,
              clasesB
          );

      debugLog(
          "Cantidad cruces:",
          Object.keys(cruce).length
      );

      debugLog(
          "Primeros cruces:",
          Object.entries(cruce).slice(0,5)
      );

      cruceRef.current = cruce;

      const codigoMunicipioVisible = municipio || "05001";
      const crucesVisibles = nivelGeografico === "manzana"
          ? filtrarCrucesPorMunicipio(cruce, codigoMunicipioVisible)
          : cruce;
      selectionManager.setCrossData(crucesVisibles);

      if (Object.keys(crucesVisibles).length === 0) {
          console.warn(
              "No hay cruces para el municipio visible.",
              { nivelGeografico, municipio: codigoMunicipioVisible }
          );
          setLoading(false);
          return;
      }

      debugLog(
          "Nivel:",
          nivelGeografico
      );

      debugLog(
          "Registros A:",
          Object.keys(
              clasesA
          ).length
      );

      debugLog(
          "Registros B:",
          Object.keys(
              clasesB
          ).length
      );

      debugLog(
          "Cruces:",
          Object.keys(
              cruce
          ).length
      );

      debugLog(
          "Primeros cruces:",
          Object.entries(
              cruce
          ).slice(
              0,
              10
          )
      );

    if (Object.keys(cruce).length === 0) {
        console.warn("No se generaron cruces bivariados para el nivel actual.");
        setLoading(false);
        return;
    }

      const idField =
          getVectorTileConfig(
              nivelGeografico
          ).promoteId || "id";

      const expresion =
          generarExpresionBivariada(
              crucesVisibles,
              idField
          );
      bivariateColorExpressionRef.current = expresion;

      const extrusionLayerId = LAYERS.BIVARIATE_EXTRUSION;
      if (
          showBivariate3DRef.current &&
          mapRef.current?.getLayer(extrusionLayerId)
      ) {
          mapRef.current.setPaintProperty(
              extrusionLayerId,
              "fill-extrusion-color",
              expresion
          );
      }

      debugLog(
          "Campo ID del nivel actual:",
          idField
      );

      debugLog(
          "Longitud expresión:",
          expresion.length
      );

      debugLog(
          "Primeros elementos:",
          expresion.slice(0,20)
      );

      const map =
          mapRef.current;

      const fillLayerId =
          layerManager.layerConfig.fill;

      if (
          !map.getLayer(
              fillLayerId
          )
      ) {

          console.warn(
              "No existe la capa:",
              fillLayerId
          );

          setLoading(false);

          return;

      }

      debugLog(
          "Aplicando simbología sobre:",
          fillLayerId
      );

      debugLog(
          "Longitud expresión:",
          expresion.length
      );

      try {
          map.setPaintProperty(
              fillLayerId,
              "fill-color",
              expresion
          );

          const lineLayerId = getLayerConfig(nivelGeografico).line;
          if (map.getLayer(lineLayerId)) {
              map.setPaintProperty(
                  lineLayerId,
                  "line-opacity",
                  showBivariate3DRef.current ? 0 : 1
              );
          }
      } catch (error) {
          console.error("Error aplicando la expresión bivariada:", error);
      }

      setLoading(false);

  }, [
      mapReady,
      nivelGeografico,
      municipio,
      setLoading,
      setLoadingMessage
  ]);

   

      /*
    ==================================================
    CAMBIO DE NIVEL GEOGRÁFICO
    ==================================================
    */

    useEffect(() => {

        const map = mapRef.current;
        if (!map || !mapReady) return;

        debugLog(
            "Actualizando nivel:",
            nivelGeografico
        );

        frameworkRef.current.level =
            nivelGeografico;

        datosARef.current = {};
        datosBRef.current = {};
        cruceRef.current = {};
        selectionManager.setCrossData({});
        selectionManager.clearHover();

/*         layerManager.setLevel(
            nivelGeografico
        ); */

        layerManager.changeLevel(
          map,
          nivelGeografico
        );

        selectionManager.changeLevel(nivelGeografico);

        const lineLayerId = getLayerConfig(nivelGeografico).line;
        if (map.getLayer(lineLayerId)) {
            map.setPaintProperty(
                lineLayerId,
                "line-opacity",
                showBivariate3DRef.current ? 0 : 1
            );
        }

         registerPopup(
            map
        ); 

        navigationManager.setLevel(
            nivelGeografico
        );

    }, [nivelGeografico, mapReady]);


    /*
    ==================================================
    ZOOM AL ENTRAR A MANZANA
    ==================================================
    */

    useEffect(() => {

        debugLog("=== NAVEGACIÓN MANZANA ===");

        debugLog(
            "mapReady:",
            mapReady
        );

        debugLog(
            "nivel:",
            nivelGeografico
        );

        debugLog(
            "departamento:",
            departamento
        );

        debugLog(
            "municipio:",
            municipio
        );

        debugLog(
            "centroides:",
            centroidesMpioRef.current.length
        );

        if (!mapReady)
            return;

        if (!mapRef.current)
            return;

        if (
            nivelGeografico !== "manzana"
        )
            return;

        if (
            firstManzanaZoomRef.current
        )
            return;

        if (
            !centroidesMpioRef.current.length
        )
            return;

        firstManzanaZoomRef.current =
            true;

        /*
        ==========================================
        MUNICIPIO SELECCIONADO
        ==========================================
        */

        if (
            municipio &&
            municipio.trim() !== ""
        ) {

            debugLog(
                "Zoom Manzana al municipio seleccionado:",
                municipio
            );

            zoomToMunicipio(
                mapRef.current,
                municipio,
                centroidesMpioRef.current
            );

            return;

        }

        /*
        ==========================================
        SIN MUNICIPIO
        ==========================================
        */

        debugLog(
            "Sin municipio seleccionado."
        );

        /*
        ==========================================
        VISTA POR DEFECTO
        ==========================================
        */

        debugLog(
            "Zoom Manzana por defecto a Medellín (05001)"
        );

        zoomToMunicipio(
            mapRef.current,
            "05001",
            centroidesMpioRef.current
        );

    }, [
        mapReady,
        nivelGeografico,
        municipio,
        departamento
    ]);







/*
==================================================
ZOOM NACIONAL AL VOLVER A MUNICIPIO
==================================================
*/

useEffect(() => {

    if (!mapReady)
        return;

    if (!mapRef.current)
        return;

    if (
        nivelGeografico !== "municipio" &&
        nivelGeografico !== "departamento"
    )
        return;

    debugLog(
        "Zoom nacional para el nivel seleccionado"
    );

    mapRef.current.flyTo({

        center: [
            -74.2973,
            4.5709
        ],

        zoom: 4.8,

        duration: 1500

    });

    firstManzanaZoomRef.current =
        false;

}, [

    mapReady,

    nivelGeografico

]);

    /*
    ==================================================
    VARIABLE A
    ==================================================
    */
    useEffect(() => {
        if (!mapReady)
            return;

        if (!variableA) {
            latestLoadARef.current += 1;
            pendingIndicatorLoadsRef.current.delete("A");
            datosARef.current = {};
            if (pendingIndicatorLoadsRef.current.size === 0) {
                setLoading(false);
            }
            return;
        }

        const requestId = ++latestLoadARef.current;
        pendingIndicatorLoadsRef.current.add("A");
        setLoading(true);
        setLoadingMessage("Cargando indicadores del nivel geográfico...");

        async function loadA() {

            const nivelConfig = getGeographicLevel(nivelGeografico);
            const codigoNivel = nivelConfig.serviceLevel || (
                nivelGeografico === "manzana" ? "MNZN" : "MPIO"
            );

            debugLog(
                "DEPARTAMENTO RECIBIDO EN MAPVIEW:",
                departamento
            );
            debugLog(
                "MUNICIPIO RECIBIDO EN MAPVIEW:",
                municipio
            );
            const filtroGeografico =
                nivelGeografico === "manzana"
                    ? departamento
                    : null;
            const data =
                await obtenerIndicador(
                    variableA.COD_SUBGRUPO,
                    codigoNivel,
                    filtroGeografico,
                    nivelConfig.serviceField || null
                );
            nombreVariableARef.current =
                `${variableA.SUBGRUPO} - ${variableA.CATEGORIA}`;
            if (!data?.resultado) {
                finishIndicatorLoad("A", requestId, latestLoadARef);
                return;
            }
            const key =
                variableA.COD_CATEGORIA;
            debugLog(
                "COD CATEGORIA A:",
                variableA.COD_CATEGORIA
            );
            debugLog(
                "CLAVES RESULTADO A:",
                Object.keys(
                    data.resultado
                )
            );
            debugLog(
                "KEY A SELECCIONADA:",
                key
            );
            const registros = extraerRegistrosIndicador(data, variableA);
            if (!registros) {
                console.warn(
                    "⚠️ No hay resultados para la categoría solicitada en el nivel actual; se espera la carga del siguiente nivel.",
                    {
                        nivelGeografico,
                        key,
                        departamento,
                        municipio
                    }
                );
                finishIndicatorLoad("A", requestId, latestLoadARef);
                return;
            }
            debugLog(
                "Nivel:",
                nivelGeografico
            );
            debugLog(
                "Filtro geográfico A:",
                filtroGeografico
            );
            debugLog(
                "Cantidad registros A:",
                Object.keys(
                    registros
                ).length
            );
            debugLog(
                "Primer registro A:",
                registros[
                    Object.keys(
                        registros
                    )[0]
                ]
            );
            if (requestId !== latestLoadARef.current) {
                return;
            }

            datosARef.current =
                registros;
            setIndicatorDataVersion(version => version + 1);
            finishIndicatorLoad("A", requestId, latestLoadARef);
            updateMap();
        }
        loadA().catch(error => {
            console.error("Error cargando el indicador A:", error);
            finishIndicatorLoad("A", requestId, latestLoadARef);
        });
    }, [
        variableA,
        nivelGeografico,
        departamento,
        municipio,
        mapReady,
        updateMap,
        setLoading,
        finishIndicatorLoad,
        setShowNoDataModal
    ]);

/*
==================================================
VARIABLE B
==================================================
*/
useEffect(() => {
    if (!mapReady)
        return;

    if (!variableB) {
        latestLoadBRef.current += 1;
        pendingIndicatorLoadsRef.current.delete("B");
        datosBRef.current = {};
        if (pendingIndicatorLoadsRef.current.size === 0) {
            setLoading(false);
        }
        return;
    }

    const requestId = ++latestLoadBRef.current;
    pendingIndicatorLoadsRef.current.add("B");
    setLoading(true);
    setLoadingMessage("Cargando indicadores del nivel geográfico...");

    async function loadB() {

        const nivelConfig = getGeographicLevel(nivelGeografico);
        const codigoNivel = nivelConfig.serviceLevel || (
            nivelGeografico === "manzana" ? "MNZN" : "MPIO"
        );

        const filtroGeografico =
            nivelGeografico === "manzana"
                ? departamento
                : null;

        const data =
            await obtenerIndicador(
                variableB.COD_SUBGRUPO,
                codigoNivel,
                filtroGeografico,
                nivelConfig.serviceField || null
            );

        nombreVariableBRef.current =
            `${variableB.SUBGRUPO} - ${variableB.CATEGORIA}`;

        if (!data?.resultado) {
            finishIndicatorLoad("B", requestId, latestLoadBRef);
            return;
        }

        const key =
            variableB.COD_CATEGORIA;

        debugLog(
            "COD CATEGORIA B:",
            variableB.COD_CATEGORIA
        );

        debugLog(
            "CLAVES RESULTADO B:",
            Object.keys(
                data.resultado
            )
        );

        debugLog(
            "KEY B SELECCIONADA:",
            key
        );

        const registros = extraerRegistrosIndicador(data, variableB);
        if (!registros) {

            console.warn(
                "⚠️ No hay resultados para la categoría solicitada en el nivel actual; se espera la carga del siguiente nivel.",
                {
                    nivelGeografico,
                    key,
                    departamento,
                    municipio
                }
            );
            finishIndicatorLoad("B", requestId, latestLoadBRef);

            return;

        }

        debugLog(
            "Nivel:",
            nivelGeografico
        );

        debugLog(
            "Filtro geográfico B:",
            filtroGeografico
        );

        debugLog(
            "Cantidad registros B:",
            Object.keys(
                registros
            ).length
        );

        debugLog(
            "Primer registro B:",
            registros[
                Object.keys(
                    registros
                )[0]
            ]
        );

        if (requestId !== latestLoadBRef.current) {
            return;
        }

        datosBRef.current =
            registros;
        setIndicatorDataVersion(version => version + 1);
        finishIndicatorLoad("B", requestId, latestLoadBRef);

        updateMap();

    }

    loadB().catch(error => {
        console.error("Error cargando el indicador B:", error);
        finishIndicatorLoad("B", requestId, latestLoadBRef);
    });

}, [
    variableB,
    nivelGeografico,
    departamento,
    municipio,
    mapReady,
    updateMap,
    setLoading,
    finishIndicatorLoad,
    setShowNoDataModal
]);

/*
============================================
EXTRUSIÓN DEL MAPA BIVARIADO POR VARIABLE A/B
============================================
*/
useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const extrusionLayerId = LAYERS.BIVARIATE_EXTRUSION;
    const existingLayer = map.getLayer(extrusionLayerId);
    if (!showBivariate3D) {
        if (existingLayer) {
            map.setLayoutProperty(extrusionLayerId, "visibility", "none");
        }
        return;
    }

    const datos = extrusionVariable === "B"
        ? datosBRef.current
        : datosARef.current;
    const cruce = cruceRef.current;
    const codigoMunicipioVisible = municipio || "05001";
    const crucesVisibles = nivelGeografico === "manzana"
        ? filtrarCrucesPorMunicipio(cruce, codigoMunicipioVisible)
        : cruce;

    if (
        !Object.keys(datos || {}).length ||
        !Object.keys(crucesVisibles || {}).length
    ) return;

    const vectorConfig = getVectorTileConfig(nivelGeografico);
    const geographicLayers = getLayerConfig(nivelGeografico);
    if (!map.getSource(vectorConfig.sourceId)) return;

    const idField = vectorConfig.promoteId || "id";
    const beforeLayerId = map.getLayer(geographicLayers.line)
        ? geographicLayers.line
        : undefined;

    try {
        const heightExpression = generarExpresionAlturaExtrusion(
            datos,
            idField,
            extrusionMaxHeight * (
                nivelGeografico === "municipio" || nivelGeografico === "departamento"
                    ? 20
                    : nivelGeografico === "manzana"
                        ? 2
                        : 1
            ),
            new Set(Object.keys(crucesVisibles))
        );
        if (existingLayer) {
            map.setLayoutProperty(extrusionLayerId, "visibility", "visible");
            map.setPaintProperty(
                extrusionLayerId,
                "fill-extrusion-height",
                heightExpression
            );
        } else {
            map.addLayer({
                id: extrusionLayerId,
                type: "fill-extrusion",
                source: vectorConfig.sourceId,
                "source-layer": geographicLayers.sourceLayer,
                layout: { visibility: "visible" },
                paint: {
                    "fill-extrusion-color": bivariateColorExpressionRef.current || generarExpresionBivariada(cruce, idField),
                    "fill-extrusion-opacity": 0.9,
                    "fill-extrusion-height": heightExpression,
                    "fill-extrusion-base": 0
                }
            }, beforeLayerId);
        }
    } catch (error) {
        console.error("No se pudo crear la extrusión bivariada:", error);
    }
}, [
    showBivariate3D,
    extrusionVariable,
    extrusionMaxHeight,
    nivelGeografico,
    municipio,
    mapReady,
    indicatorDataVersion
]);


  
  return (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative'
          }}
        >

        <div
          ref={mapContainer}
          style={{
            width: '100%',
            height: '100%'
          }}
        />



        

    </div>
  );

  
}




export default MapView;
