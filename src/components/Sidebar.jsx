import { useEffect, useState } from 'react';
import BasemapSelector from "./BasemapSelector";
import "./Sidebar.css";
import {
    obtenerCategoriasTematicas,
    obtenerTemas,
    obtenerGrupos,
    obtenerSubTemas
} from "../services/geoportalApi";

import { filterIndicators } from "../utils/IndicatorFilter";
import { filterThemes } from "../utils/ThemeFilter";

import {
  FaQuestionCircle,
  FaMapMarkerAlt,
  FaLayerGroup,
  FaTools
} from 'react-icons/fa';

import {
  FaChevronRight,
  FaChevronLeft,
  FaBars
} from 'react-icons/fa';

import {
  GEOGRAPHIC_LEVELS
} from "../config/GeographicLevels";

const CATEGORIA_GEOVISOR_PREDETERMINADA = {
  COD_GEOVISOR: '4',
  NOMBRE: 'Geovisor 4'
};
const CODIGOS_GEOVISORES_HABILITADOS = new Set(['3', '4', '55', '99']);

const catalogosGeovisorCache = new Map();

function leerCampo(record, candidates) {
  const entry = Object.entries(record || {}).find(([key]) =>
    candidates.includes(key.toUpperCase())
  );
  return entry?.[1];
}

function normalizarCategoriasTematicas(response) {
  const records = [];
  const visited = new Set();

  const collect = value => {
    if (!value || typeof value !== 'object' || visited.has(value)) return;
    visited.add(value);

    if (Array.isArray(value)) {
      value.forEach(collect);
      return;
    }

    const codigo = leerCampo(value, [
      'COD_GEOVISOR', 'CODIGO_GEOVISOR', 'ID_GEOVISOR'
    ]);
    if (codigo !== undefined && codigo !== null && String(codigo).trim()) {
      const nombre = leerCampo(value, [
        'SDM_NOMBREGVS', 'NOMBRE_GEOVISOR', 'NOM_GEOVISOR', 'NOMBRE_SUBDIMENSION',
        'NOM_SUBDIMENSION', 'SUBDIMENSION', 'DESCRIPCION', 'NOMBRE', 'GEOVISOR'
      ]);
      records.push({
        COD_GEOVISOR: String(codigo).trim(),
        NOMBRE: nombre && String(nombre).trim()
          ? String(nombre).trim()
          : `Geovisor ${String(codigo).trim()}`
      });
    }

    Object.values(value).forEach(collect);
  };

  collect(response);

  return records.filter((item, index, list) =>
    list.findIndex(candidate => candidate.COD_GEOVISOR === item.COD_GEOVISOR) === index
  );
}

function obtenerCatalogoGeovisor(codigoGeovisor) {
  const codigo = String(codigoGeovisor);
  if (!catalogosGeovisorCache.has(codigo)) {
    const promise = Promise.all([
      obtenerTemas(codigo),
      obtenerGrupos(codigo),
      obtenerSubTemas(codigo)
    ]).then(([indicadores, grupos, subtemas]) => ({
      indicadores: Array.isArray(indicadores) ? indicadores : [],
      grupos: Array.isArray(grupos) ? grupos : [],
      subtemas: Array.isArray(subtemas) ? subtemas : []
    })).catch(error => {
      catalogosGeovisorCache.delete(codigo);
      throw error;
    });
    catalogosGeovisorCache.set(codigo, promise);
  }

  return catalogosGeovisorCache.get(codigo);
}



