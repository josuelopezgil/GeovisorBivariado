import { useRef, useState } from 'react';

const tabLabels = [
  { id: 'acerca', label: 'Acerca del geovisor' },
  { id: 'uso', label: 'Cómo usarlo' },
  { id: 'leyenda', label: 'Leyenda' },
  { id: 'metodologia', label: 'Metodología' },
  { id: 'fuentes', label: 'Fuentes de información' },
  { id: 'tecnologias', label: 'Tecnologías' },
  { id: 'independencia', label: 'Independencia institucional' }
];

const linkStyle = { color: '#087c86', textDecoration: 'underline' };
const paragraphStyle = { margin: '8px 0', textAlign: 'left' };
const headingStyle = { color: '#147d86', fontSize: '16px', margin: '18px 0 6px', textAlign: 'center' };

function HelpModal({ show, onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef([]);

  if (!show) return null;

  const selectTabWithKeyboard = (event, currentIndex) => {
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabLabels.length;
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabLabels.length) % tabLabels.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabLabels.length - 1;
    else return;

    event.preventDefault();
    setActiveTab(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  const renderContent = () => {
    switch (tabLabels[activeTab].id) {
      case 'acerca':
        return (
          <>
            <h3 style={headingStyle}>Acerca de esta aplicación</h3>
            <p style={paragraphStyle}>
              El <b>Geovisor Bivariado de Información Sociodemográfica</b> es
              una herramienta de exploración, visualización y análisis espacial
              que permite combinar y representar simultáneamente dos
              indicadores estadísticos sobre el territorio colombiano.
            </p>
            <p style={paragraphStyle}>
              Su propósito es facilitar la identificación de patrones,
              contrastes y relaciones espaciales entre diferentes variables
              sociodemográficas, mediante una representación cartográfica que
              integra dos dimensiones de información en una misma unidad
              geográfica.
            </p>
            <p style={paragraphStyle}>
              A diferencia de un mapa temático convencional, que representa una
              variable a la vez, la cartografía bivariada permite observar cómo
              se comportan conjuntamente dos indicadores, facilitando la
              identificación de territorios con características similares o
              contrastantes y ofreciendo nuevas perspectivas para el análisis
              de las dinámicas sociales y territoriales.
            </p>

            <h3 style={headingStyle}>Un aporte a la visualización y el análisis territorial en Colombia</h3>
            <p style={paragraphStyle}>
              Uno de los principales aportes de esta iniciativa es explorar las
              posibilidades de aplicación de la cartografía bivariada en
              Colombia, particularmente mediante el uso de información
              sociodemográfica con altos niveles de desagregación geográfica.
            </p>
            <p style={paragraphStyle}>
              Esta iniciativa explora la combinación simultánea de dos
              variables mediante técnicas de clasificación bivariada como una
              alternativa complementaria a los mapas temáticos convencionales,
              especialmente para trabajar con unidades geográficas de detalle.
            </p>
            <p style={paragraphStyle}>
              En este sentido, el geovisor busca aportar una perspectiva
              complementaria al análisis territorial, al permitir explorar
              conjuntamente dos indicadores no solamente a escala departamental
              y municipal, sino también a nivel de <b>manzana censal</b>.
            </p>
            <p style={paragraphStyle}>
              La posibilidad de realizar este tipo de análisis en unidades
              geográficas de mayor detalle permite aproximarse a las diferencias
              y contrastes sociodemográficos al interior de los territorios,
              identificar concentraciones espaciales de determinadas
              características y explorar patrones que pueden quedar ocultos
              cuando la información se presenta únicamente mediante
              agregaciones territoriales de mayor extensión.
            </p>
            <p style={paragraphStyle}>
              La incorporación del nivel de manzana censal representa uno de los
              elementos diferenciales de la aplicación, pues acerca la
              cartografía bivariada a una escala de análisis más detallada y
              abre nuevas posibilidades para la exploración de las condiciones
              sociodemográficas en los espacios urbanos.
            </p>
            <p style={paragraphStyle}>
              Este ejercicio no pretende sustituir los análisis estadísticos
              especializados, sino ofrecer una herramienta complementaria para
              la exploración visual, la interpretación espacial y la formulación
              de nuevas preguntas de investigación.
            </p>

            <h3 style={headingStyle}>Alcance y funcionalidades</h3>
            <p style={paragraphStyle}>
              La aplicación permite explorar la información en tres niveles de
              desagregación geográfica:
            </p>
            <ul>
              <li><b>Departamento:</b> ofrece una perspectiva general de la distribución territorial de los indicadores en Colombia.</li>
              <li><b>Municipio:</b> permite profundizar en las diferencias y patrones espaciales entre municipios.</li>
              <li><b>Manzana censal:</b> facilita una aproximación de mayor detalle al comportamiento territorial de los indicadores, permitiendo explorar diferencias y contrastes sociodemográficos al interior de los espacios urbanos.</li>
            </ul>
            <p style={paragraphStyle}>Entre sus principales funcionalidades se encuentran:</p>
            <ul>
              <li>Selección y combinación de dos indicadores sociodemográficos.</li>
              <li>Visualización simultánea de las variables mediante una matriz de clasificación bivariada.</li>
              <li>Representación de los resultados a través de una escala cromática que identifica las combinaciones de valores de ambos indicadores.</li>
              <li>Navegación e interacción con las unidades geográficas.</li>
              <li>Consulta de información asociada a las unidades territoriales representadas.</li>
              <li>Exploración de la información en diferentes escalas geográficas.</li>
            </ul>
          </>
        );
      case 'uso':
        return (
          <>
            <h3 style={headingStyle}>Pasos para explorar el mapa</h3>
            <ol>
              <li>
                En el panel <b>Tema</b>, elige el nivel geográfico: departamento,
                municipio o manzana.
              </li>
              <li>
                Selecciona por separado la categoría temática, el tema y el
                indicador para la Variable A y la Variable B.
              </li>
              <li>
                En <b>Ubicación</b>, selecciona el departamento o municipio que
                quieres explorar. Para ver manzanas, selecciona el municipio;
                puedes acotar el área por clase censal y, en centros poblados,
                por centro poblado.
              </li>
              <li>
                Cuando hayas elegido A y B, utiliza el control <b>Bivariado</b>
                para mostrar u ocultar la clasificación conjunta. En móvil,
                este control aparece cuando ambas variables están seleccionadas.
              </li>
              <li>
                Haz clic en una unidad geográfica para consultar la información
                disponible. En <b>Herramientas</b> puedes cambiar el mapa base;
                también puedes explorar las vistas 3D disponibles.
              </li>
            </ol>
            <p style={paragraphStyle}>
              Los controles disponibles pueden variar según el nivel
              geográfico, la ubicación seleccionada y la información que
              proporcione el servicio para cada indicador.
            </p>
          </>
        );
      case 'leyenda':
        return (
          <>
            <h3 style={headingStyle}>Variables representadas</h3>
            <ul>
              <li><b>Variable A:</b> primera variable temática seleccionada para el análisis.</li>
              <li><b>Variable B:</b> segunda variable temática seleccionada para el análisis.</li>
            </ul>
            <h3 style={headingStyle}>¿Qué expresa un mapa bivariado?</h3>
            <p style={paragraphStyle}>
              Cada color combina la clase de A con la clase de B en un mismo
              territorio. La matriz muestra las nueve combinaciones posibles:
              las columnas representan las clases de A y las filas las clases
              de B.
            </p>
            <figure style={{ margin: '14px auto 8px', maxWidth: '380px' }}>
              <svg
                viewBox="0 0 330 275"
                role="img"
                aria-labelledby="bivariate-legend-title bivariate-legend-description"
                style={{ display: 'block', width: '100%', height: 'auto' }}
              >
                <title id="bivariate-legend-title">Matriz de colores del mapa bivariado</title>
                <desc id="bivariate-legend-description">
                  Matriz de nueve colores. La variable A aumenta de izquierda a derecha y la variable B de abajo hacia arriba.
                </desc>
                <text x="181" y="20" textAnchor="middle" fontSize="14" fontWeight="700" fill="#334155">Variable A</text>
                <text x="14" y="132" textAnchor="middle" fontSize="14" fontWeight="700" fill="#334155" transform="rotate(-90 14 132)">Variable B</text>
                <text x="60" y="68" textAnchor="middle" fontSize="13" fill="#475569">Alto</text>
                <text x="60" y="120" textAnchor="middle" fontSize="13" fill="#475569">Medio</text>
                <text x="60" y="172" textAnchor="middle" fontSize="13" fill="#475569">Bajo</text>
                {[
                  { y: 42, labels: ['Bajo–alto', 'Medio–alto', 'Alto–alto'], colors: ['#5ac8c8', '#5698b9', '#3b4994'] },
                  { y: 96, labels: ['Bajo–medio', 'Medio–medio', 'Alto–medio'], colors: ['#ace4e4', '#a5add3', '#8c62aa'] },
                  { y: 150, labels: ['Bajo–bajo', 'Medio–bajo', 'Alto–bajo'], colors: ['#e8e8e8', '#dfb0d6', '#be64ac'] }
                ].map((row) => row.labels.map((label, column) => (
                  <g key={`${row.y}-${label}`}>
                    <rect x={78 + column * 70} y={row.y} width="68" height="50" fill={row.colors[column]} stroke="#fff" strokeWidth="2" />
                  </g>
                ))) }
                <text x="112" y="211" textAnchor="middle" fontSize="13" fill="#475569">Bajo</text>
                <text x="182" y="211" textAnchor="middle" fontSize="13" fill="#475569">Medio</text>
                <text x="252" y="211" textAnchor="middle" fontSize="13" fill="#475569">Alto</text>
                <text x="182" y="232" textAnchor="middle" fontSize="14" fontWeight="700" fill="#334155">Clases de la Variable A</text>
                <text x="182" y="263" textAnchor="middle" fontSize="10" fill="#64748b">Cada celda combina A (columnas) y B (filas).</text>
              </svg>
            </figure>
            <ul>
              <li><b>Bajo–bajo:</b> ambas variables quedan en la clase baja.</li>
              <li><b>Alto–alto:</b> ambas quedan en la clase alta.</li>
              <li><b>Alto–bajo:</b> A queda alta y B queda baja; también se dan las combinaciones inversas.</li>
            </ul>
            <p style={paragraphStyle}>
              “Alto” y “bajo” describen la posición relativa de los valores en
              la clasificación utilizada; por sí solos no significan que una
              condición sea positiva o negativa, ni demuestran causalidad.
            </p>
            <p style={paragraphStyle}>
              Los patrones de color facilitan la exploración visual, pero no
              constituyen por sí mismos una detección de clústeres ni una
              prueba estadística de asociación espacial.
            </p>
          </>
        );
      case 'metodologia':
        return (
          <>
            <h3 style={headingStyle}>Cómo se construye la clasificación</h3>
            <ol>
              <li>Se toma el valor de la participación porcentual de cada indicador seleccionado y se intenta convertirlo a número.</li>
              <li>Se ordenan los valores numéricos disponibles para cada variable.</li>
              <li>Se usan los valores en las posiciones del 33 % y 66 % como cortes: hasta el primero es bajo, hasta el segundo es medio y el resto es alto. El valor cero también se asigna a bajo.</li>
              <li>Los cortes se calculan con los valores disponibles para cada variable. Si hay valores repetidos o pocos registros, las clases pueden no tener cantidades iguales de unidades.</li>
              <li>Se emparejan las clases A y B por el código territorial común.</li>
              <li>La pareja de clases determina una de las nueve categorías de color.</li>
            </ol>
            <h3 style={headingStyle}>Ejemplo de lectura</h3>
            <p style={paragraphStyle}>
              Si un municipio queda en clase alta para A y baja para B,
              pertenece a la combinación <b>alto–bajo</b>. Se interpreta como
              una diferencia entre la posición relativa de ambos indicadores
              en ese territorio; para explicar el fenómeno hay que consultar
              sus definiciones, unidades y contexto.
            </p>
            <p style={paragraphStyle}>
              Valores vacíos o no numéricos no reciben clase. Si no hay un
              código territorial común para A y B, el registro no forma parte
              del cruce. La clasificación depende del conjunto de datos que
              recibe cada variable.
            </p>
          </>
        );
      case 'fuentes':
        return (
          <>
            <p style={paragraphStyle}>
              Los indicadores, catálogos temáticos, divisiones territoriales y
              varias capas de referencia se solicitan a servicios publicados
              por el DANE. Los mapas base y edificios 3D utilizan proveedores
              cartográficos externos.
            </p>
            <h3 style={headingStyle}>Datos temáticos y territoriales</h3>
            <ul>
              <li>
                Clasificación temática (categorías, temas e indicadores) obtenida de los servicios web de Geovisores de Estadísticas Integradas del Geoportal del DANE
                {' '}(<a style={linkStyle} href="https://geoportal.dane.gov.co/geovisores/sociedad/estadisticas-integradas" target="_blank" rel="noreferrer">abrir geovisor</a>).
              </li>
              <li>Los datos de indicadores clasificados provienen de los servicios web de los geovisores del Geoportal del DANE.</li>
              <li>
                Los datos estadísticos corresponden a resultados del Censo
                Nacional de Población y Vivienda 2018 y a estudios
                postcensales asociados. El periodo y la definición específicos
                pueden variar entre indicadores; consulta sus metadatos cuando
                estén disponibles.
              </li>
              <li>
                Codificación y servicios web de divisiones político-administrativas y centros poblados del
                {' '}<a style={linkStyle} href="https://geoportal.dane.gov.co/geovisores/territorio/consulta-divipola-division-politico-administrativa-de-colombia/" target="_blank" rel="noreferrer">Geovisor de Codificación DIVIPOLA del Geoportal del DANE</a>.
              </li>
              <li>
                Los límites oficiales de departamentos y municipios que se
                incorporan al Marco Geoestadístico Nacional se basan en los
                suministrados por el Instituto Geográfico Agustín Codazzi
                (IGAC), según el{' '}
                <a style={linkStyle} href="https://geoportal.dane.gov.co/descargas/mgn_2023/MGN2023_ManualDeUso.pdf" target="_blank" rel="noreferrer">Manual de uso del MGN 2023</a>.
              </li>
              <li>Geometrías de departamentos, municipios y manzanas mediante servicios de teselas vectoriales de los Geovisores del Geoportal del DANE.</li>
            </ul>
            <h3 style={headingStyle}>Cartografía base y atribución</h3>
            <ul>
              <li><a style={linkStyle} href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>: datos cartográficos con licencia ODbL; se usa para mapas base callejero y urbano 3D.</li>
              <li><a style={linkStyle} href="https://openfreemap.org/" target="_blank" rel="noreferrer">OpenFreeMap</a>: teselas vectoriales empleadas por la capa de edificios 3D. Atribución indicada: “OpenFreeMap © OpenMapTiles. Data from OpenStreetMap”.</li>
              <li><a style={linkStyle} href="https://support.esri.com/en-us/knowledge-base/what-is-the-correct-way-to-cite-an-arcgis-online-basema-000012040" target="_blank" rel="noreferrer">Esri</a>: mapa Canvas Light Gray e imágenes World Imagery; la atribución de imágenes incluye las fuentes especificadas por Esri.</li>
              <li><a style={linkStyle} href="https://stadiamaps.com/attribution/" target="_blank" rel="noreferrer">Stadia Maps</a>: mapa base oscuro; su página indica los créditos de los datos y estilos asociados.</li>
              <li><a style={linkStyle} href="https://carto.com/attribution/" target="_blank" rel="noreferrer">CARTO</a>: los estilos Positron y Dark Matter están definidos en la configuración del proyecto, pero su uso efectivo en el mapa actual no está confirmado.</li>
            </ul>
            <p style={{ ...paragraphStyle, fontSize: '13px', color: '#475569' }}>
              Las fuentes están identificadas a partir de las URLs y funciones
              del código. Esta ayuda no confirma disponibilidad, exactitud ni
              actualización en tiempo real de los servicios. Cada proveedor
              mantiene sus propias licencias y condiciones de uso.
            </p>
          </>
        );
      case 'tecnologias':
        return (
          <>
            <h3 style={headingStyle}>Componentes principales identificados</h3>
            <ul>
              <li><b>React 19</b> y <b>React DOM 19</b>: interfaz de usuario.</li>
              <li><b>MapLibre GL JS 6</b>: mapa web y renderizado de capas.</li>
              <li><b>Vite 8</b>: herramientas de desarrollo y empaquetado.</li>
              <li><b>React Icons 5</b>: iconografía de interfaz.</li>
              <li><b>Servicios HTTP JSON y teselas</b>: intercambio de catálogos, indicadores y datos geográficos.</li>
            </ul>
            <p style={paragraphStyle}>
              Las condiciones de uso de las librerías, los datos y los
              servicios pueden ser distintas y deben consultarse por separado.
            </p>
            <h3 style={headingStyle}>Desarrollo asistido por inteligencia artificial</h3>
            <p style={paragraphStyle}>
              Uno de los aspectos más interesantes de esta experiencia fue el
              trabajo asistido por inteligencia artificial:
            </p>
            <ul>
              <li><b>ChatGPT:</b> apoyo en la conceptualización, el análisis de requerimientos, la arquitectura, las alternativas técnicas y la solución de problemas.</li>
              <li><b>Codex:</b> acompañamiento en la implementación, revisión y evolución del código directamente desde Visual Studio Code.</li>
            </ul>
            <p style={paragraphStyle}>
              El proyecto integra tecnologías como React y MapLibre,
              componentes y librerías cartográficas, y servicios web de acceso
              público con información estadística y geográfica publicada en el
              Geoportal del DANE. Los límites oficiales de departamentos y
              municipios provistos por el IGAC se incorporan al Marco
              Geoestadístico Nacional del DANE.
            </p>
            <p style={paragraphStyle}>
              Más allá del resultado y de las herramientas de inteligencia
              artificial, esta experiencia demuestra cómo el conocimiento
              profesional en geomática, las tecnologías WebGIS y la inteligencia
              artificial pueden complementarse para materializar soluciones de
              analítica territorial.
            </p>
            <p style={paragraphStyle}>
              <b>Reflexión:</b> la inteligencia artificial no reemplaza el
              conocimiento ni el criterio técnico; amplía las posibilidades
              para explorar, construir, experimentar y resolver retos
              tecnológicos.
            </p>
          </>
        );
      case 'independencia':
        return (
          <>
            <h3 style={headingStyle}>Declaración de independencia</h3>
            <p style={paragraphStyle}>
              Esta aplicación es un proyecto personal. No ha sido desarrollada,
              avalada ni patrocinada por una entidad del Estado.
            </p>
            <p style={paragraphStyle}>
              Su propósito es contribuir a la visualización georreferenciada
              de información mediante la metodología de construcción de mapas
              bivariados, que permite representar conjuntamente dos
              indicadores en el territorio.
            </p>
            <p style={paragraphStyle}>
              Los nombres de proveedores externos se incluyen para atribuir
              correctamente la cartografía y explicar su procedencia. Cada
              proveedor conserva sus condiciones de uso.
            </p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.(); }}
      style={{
        position: 'fixed', inset: 0,
        padding: 'max(8px, env(safe-area-inset-top)) max(8px, env(safe-area-inset-right)) max(8px, env(safe-area-inset-bottom)) max(8px, env(safe-area-inset-left))',
        background: 'rgba(15, 23, 42, 0.62)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 9999,
        backdropFilter: 'blur(3px)'
      }}
    >
      <style>{`
        .help-mobile-tab-hint { display: none; }
        @media (max-width: 540px) {
          .help-mobile-tab-hint { display: block; }
          .help-tabs {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            overflow: visible !important;
            scroll-snap-type: none !important;
          }
          .help-tab-button {
            width: 100%;
            min-width: 0;
            min-height: 44px;
            white-space: normal !important;
            overflow-wrap: anywhere;
            line-height: 1.25;
          }
        }
        @supports (height: 100dvh) {
          .help-modal-dialog {
            height: min(700px, calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 16px)) !important;
            max-height: calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 16px) !important;
          }
        }
      `}</style>
      <section
        className="help-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
        style={{
          width: 'min(780px, 100%)',
          height: 'min(700px, calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 16px))',
          maxHeight: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 16px)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          background: '#fff', borderRadius: '14px',
          boxShadow: '0 24px 70px rgba(15, 23, 42, 0.28)',
          color: '#334155', fontSize: '14px', lineHeight: 1.6,
          minWidth: 0
        }}
      >
        <header style={{
          background: 'linear-gradient(120deg, #117b85, #1597a0)',
          color: '#fff', padding: '14px clamp(12px, 4vw, 18px)', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', gap: '12px'
        }}>
          <h2 id="help-modal-title" style={{ margin: 0, minWidth: 0, flex: '1 1 auto', overflowWrap: 'anywhere', fontSize: 'clamp(15px, 4vw, 19px)', lineHeight: 1.3, color: '#fff' }}>
            Ayuda del <b>Geovisor Bivariado de Información Sociodemográfica</b>
          </h2>
          <button
            type="button" onClick={onClose} aria-label="Cerrar ayuda" title="Cerrar"
            style={{ flex: '0 0 36px', width: '36px', height: '36px', display: 'grid',
              placeItems: 'center', border: '1px solid rgba(255,255,255,0.5)',
              borderRadius: '9px', background: 'rgba(255,255,255,0.14)',
              color: '#fff', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}
          >×</button>
        </header>

        <div
          className="help-tabs"
          role="tablist"
          aria-label="Secciones de ayuda"
          onKeyDown={(event) => selectTabWithKeyboard(event, activeTab)}
            style={{ display: 'flex', overflowX: 'auto', flex: '0 0 auto',
            borderBottom: '1px solid #dbe5e8', background: '#f8fbfc', padding: '6px 8px',
            scrollbarWidth: 'thin', scrollbarColor: '#94a3b8 #f8fbfc', WebkitOverflowScrolling: 'touch', scrollSnapType: 'x proximity' }}
        >
          {tabLabels.map((tab, index) => (
            <button
              className="help-tab-button"
              key={tab.id}
              ref={(element) => { tabRefs.current[index] = element; }}
              id={`help-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={activeTab === index}
              aria-controls="help-tabpanel"
              tabIndex={activeTab === index ? 0 : -1}
              onClick={() => setActiveTab(index)}
              style={{
                flex: '0 0 auto', padding: '8px 11px', border: 0, scrollSnapAlign: 'start',
                borderBottom: activeTab === index ? '3px solid #13858f' : '3px solid transparent',
                borderRadius: '6px 6px 0 0', background: activeTab === index ? '#eaf6f7' : 'transparent',
                color: activeTab === index ? '#126c74' : '#475569',
                fontWeight: activeTab === index ? 700 : 500,
                cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="help-mobile-tab-hint" style={{ padding: '3px 12px', color: '#64748b', fontSize: '11px', background: '#f8fbfc' }}>
          Selecciona una sección para consultar su contenido.
        </div>

        <div
          id="help-tabpanel"
          role="tabpanel"
          aria-labelledby={`help-tab-${tabLabels[activeTab].id}`}
          tabIndex={0}
          style={{ padding: '14px clamp(12px, 4vw, 20px) 22px', overflowY: 'auto', minHeight: 0, minWidth: 0, textAlign: 'left', WebkitOverflowScrolling: 'touch' }}
        >
          {renderContent()}
        </div>
      </section>
    </div>
  );
}

export default HelpModal;
