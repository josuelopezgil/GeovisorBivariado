import { useEffect, useState } from 'react';
import { FaBuilding, FaChartBar, FaCube, FaFilter, FaLayerGroup, FaMap } from 'react-icons/fa';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import HelpModal from './components/HelpModal';
import RightPanel from './components/RightPanel';
import { GEOGRAPHIC_LEVELS } from './config/GeographicLevels';
import { BASEMAPS } from './config/basemaps';
import LoadingOverlay from "./components/LoadingOverlay";
import NoDataModal from "./components/NoDataModal";

function App() {

  /*
  ==========================================
  VARIABLES BIVARIADAS
  ==========================================
  */

  const [variableA, setVariableA] =
    useState(null);

  const [variableB, setVariableB] =
    useState(null);

  const [departamento, setDepartamento] =
  useState('');

  const [municipio, setMunicipio] =
  useState('');

  const [claseCensal, setClaseCensal] = useState('');
  const [centroPoblado, setCentroPoblado] = useState('');

  const [nombreDepartamento, setNombreDepartamento] =
  useState('');

  const [nombreMunicipio, setNombreMunicipio] =
  useState('');

  const [hoverClase, setHoverClase] =
  useState(null);  

  const [hoverInfo, setHoverInfo] =
  useState(null);

/*
==========================================
NIVEL GEOGRÁFICO
==========================================
*/

const [nivelGeografico, setNivelGeografico] =
  useState(GEOGRAPHIC_LEVELS.MUNICIPIO);

  /*
  ==========================================
  SIDEBAR
  ==========================================
  */

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

   /*
  ==========================================
  PANEL DERECHO
  ==========================================
  */
  
  const [rightPanelOpen, setRightPanelOpen] = 
  useState(true);

  const [mobilePanel, setMobilePanel] = useState(null);


  /*
  ==========================================
  AYUDA
  ==========================================
  */

  const [showHelp, setShowHelp] =
    useState(false);




  /*
  ==========================================
  MAPA BASE
  ==========================================
  */

  const [basemap, setBasemap] =
    useState('estadistico');

  const [basemapBeforeMobile3D, setBasemapBeforeMobile3D] = useState(null);

  
  const [modo3D, setModo3D] =
    useState(false);

  /*
  ==========================================
  ACTIVAR Y DESACTIVAR CAPAS DEL MAPA
  ==========================================
  */
  const [showBivariate, setShowBivariate] = useState(true);
  const [showBuildings, setShowBuildings] = useState(true);
  const [showBivariate3D, setShowBivariate3D] = useState(false);
  const [extrusionVariable, setExtrusionVariable] = useState('A');
  const [extrusionHeights, setExtrusionHeights] = useState({
    [GEOGRAPHIC_LEVELS.MUNICIPIO]: 800,
    [GEOGRAPHIC_LEVELS.DEPARTAMENTO]: 800,
    [GEOGRAPHIC_LEVELS.MANZANA]: 500
  });
  const extrusionMaxHeight = extrusionHeights[nivelGeografico] ?? 800;
  const setExtrusionMaxHeight = (height) => {
    setExtrusionHeights(previous => ({
      ...previous,
      [nivelGeografico]: Number(height)
    }));
  };

  useEffect(() => {
    if (extrusionVariable === 'A' && !variableA && variableB) {
      setExtrusionVariable('B');
    } else if (extrusionVariable === 'B' && !variableB && variableA) {
      setExtrusionVariable('A');
    }
  }, [variableA, variableB, extrusionVariable]);

  /*
  ==========================================
  LOADING GLOBAL
  ==========================================
  */

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] =
    useState("Cargando...");

  const [showNoDataModal, setShowNoDataModal] = useState(false);


  console.log(
      "Nivel geográfico:",
      nivelGeografico
  );

  const availableMobileBasemaps = BASEMAPS.filter(item => item.id !== 'urbano3d');
  const currentMobileBasemap = basemap === 'urbano3d'
    ? basemapBeforeMobile3D || 'estadistico'
    : basemap;
  const currentMobileBasemapIndex = availableMobileBasemaps.findIndex(
    item => item.id === currentMobileBasemap
  );
  const nextMobileBasemap = availableMobileBasemaps[
    (currentMobileBasemapIndex + 1 + availableMobileBasemaps.length) % availableMobileBasemaps.length
  ];

  return (

      <div
        className="geoportal-layout"
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          minWidth: 0,
          minHeight: 0,
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >

      <Sidebar

        mobilePanelOpen={mobilePanel === 'filters'}

        variableA={variableA}
        variableB={variableB}
        setVariableA={setVariableA}
        setVariableB={setVariableB}

        departamento={departamento}
        setDepartamento={setDepartamento}
        setNombreDepartamento={setNombreDepartamento}

        municipio={municipio}
        setMunicipio={setMunicipio}
        setNombreMunicipio={setNombreMunicipio}
        claseCensal={claseCensal}
        setClaseCensal={setClaseCensal}
        centroPoblado={centroPoblado}
        setCentroPoblado={setCentroPoblado}

        nivelGeografico={nivelGeografico}
        setNivelGeografico={setNivelGeografico}

        basemap={basemap}
        setBasemap={setBasemap}

        showHelp={showHelp}
        setShowHelp={setShowHelp}

        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}

        hoverClase={hoverClase}
        setHoverClase={setHoverClase}

        hoverInfo={hoverInfo}

        setLoading={setLoading}

        setLoadingMessage={setLoadingMessage}



      />

      {/* CONTENEDOR DEL MAPA */}

      <div
        className="geoportal-map"
        style={{
          flex: 1,
          position: 'relative',
          minWidth: 0,
          minHeight: 0
        }}
      >

        <MapView

          variableA={variableA}
          variableB={variableB}

          departamento={departamento}
          municipio={municipio}
          claseCensal={claseCensal}
          centroPoblado={centroPoblado}
          nivelGeografico={nivelGeografico}
          basemap={basemap}
          showBivariate={showBivariate}
          hoverClase={hoverClase}
          setHoverClase={setHoverClase}
          setHoverInfo={setHoverInfo}
          showBuildings={showBuildings}
          showBivariate3D={showBivariate3D}
          extrusionVariable={extrusionVariable}
          extrusionMaxHeight={extrusionMaxHeight}
          setLoading={setLoading}
          setLoadingMessage={setLoadingMessage}
          setShowNoDataModal={setShowNoDataModal}

        />

      </div>

      <header className="mobile-map-header">
        <h1>Mapa Bivariado</h1>
        <nav className="mobile-map-tools" aria-label="Accesos rápidos del mapa">
          <button
            type="button"
            className="mobile-map-tool"
            aria-label={`Cambiar mapa base. Actual: ${availableMobileBasemaps.find(item => item.id === currentMobileBasemap)?.nombre || currentMobileBasemap}. Siguiente: ${nextMobileBasemap.nombre}`}
            title={`Mapa base: ${nextMobileBasemap.nombre}`}
            onClick={() => {
              setBasemapBeforeMobile3D(null);
              setBasemap(nextMobileBasemap.id);
            }}
          >
            <FaMap aria-hidden="true" />
            <span>Mapa base</span>
          </button>
          <button
            type="button"
            className="mobile-map-tool"
            aria-label={basemap === 'urbano3d' ? 'Desactivar mapa 3D' : 'Activar mapa 3D'}
            aria-pressed={basemap === 'urbano3d'}
            title="Vista 3D"
            onClick={() => {
              if (basemap === 'urbano3d') {
                setBasemap(basemapBeforeMobile3D || 'estadistico');
                setBasemapBeforeMobile3D(null);
              } else {
                setBasemapBeforeMobile3D(basemap);
                setBasemap('urbano3d');
              }
            }}
          >
            <FaCube aria-hidden="true" />
            <span>Mapa 3D</span>
          </button>
          {variableA && variableB && (
            <button
              type="button"
              className="mobile-map-tool"
              aria-label={showBivariate ? 'Ocultar mapa bivariado' : 'Mostrar mapa bivariado'}
              aria-pressed={showBivariate}
              title="Mapa bivariado"
              onClick={() => setShowBivariate(value => !value)}
            >
              <FaLayerGroup aria-hidden="true" />
              <span>Bivariado</span>
            </button>
          )}
          <button
            type="button"
            className="mobile-map-tool"
            aria-label={showBuildings ? 'Ocultar edificios 3D' : 'Mostrar edificios 3D'}
            aria-pressed={showBuildings}
            title="Edificios 3D"
            onClick={() => setShowBuildings(value => !value)}
          >
            <FaBuilding aria-hidden="true" />
            <span>Edificios</span>
          </button>
          <button
            type="button"
            className="mobile-map-tool"
            aria-label={showBivariate3D ? 'Desactivar extrusión temática 3D' : 'Activar extrusión temática 3D'}
            aria-pressed={showBivariate3D}
            title="Extrusión temática 3D"
            disabled={!variableA || !variableB}
            onClick={() => setShowBivariate3D(value => !value)}
          >
            <FaChartBar aria-hidden="true" />
            <span>Datos 3D</span>
          </button>
        </nav>
      </header>

      {mobilePanel && (
        <button
          className="mobile-panel-backdrop"
          type="button"
          aria-label="Cerrar panel y volver al mapa"
          onClick={() => setMobilePanel(null)}
        />
      )}

      {/* PANEL DERECHO */}

      <RightPanel

        mobilePanelOpen={mobilePanel === 'results'}

        variableA={variableA}
        variableB={variableB}
        departamento={departamento}
        municipio={municipio}
        nombreDepartamento={nombreDepartamento}
        nombreMunicipio={nombreMunicipio}

        hoverClase={hoverClase}
        setHoverClase={setHoverClase}

        hoverInfo={hoverInfo}
        setHoverInfo={setHoverInfo}

        rightPanelOpen={rightPanelOpen}
        setRightPanelOpen={setRightPanelOpen}

        showBivariate={showBivariate}
        setShowBivariate={setShowBivariate}

        showBuildings={showBuildings}
        setShowBuildings={setShowBuildings}
        showBivariate3D={showBivariate3D}
        setShowBivariate3D={setShowBivariate3D}
        nivelGeografico={nivelGeografico}
        extrusionVariable={extrusionVariable}
        setExtrusionVariable={setExtrusionVariable}
        extrusionMaxHeight={extrusionMaxHeight}
        setExtrusionMaxHeight={setExtrusionMaxHeight}

      />

      <nav className="mobile-map-nav" aria-label="Controles del mapa">
        <button
          type="button"
          aria-pressed={mobilePanel === 'filters'}
          onClick={() => {
            setSidebarOpen(true);
            setMobilePanel(current => current === 'filters' ? null : 'filters');
          }}
        >
          <FaFilter aria-hidden="true" />
          <span>Filtros</span>
        </button>
        <button
          type="button"
          aria-pressed={mobilePanel === 'results'}
          onClick={() => {
            setRightPanelOpen(true);
            setMobilePanel(current => current === 'results' ? null : 'results');
          }}
        >
          <FaChartBar aria-hidden="true" />
          <span>Resultados</span>
        </button>
      </nav>

      <HelpModal

        show={showHelp}

        onClose={() =>
          setShowHelp(false)
        }

        variableA={variableA}
        variableB={variableB}

      />

    <LoadingOverlay

        visible={loading}

        message={loadingMessage}

    />

    {showNoDataModal && (
      <NoDataModal
        onClose={() => setShowNoDataModal(false)}
      />
    )}

    </div>


    
    
  );





}




export default App;
