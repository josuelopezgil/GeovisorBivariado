import {
  FaChevronRight,
  FaChevronLeft,
  FaChartBar
} from 'react-icons/fa';

import Legend from './Legend';
import './RightPanel.css';

function RightPanel({

  mobilePanelOpen = false,

  variableA,
  variableB,
  departamento,
  municipio,
  nombreDepartamento,
  nombreMunicipio,

  hoverClase,
  setHoverClase,

  hoverInfo,

  rightPanelOpen,
  setRightPanelOpen,

  showBivariate,
  setShowBivariate,

  showBuildings,
  setShowBuildings,
  showBivariate3D,
  setShowBivariate3D,
  nivelGeografico,
  extrusionVariable,
  setExtrusionVariable,
  extrusionMaxHeight,
  setExtrusionMaxHeight

}) {
  const useDefaultManzanaLocation =
    nivelGeografico === 'manzana' && !departamento && !municipio;

  const departamentoVisible = useDefaultManzanaLocation
    ? '05 - Antioquia'
    : nivelGeografico === 'departamento' && !departamento
      ? 'Todos los departamentos'
    : departamento && nombreDepartamento
      ? `${String(departamento).padStart(2, '0')} - ${nombreDepartamento}`
      : 'Sin seleccionar';

  const municipioVisible = useDefaultManzanaLocation
    ? '05001 - Medellín'
    : municipio && nombreMunicipio
      ? `${String(municipio).padStart(5, '0')} - ${nombreMunicipio}`
      : 'Sin seleccionar';

  return (

    <div
      className={`geoportal-right-panel${mobilePanelOpen ? ' mobile-open' : ''}`}
      style={{
        width:
          rightPanelOpen
            ? '340px'
            : '48px',

        minWidth:
          rightPanelOpen
            ? '340px'
            : '48px',

        transition:
          'all 0.3s ease',

        background: '#ffffff',

        borderLeft:
          '1px solid #d9d9d9',

        display: 'flex',
        flexDirection: 'column',
        fontSize: '13px',
        lineHeight: 1.4,
        textAlign: 'left',

        overflow: 'hidden',

        boxShadow:
          '-2px 0 6px rgba(0,0,0,0.08)',

        zIndex: 100
      }}
    >

      {/* ========================= */}
      {/* CABECERA */}
      {/* ========================= */}

      <div
        style={{
          height: '52px',

          display: 'flex',
          alignItems: 'center',
          justifyContent:
            rightPanelOpen
              ? 'space-between'
              : 'center',

          padding:
            rightPanelOpen
              ? '0 12px'
              : '0',

          borderBottom:
            '1px solid #e5e5e5',

          background:
            '#fafafa'
        }}
      >

        {

        rightPanelOpen && (

          <div
            style={{
              fontWeight: 'bold',
              color: '#16858f'
            }}
          >
            Resultados
          </div>

        )

        }

        <button
          className="right-panel-collapse-button"
          onClick={() =>
            setRightPanelOpen(
              !rightPanelOpen
            )
          }
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#666'
          }}
        >

          {

          rightPanelOpen
            ? <FaChevronRight />
            : <FaChevronLeft />

          }

        </button>

      </div>

      {/* ========================= */}
      {/* CONTENIDO */}
      {/* ========================= */}

      {

      rightPanelOpen && (

        <div
          className="right-panel-content"
          style={{
            flex: 1,
            overflowY: 'auto'
          }}
        >

          <div
            className="right-panel-location"
            style={{
              margin: '6px 8px 0',
              padding: '6px 10px',
              background: '#f1f8f8',
              border: '1px solid #d7ebec',
              borderRadius: '8px',
              fontSize: '13px',
              lineHeight: 1.6
            }}
          >
            {useDefaultManzanaLocation && (
              <div
                style={{
                  marginBottom: '2px',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#16858f',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px'
                }}
              >
                Ubicación predeterminada
              </div>
            )}
            <div>
              <strong>Departamento:</strong>{' '}
              {departamentoVisible}
            </div>
            {nivelGeografico !== 'departamento' && (
              <div>
                <strong>Municipio:</strong>{' '}
                {municipioVisible}
              </div>
            )}
          </div>

          {/* ========================= */}
          {/* LEYENDA */}
          {/* ========================= */}

          <div
            className="right-panel-legend"
            style={{
              padding: '4px 8px'
            }}
          >

            <Legend

              embedded={true}

              variableA={variableA}
              variableB={variableB}

              hoverClase={hoverClase}
              setHoverClase={setHoverClase}

            />

          </div>

            
            {/* ========================= */}
            {/* VISUALIZACIÓN */}
            {/* ========================= */}

            <div
              className="right-panel-card right-panel-visual"
              style={{
                margin: "6px 8px",
                padding: "8px 10px",
                background: "#fafafa",
                border: "1px solid #e5e5e5",
                borderRadius: "8px"
              }}
            >

              <div
                style={{
                  fontWeight: "bold",
                  color: "#16858f",
                  marginBottom: "6px",
                  fontSize: "14px"
                }}
              >

                Visualización

              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  fontSize: "13px"
                }}
              >

                <input

                  type="checkbox"

                  checked={showBivariate}

                  onChange={(e) =>
                    setShowBivariate(
                      e.target.checked
                    )
                  }

                />

                Indicadores bivariados

              </label>

              <label
                  style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "6px",
                      cursor: "pointer",
                      fontSize: "13px"
                  }}
              >

                  <input

                      type="checkbox"

                      checked={showBuildings}

                      onChange={(e) =>
                          setShowBuildings(
                              e.target.checked
                          )
                      }

                  />

                  Edificios 3D

              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "6px",
                  cursor: variableA && variableB ? "pointer" : "not-allowed",
                  fontSize: "13px",
                  opacity: variableA && variableB ? 1 : 0.55
                }}
              >
                <input
                  type="checkbox"
                  checked={showBivariate3D}
                  disabled={!variableA || !variableB}
                  onChange={(event) =>
                    setShowBivariate3D(event.target.checked)
                  }
                />
                Mapa bivariado 3D
              </label>

              {showBivariate3D && (
                <div style={{ margin: "10px 0 0 28px", fontSize: "12px" }}>
                  <label htmlFor="extrusion-variable">
                    Exagerar altura según
                  </label>
                  <select
                    id="extrusion-variable"
                    value={extrusionVariable}
                    onChange={(event) => setExtrusionVariable(event.target.value)}
                    style={{
                      display: "block",
                      width: "100%",
                      marginTop: "5px",
                      padding: "6px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      background: "white"
                    }}
                  >
                    <option value="A" disabled={!variableA}>
                      Indicador A{variableA ? `: ${variableA.CATEGORIA}` : " (sin seleccionar)"}
                    </option>
                    <option value="B" disabled={!variableB}>
                      Indicador B{variableB ? `: ${variableB.CATEGORIA}` : " (sin seleccionar)"}
                    </option>
                  </select>

                  <label
                    htmlFor="extrusion-height"
                    style={{ display: "block", marginTop: "12px" }}
                  >
                    Altura visual máxima relativa: {extrusionMaxHeight * ((nivelGeografico === "municipio" || nivelGeografico === "departamento") ? 20 : nivelGeografico === "manzana" ? 2 : 1)} m
                    {(nivelGeografico === "municipio" || nivelGeografico === "departamento") ? " (exageración ×20)" : nivelGeografico === "manzana" ? " (exageración ×2)" : ""}
                  </label>
                  <input
                    id="extrusion-height"
                    type="range"
                    min="100"
                    max="5000"
                    step="50"
                    value={extrusionMaxHeight}
                    onChange={(event) =>
                      setExtrusionMaxHeight(Number(event.target.value))
                    }
                    style={{ width: "100%", marginTop: "5px" }}
                  />
                </div>
              )}

            </div>




            {/* ========================= */}
            {/* COMPORTAMIENTO TERRITORIAL */}
            {/* ========================= */}

            <div
            className="right-panel-card right-panel-territory"
            style={{
                margin: '6px 8px',
                padding: '8px 10px',
                background: '#fafafa',
                border: '1px solid #e5e5e5',
                borderRadius: '8px'
            }}
            >

            <div
                style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px',
                fontWeight: 'bold',
                color: '#16858f',
                fontSize: '14px'
                }}
            >
                <FaChartBar />
                Comportamiento Territorial
            </div>

            {

            !hoverInfo && (

                <div
                style={{
                    fontSize: '11px',
                    color: '#666',
                    lineHeight: '15px'
                }}
                >

                Pase el cursor sobre una celda de la matriz para explorar su distribución territorial.

                </div>

            )

            }

            {

            hoverInfo && (

              <div
                style={{
                  padding: '8px',
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '20px',
                        lineHeight: 1.1,
                        fontWeight: 700,
                        color: '#16858f'
                      }}
                    >
                      {hoverInfo.cantidad ?? 0}
                    </div>
                    <div
                      style={{
                        marginTop: '3px',
                        fontSize: '10px',
                        color: '#666'
                      }}
                    >
                      {(hoverInfo.cantidad ?? 0) === 1
                        ? 'polígono en esta combinación'
                        : 'polígonos en esta combinación'}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 7px',
                      background: '#f5f5f5',
                      borderRadius: '14px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#444',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: '12px',
                        height: '12px',
                        background: hoverInfo.color || '#cccccc',
                        border: '1px solid #999',
                        borderRadius: '3px'
                      }}
                    />
                    Clase {hoverInfo.clase}
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '6px',
                    marginTop: '8px',
                    paddingTop: '7px',
                    borderTop: '1px solid #eeeeee'
                  }}
                >
                  <div style={{ fontSize: '10px', color: '#666' }}>
                    Indicador A
                    <strong
                      style={{
                        display: 'block',
                        marginTop: '2px',
                        fontSize: '11px',
                        color: '#333'
                      }}
                    >
                      {hoverInfo.claseA}
                    </strong>
                  </div>
                  <div style={{ fontSize: '10px', color: '#666' }}>
                    Indicador B
                    <strong
                      style={{
                        display: 'block',
                        marginTop: '2px',
                        fontSize: '11px',
                        color: '#333'
                      }}
                    >
                      {hoverInfo.claseB}
                    </strong>
                  </div>
                </div>
              </div>

            )

            }

            </div>

        </div>

      )

      }

    </div>

  );

}

export default RightPanel;