function Sidebar({

  mobilePanelOpen = false,

  variableA,
  variableB,
  setVariableA,
  setVariableB,

  departamento,
  setDepartamento,
  setNombreDepartamento,

  municipio,
  setMunicipio,
  setNombreMunicipio,
  claseCensal,
  setClaseCensal,
  centroPoblado,
  setCentroPoblado,

  nivelGeografico,
  setNivelGeografico,

  basemap,
  setBasemap,

  showHelp,
  setShowHelp,

  sidebarOpen,
  setSidebarOpen,

  hoverClase,
  setHoverClase,

  hoverInfo

}) {


  const [catalogoA, setCatalogoA] = useState({ variables: [], grupos: [] });
  const [catalogoB, setCatalogoB] = useState({ variables: [], grupos: [] });
  const [categoriasTematicas, setCategoriasTematicas] = useState([
    CATEGORIA_GEOVISOR_PREDETERMINADA
  ]);
  const [codigoGeovisorA, setCodigoGeovisorA] = useState('4');
  const [codigoGeovisorB, setCodigoGeovisorB] = useState('4');

  const [departamentos, setDepartamentos] =
    useState([]);

  const [municipios, setMunicipios] =
    useState([]);

  const [centrosPoblados, setCentrosPoblados] = useState([]);
  const [cargandoCentrosPoblados, setCargandoCentrosPoblados] = useState(false);

  const [temaA, setTemaA] =
    useState('');

  const [temaB, setTemaB] =
    useState('');

  const [activePanel, setActivePanel] =
    useState('tema');

  /*
  ==========================================
  CARGA DE TEMAS E INDICADORES
  ==========================================
  */
  useEffect(() => {
    const controller = new AbortController();

    obtenerCategoriasTematicas(1, controller.signal)
      .then(response => {
        const categorias = normalizarCategoriasTematicas(response)
          .filter(item => CODIGOS_GEOVISORES_HABILITADOS.has(item.COD_GEOVISOR));
        if (!categorias.length) {
          console.warn('El servicio de dimensiones no devolvió geovisores para la dimensión 1.');
          return;
        }

        setCategoriasTematicas(categorias);
        const codigoInicial = categorias.some(item => item.COD_GEOVISOR === '4')
          ? '4'
          : categorias[0].COD_GEOVISOR;
        setCodigoGeovisorA(current =>
          categorias.some(item => item.COD_GEOVISOR === current) ? current : codigoInicial
        );
        setCodigoGeovisorB(current =>
          categorias.some(item => item.COD_GEOVISOR === current) ? current : codigoInicial
        );
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Error cargando categorías temáticas:', error);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    let vigente = true;

    obtenerCatalogoGeovisor(codigoGeovisorA)
      .then(({ indicadores, grupos, subtemas }) => {
        if (!vigente) return;
        const indicadoresFiltrados = filterIndicators(indicadores, nivelGeografico);
        setCatalogoA({
          variables: indicadoresFiltrados,
          grupos: filterThemes(grupos, subtemas, indicadoresFiltrados)
        });
      })
      .catch(error => {
        if (vigente) {
          console.error(`Error cargando temas del geovisor ${codigoGeovisorA}:`, error);
          setCatalogoA({ variables: [], grupos: [] });
        }
      });

    return () => { vigente = false; };
  }, [codigoGeovisorA, nivelGeografico]);

  useEffect(() => {
    let vigente = true;

    obtenerCatalogoGeovisor(codigoGeovisorB)
      .then(({ indicadores, grupos, subtemas }) => {
        if (!vigente) return;
        const indicadoresFiltrados = filterIndicators(indicadores, nivelGeografico);
        setCatalogoB({
          variables: indicadoresFiltrados,
          grupos: filterThemes(grupos, subtemas, indicadoresFiltrados)
        });
      })
      .catch(error => {
        if (vigente) {
          console.error(`Error cargando temas del geovisor ${codigoGeovisorB}:`, error);
          setCatalogoB({ variables: [], grupos: [] });
        }
      });

    return () => { vigente = false; };
  }, [codigoGeovisorB, nivelGeografico]);
  /*
  ==========================================
  DEPARTAMENTOS
  ==========================================
  */
  useEffect(() => {

    fetch(
      'https://geoportal.dane.gov.co/laboratorio/serviciosjson/gdivipola/servicios/departamentos.php'
    )
      .then(r => r.json())
/*       .then(data => {

        console.log(
          'Departamentos:',
          data
        );

        setDepartamentos(data);

      }) */

      .then(data => {

        console.log(
          'RESPUESTA DEPARTAMENTOS:',
          data
        );

        console.log(
          'PRIMER DEPARTAMENTO:',
          data.resultado[0]
        );

        setDepartamentos(
          data.resultado || []
        );

      })

        
      .catch(console.error);

  }, []);

  /*
  ==========================================
  MUNICIPIOS
  ==========================================
  */
  useEffect(() => {

    if (!departamento) {

      setMunicipios([]);
      return;

    }

    fetch(
      `https://geoportal.dane.gov.co/laboratorio/serviciosjson/gdivipola/servicios/municipios.php?codigo_departamento=${departamento}`
    )
      .then(r => r.json())
      .then(data => {

        console.log(
          'RESPUESTA MUNICIPIOS:',
          data
        );

        console.log(
          'PRIMER MUNICIPIO:',
          data.resultado[0]
        );

        console.log(
          'CAMPOS MUNICIPIO:',
          Object.keys(
            data.resultado[0]
          )
        );

        setMunicipios(
          data.resultado || []
        );

      })



      .catch(console.error);

  }, [departamento]);

  useEffect(() => {
    setCentroPoblado('');
    setCentrosPoblados([]);
    if (!municipio || !departamento || claseCensal !== '2') return undefined;

    const controller = new AbortController();
    const params = new URLSearchParams({ codigo_departamento: String(departamento).padStart(2, '0') });

    setCargandoCentrosPoblados(true);
    fetch(`https://geoportal.dane.gov.co/laboratorio/serviciosjson/gdivipola/servicios/tabla_centros_p.php?${params}`, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        const records = Array.isArray(data)
          ? data
          : data.resultado || data.centros_poblados || data.data || [];
        const readField = (record, names) => {
          const key = Object.keys(record || {}).find(field => names.includes(field.toUpperCase()));
          return key ? record[key] : '';
        };
        const selectedMunicipio = String(municipio).padStart(5, '0');
        const options = records
          .map(record => ({
            COD_CPOB: String(readField(record, ['COD_CPOB', 'CODIGO_CENTRO_POBLADO', 'COD_CENTRO_POBLADO', 'CODIGO_CPOB'])).trim(),
            NOM_CPOB: String(readField(record, ['NOM_CPOB', 'NOMBRE_CENTRO_POBLADO', 'NOMBRE_CENTRO', 'CENTRO_POBLADO'])).trim(),
            COD_MPIO: String(readField(record, ['COD_MPIO', 'CODIGO_DPTO_MPIO', 'CODIGO_MUNICIPIO', 'COD_MUNICIPIO'])).trim().padStart(5, '0')
          }))
          .filter(item => item.COD_CPOB && item.NOM_CPOB && (!item.COD_MPIO || item.COD_MPIO === selectedMunicipio))
          .filter((item, index, list) => list.findIndex(candidate => candidate.COD_CPOB === item.COD_CPOB) === index)
          .sort((a, b) => a.NOM_CPOB.localeCompare(b.NOM_CPOB, 'es'));
        setCentrosPoblados(options);
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Error cargando centros poblados:', error);
          setCentrosPoblados([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargandoCentrosPoblados(false);
      });

    return () => controller.abort();
  }, [departamento, municipio, claseCensal, setCentroPoblado]);




  /*
  ==========================================
  FILTROS TEMÁTICOS
  ==========================================
  */

  const variablesA = temaA
    ? catalogoA.variables.filter(item => String(item.COD_SUBGRUPO || '').startsWith(temaA))
    : catalogoA.variables;

  const variablesB = temaB
    ? catalogoB.variables.filter(item => String(item.COD_SUBGRUPO || '').startsWith(temaB))
    : catalogoB.variables;
    
  const menuButtonStyle = {

  display: 'flex',
  flexDirection: 'column',

  alignItems: 'center',

  justifyContent: 'center',

  border: 'none',

  background: 'transparent',

  cursor: 'pointer',

  color: '#444',

  fontSize: '11px',

  fontWeight: '500',

  gap: '4px',

  minWidth: '56px',

  padding: '4px 2px',

  borderRadius: '6px',

  transition: 'all 0.2s ease'

};


return (

  <div
    className={`geoportal-sidebar${mobilePanelOpen ? ' mobile-open' : ''}`}
    style={{
      width: sidebarOpen ? '300px' : '48px',

      minWidth: sidebarOpen ? '300px' : '48px',

      height: '100%',
      fontSize: '13px',
      lineHeight: 1.4,
      textAlign: 'left',

      display: 'flex',
      flexDirection: 'column',

      transition: 'all 0.3s ease',

      borderRight: '1px solid #ddd',

      background: '#ffffff',

      overflow: 'hidden',

      boxShadow:
        '2px 0 6px rgba(0,0,0,0.06)',

      zIndex: 100
    }}
  >
      
      {/* ===================================== */}
      {/* CABECERA */}
      {/* ===================================== */}

      <div
        style={{
          height: '52px',

          display: 'flex',

          alignItems: 'center',

          justifyContent:
            sidebarOpen
              ? 'space-between'
              : 'center',

          padding:
            sidebarOpen
              ? '0 12px'
              : '0',

          borderBottom:
            '1px solid #e5e5e5',

          background:
            '#fafafa'
        }}
      >

        {

        sidebarOpen && (

          <div
            style={{
              fontWeight: 'bold',
              color: '#16858f'
            }}
          >

            Geovisor Bivariado de Informaci&#243;n Sociodemogr&#225;fica

          </div>

        )

        }

        <button
          className="sidebar-collapse-button"

          onClick={() =>
            setSidebarOpen(
              !sidebarOpen
            )
          }

          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            color: '#16858f',

            width: '40px',
            height: '40px',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            borderRadius: '4px'
          }}
        >

          {

          sidebarOpen
            ? <FaChevronLeft />
            : <FaBars />

          }

        </button>

      </div>      

      {
    
    sidebarOpen && (

      <div
        className="sidebar-content"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px'
        }}
      >





      {/* =====================================
          MENÚ GEOPORTAL
      ===================================== */}

      <div
        className="sidebar-navigation"
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginBottom: '10px',
          padding: '7px 4px',
          gap: '3px',
          borderBottom: '1px solid #ddd',
          background: '#fafafa'
        }}
      >

        {/* AYUDA */}

        <button
          className="sidebar-navigation-button"
          onClick={() =>
            setShowHelp(true)
          }
          style={menuButtonStyle}
        >

          <FaQuestionCircle
            size={24}
            color="#11c2d2"
          />

          <span>
            Ayuda
          </span>

        </button>

        {/* UBICACIÓN */}

        <button
          className="sidebar-navigation-button"
          onClick={() =>
            setActivePanel(
              'ubicacion'
            )
          }
          style={menuButtonStyle}
        >

          <FaMapMarkerAlt
            size={24}
            color={
              activePanel === 'ubicacion'
                ? '#11c2d2'
                : '#777'
            }
          />

          <span>
            Ubicación
          </span>

        </button>

        {/* TEMA */}

        <button
          className="sidebar-navigation-button"
          onClick={() =>
            setActivePanel(
              'tema'
            )
          }
          style={menuButtonStyle}
        >

          <FaLayerGroup
            size={24}
            color={
              activePanel === 'tema'
                ? '#11c2d2'
                : '#777'
            }
          />

          <span>
            Tema
          </span>

        </button>

        {/* HERRAMIENTAS */}

        <button
          className="sidebar-navigation-button"
          onClick={() =>
            setActivePanel(
              'herramientas'
            )
          }
          style={menuButtonStyle}
        >

          <FaTools
            size={24}
            color={
              activePanel === 'herramientas'
                ? '#11c2d2'
                : '#777'
            }
          />

          <span>
            Herr.
          </span>

        </button>

      </div>




      {/* =====================================
          UBICACIÓN
      ===================================== */}

      {activePanel === 'ubicacion' && (

        <>

          <h3>Ubicación</h3>

          <label>
            Departamento
          </label>

          <select
            value={departamento}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '10px'
            }}
            onChange={(e) => {
              const codigoDepartamento = e.target.value;
              const departamentoSeleccionado = departamentos.find(
                dep => String(dep.CODIGO_DEPARTAMENTO) === codigoDepartamento
              );

              setDepartamento(codigoDepartamento);
              setNombreDepartamento(
                departamentoSeleccionado?.NOMBRE_DEPARTAMENTO || ''
              );

              setMunicipio('');
              setNombreMunicipio('');
              setClaseCensal('');
              setCentroPoblado('');

            }}
          >

            <option value="">
              Seleccione...
            </option>

            {Array.isArray(departamentos) &&
              departamentos.map((dep) => (

                <option
                  key={dep.CODIGO_DEPARTAMENTO}
                  value={dep.CODIGO_DEPARTAMENTO}
                >
                  {dep.NOMBRE_DEPARTAMENTO}
                </option>

            ))}

          </select>

          <label>
            Municipio
          </label>

          <select
            value={municipio}
            style={{
              width: '100%',
              padding: '8px'
            }}
            onChange={(e) => {
              const codigoMunicipio = e.target.value;
              const municipioSeleccionado = municipios.find(
                mun => String(mun.CODIGO_DPTO_MPIO) === codigoMunicipio
              );

              setMunicipio(codigoMunicipio);
              setNombreMunicipio(
                municipioSeleccionado?.NOMBRE_MUNICIPIO || ''
              );
              setClaseCensal('');
              setCentroPoblado('');
            }}
          >

            <option value="">
              Seleccione un municipio
            </option>

            {Array.isArray(municipios) &&
              municipios.map((mun) => (

                <option
                  key={`mun-${mun.CODIGO_DPTO_MPIO}`}
                  value={mun.CODIGO_DPTO_MPIO}
                >
                  {mun.NOMBRE_MUNICIPIO}
                </option>

            ))}

          </select>

          <label htmlFor="clase-censal">Clase censal</label>
          <select
            id="clase-censal"
            value={claseCensal}
            onChange={event => {
              setClaseCensal(event.target.value);
              setCentroPoblado('');
            }}
          >
            <option value="">Todas las clases</option>
            <option value="1">1 - Cabecera</option>
            <option value="2">2 - Centro poblado</option>
            <option value="3">3 - Rural disperso</option>
          </select>

          {claseCensal === '2' && (
            <>
              <label htmlFor="centro-poblado">Centro poblado</label>
              <select
                id="centro-poblado"
                value={centroPoblado}
                disabled={!municipio || cargandoCentrosPoblados || centrosPoblados.length === 0}
                onChange={event => setCentroPoblado(event.target.value)}
              >
                <option value="">
                  {cargandoCentrosPoblados ? 'Cargando centros poblados…' : 'Seleccione un centro poblado'}
                </option>
                {centrosPoblados.map(item => (
                  <option key={item.COD_CPOB} value={item.COD_CPOB}>
                    {item.COD_CPOB} - {item.NOM_CPOB}
                  </option>
                ))}
              </select>
            </>
          )}

        </>

      )}

      {/* =====================================
          TEMAS
      ===================================== */}

      {activePanel === 'tema' && (

        <>

          {/* =====================================
              SELECCION DE NIVEL GEOGRÁFICO
          ===================================== */}

          <hr />

          <h5
            style={{
              color: "#16858f",
              marginBottom: "10px"
            }}
          >
            Selección de Nivel
          </h5>

          <label
            style={{
              display: "block",
              marginBottom: "8px",
              cursor: "pointer"
            }}
          >

            <input
              type="radio"
              value={GEOGRAPHIC_LEVELS.DEPARTAMENTO}
              checked={nivelGeografico === GEOGRAPHIC_LEVELS.DEPARTAMENTO}
              onChange={(e) => setNivelGeografico(e.target.value)}
            />

            {" "}
            Departamento

          </label>

          <label
            style={{
              display: "block",
              marginBottom: "8px",
              cursor: "pointer"
            }}
          >

            <input
              type="radio"
              value={GEOGRAPHIC_LEVELS.MUNICIPIO}
              checked={
                nivelGeografico ===
                GEOGRAPHIC_LEVELS.MUNICIPIO
              }
              onChange={(e) => setNivelGeografico(e.target.value)}
            />

            {" "}
            Municipio

          </label>

          <label
            style={{
              display: "block",
              marginBottom: "15px",
              cursor: "pointer"
            }}
          >

            <input
              type="radio"
              value={GEOGRAPHIC_LEVELS.MANZANA}
              checked={
                nivelGeografico ===
                GEOGRAPHIC_LEVELS.MANZANA
              }
              onChange={(e) => setNivelGeografico(e.target.value)}
            />

            {" "}
            Manzana

          </label>

          <hr />

          {/* =====================================
              SELECCION DE TEMAS
          ===================================== */}

          <section className="variable-filter variable-filter-a" aria-label="Filtros de la Variable A">
          <h5>
            Seleccione la variable A
          </h5>

          <label htmlFor="categoria-tematica-a">
            Categorías temáticas
          </label>

          <select
            id="categoria-tematica-a"
            value={codigoGeovisorA}
            aria-label="Categorías temáticas de la Variable A"
            onChange={event => {
              const codigo = event.target.value;
              setCodigoGeovisorA(codigo);
              setTemaA('');
              setVariableA(null);
              setCatalogoA({ variables: [], grupos: [] });
            }}
          >
            {categoriasTematicas.map(categoria => (
              <option key={`categoria-a-${categoria.COD_GEOVISOR}`} value={categoria.COD_GEOVISOR}>
                {categoria.NOMBRE}
              </option>
            ))}
          </select>

          <label>
            Tema
          </label>

          <select
            value={temaA}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '10px'
            }}
            onChange={(e) => {

              setTemaA(
                e.target.value
              );

              setVariableA(null);

            }}
          >

            <option value="">
              Todos los temas
            </option>

            {catalogoA.grupos.map(grupo => (

              <option
                key={grupo.COD_GRUPO}
                value={grupo.COD_GRUPO}
              >

                {grupo.COD_GRUPO}
                {' - '}
                {grupo.GRUPO}

              </option>

            ))}

          </select>

          <label>
            Indicador
          </label>

          <select
            className="indicator-select"
            value={variableA ? JSON.stringify(variableA) : ''}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '15px'
            }}
            onChange={(e) => {

              if (!e.target.value)
                return;

              setVariableA(
                JSON.parse(
                  e.target.value
                )
              );

            }}
          >

            <option value="">
              Seleccione...
            </option>

            {variablesA.map(item => (

              <option
                key={`A-${item.COD_CATEGORIA}`}
                value={JSON.stringify(item)}
              >

                {item.SUBGRUPO}
                {' - '}
                {item.CATEGORIA}

              </option>

            ))}

          </select>

          </section>

          <section className="variable-filter variable-filter-b" aria-label="Filtros de la Variable B">
          <h5>
            Seleccione la variable B
          </h5>

          <label htmlFor="categoria-tematica-b">
            Categorías temáticas
          </label>

          <select
            id="categoria-tematica-b"
            value={codigoGeovisorB}
            aria-label="Categorías temáticas de la Variable B"
            onChange={event => {
              const codigo = event.target.value;
              setCodigoGeovisorB(codigo);
              setTemaB('');
              setVariableB(null);
              setCatalogoB({ variables: [], grupos: [] });
            }}
          >
            {categoriasTematicas.map(categoria => (
              <option key={`categoria-b-${categoria.COD_GEOVISOR}`} value={categoria.COD_GEOVISOR}>
                {categoria.NOMBRE}
              </option>
            ))}
          </select>

          <label>
            Tema
          </label>

          <select
            value={temaB}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '10px'
            }}
            onChange={(e) => {

              setTemaB(
                e.target.value
              );

              setVariableB(null);

            }}
          >

          

            <option value="">
              Todos los temas
            </option>

            {catalogoB.grupos.map(grupo => (

              <option
                key={grupo.COD_GRUPO}
                value={grupo.COD_GRUPO}
              >

                {grupo.COD_GRUPO}
                {' - '}
                {grupo.GRUPO}

              </option>

            ))}

          </select>

          <label>
            Indicador
          </label>

          <select
            className="indicator-select"
            value={variableB ? JSON.stringify(variableB) : ''}
            style={{
              width: '100%',
              padding: '8px'
            }}
            onChange={(e) => {

              if (!e.target.value)
                return;

              setVariableB(
                JSON.parse(
                  e.target.value
                )
              );

            }}
          >

            <option value="">
              Seleccione...
            </option>

            {variablesB.map(item => (

              <option
                key={`B-${item.COD_CATEGORIA}`}
                value={JSON.stringify(item)}
              >

                {item.SUBGRUPO}
                {' - '}
                {item.CATEGORIA}

              </option>

            ))}

          </select>

          </section>



        </>

      )}

      {/* =====================================
          HERRAMIENTAS
      ===================================== */}

      {activePanel === 'herramientas' && (

        <>

          <BasemapSelector

            basemap={basemap}

            setBasemap={setBasemap}

          />

{/*           <h3>
            Mapa Base
          </h3>

          <label>
            <input
              type="radio"
              value="callejero"
              checked={
                basemap ===
                'callejero'
              }
              onChange={(e) =>
                setBasemap(
                  e.target.value
                )
              }
            />

            Callejero
          </label>

          <br />

          <label>
            <input
              type="radio"
              value="satelital"
              checked={
                basemap ===
                'satelital'
              }
              onChange={(e) =>
                setBasemap(
                  e.target.value
                )
              }
            />

            Satelital
          </label>

          <br />

          <label>
            <input
              type="radio"
              value="noche"
              checked={
                basemap ===
                'noche'
              }
              onChange={(e) =>
                setBasemap(
                  e.target.value
                )
              }
            />

          Noche
          </label> */}

        </>

      )}

      </div>

    )

    }

    </div>

  );

}

export default Sidebar;
