import { useState } from 'react';

function Legend({
  variableA,
  variableB,
  hoverClase,
  setHoverClase,
  embedded = false
}) {

  const [collapsed, setCollapsed] =
    useState(false);

  const [hoverClass, setHoverClass] =
    useState(null);

  const activeClass =
    hoverClase ?? hoverClass;

  const clases = [

    '1-3', '2-3', '3-3',
    '1-2', '2-2', '3-2',
    '1-1', '2-1', '3-1'

  ];

  const colores = [

    '#5ac8c8',
    '#5698b9',
    '#3b4994',

    '#ace4e4',
    '#a5add3',
    '#8c62aa',

    '#e8e8e8',
    '#dfb0d6',
    '#be64ac'

  ];

  const tooltipClases = {

    '1-3': { a: 'Bajo',  b: 'Alto'  },
    '2-3': { a: 'Medio', b: 'Alto'  },
    '3-3': { a: 'Alto',  b: 'Alto'  },

    '1-2': { a: 'Bajo',  b: 'Medio' },
    '2-2': { a: 'Medio', b: 'Medio' },
    '3-2': { a: 'Alto',  b: 'Medio' },

    '1-1': { a: 'Bajo',  b: 'Bajo'  },
    '2-1': { a: 'Medio', b: 'Bajo'  },
    '3-1': { a: 'Alto',  b: 'Bajo'  }

  };

  return (

      <div
        style={{

          position:
            embedded
              ? 'relative'
              : 'absolute',

          bottom:
            embedded
              ? 'auto'
              : '20px',

          right:
            embedded
              ? 'auto'
              : '20px',

          width: '100%',

          maxWidth:
            embedded
              ? '100%'
              : '270px',

          background: '#ffffff',

          borderRadius: '8px',

          overflow: 'hidden',

          boxShadow:
            embedded
              ? 'none'
              : '0 2px 8px rgba(0,0,0,0.25)',

          zIndex:
            embedded
              ? 'auto'
              : 1000

        }}
      >

      {/* ================================= */}
      {/* CABECERA */}
      {/* ================================= */}

      <div
        style={{
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems: 'center',
          padding: '8px 10px',
          background: '#f5f5f5',
          borderBottom:
            '1px solid #ddd'
        }}
      >

        <span
          style={{
            fontWeight: 'bold',
            fontSize: '12px'
          }}
        >
          Leyenda
        </span>

        <button
          onClick={() =>
            setCollapsed(
              !collapsed
            )
          }
          title={
            collapsed
              ? 'Expandir'
              : 'Minimizar'
          }
          style={{
            border: 'none',
            background:
              'transparent',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#666'
          }}
        >
          {collapsed ? '▢' : '−'}
        </button>

      </div>

      {/* ================================= */}
      {/* CONTENIDO */}
      {/* ================================= */}

      {!collapsed && (

        <div
          style={{
            padding: embedded ? '6px' : '10px'
          }}
        >

          {/* ================================= */}
          {/* MATRIZ */}
          {/* ================================= */}

          <div
            style={{
              display: 'flex',
              justifyContent:
                'center',
              alignItems:
                'center'
            }}
          >

            <div
              style={{
                writingMode:
                  'vertical-rl',
                transform:
                  'rotate(180deg)',
                fontWeight:
                  'bold',
                fontSize: '11px',
                color: '#444',
                marginRight: '8px'
              }}
            >
              Indicador B

            
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection:
                  'column',
                alignItems:
                  'center',
                marginRight: '8px'
              }}
            >

              <span
                style={{
                  fontSize: '10px',
                  fontWeight:
                    'bold'
                }}
              >
                Alto
              </span>

              <span>
                ↑
              </span>

              <span
                style={{
                  fontSize: '10px',
                  fontWeight:
                    'bold'
                }}
              >
                Bajo
              </span>

            </div>

            <div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                      embedded
                        ? '24px 24px 24px'
                        : '28px 28px 28px',
                  gap: '2px'
                }}
              >

                {clases.map(
                  (
                    clase,
                    index
                  ) => (

                    <div
                      key={clase}
                      role="button"
                      tabIndex={0}
                      aria-pressed={activeClass === clase}
                      aria-label={`Resaltar clase: Indicador A ${tooltipClases[clase].a}, Indicador B ${tooltipClases[clase].b}`}
                      onClick={() => {
                        const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
                        const nextClass = supportsHover || activeClass !== clase ? clase : null;
                        setHoverClase(nextClass);
                        setHoverClass(nextClass);
                      }}
                      onKeyDown={event => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          const nextClass = activeClass === clase ? null : clase;
                          setHoverClase(nextClass);
                          setHoverClass(nextClass);
                        }
                      }}

                      onMouseEnter={() => {

                        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

                        setHoverClase(clase);
                        setHoverClass(clase);

                      }}

                      onMouseLeave={() => {
                        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                          setHoverClase(null);
                          setHoverClass(null);
                        }

                      }}

                      title={
                        `Indicador A: ${tooltipClases[clase].a} | Indicador B: ${tooltipClases[clase].b}`
                      }

                      style={{
                        width: embedded ? '24px' : '28px',
                        height: embedded ? '24px' : '28px',
                        backgroundColor:
                          colores[index],
                        border:
                          activeClass === clase
                            ? '2px solid #000'
                            : '1px solid #ccc',
                        cursor: 'pointer',
                        touchAction: 'manipulation',
                        transition:
                          'all 0.2s ease'
                      }}
                    />

                  )
                )}

              </div>

            </div>

          </div>

          {/* ================================= */}
          {/* EJE X */}
          {/* ================================= */}

          <div
            style={{
              textAlign: 'center',
              marginTop: embedded ? '3px' : '8px',
              fontSize: '10px',
              fontWeight: 'bold',
              color: '#555'
            }}
          >
              Bajo     →    Alto
          </div>

          {/* ================================= */}
          {/* CLASE SELECCIONADA */}
          {/* ================================= */}

          {activeClass && (
            <div
              style={{
                marginTop: embedded ? '2px' : '10px',
                padding: embedded ? '2px 0' : '8px',
                border: embedded ? 'none' : '1px solid #e5e5e5',
                borderRadius: embedded ? 0 : '6px',
                fontSize: embedded ? '9px' : '12px',
                lineHeight: embedded ? 1 : undefined,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                color: '#666'
              }}
            >
              {embedded ? (
                <>
                  A {tooltipClases[activeClass].a}
                  {' · '}
                  B {tooltipClases[activeClass].b}
                </>
              ) : (
                <>
                  <b>A:</b> {tooltipClases[activeClass].a}
                  {' · '}
                  <b>B:</b> {tooltipClases[activeClass].b}
                </>
              )}
            </div>
          )}

          {/* ================================= */}
          {/* INDICADOR A */}
          {/* ================================= */}

          <div
            style={{
              marginTop: embedded ? '2px' : '10px',
              textAlign: 'center'
            }}
          >

            <div
              style={{
                fontWeight: 'bold',
                fontSize: embedded ? '10px' : '12px'
              }}
            >
              Indicador A:
            </div>

            <div
              style={{
                marginTop: embedded ? '2px' : '4px',
                fontSize: embedded ? '10px' : '11px',
                color: '#444',
                lineHeight: '1.2'
              }}
            >

              {
                variableA
                  ? `${variableA.SUBGRUPO} - ${variableA.CATEGORIA}`
                  : 'Seleccione Indicador A'
              }
              
            <div
              style={{
                marginTop: embedded ? '3px' : '10px',
                fontWeight: 'bold',
                fontSize: embedded ? '10px' : '12px'
              }}
            >
              Indicador B

            </div>

            
              {
                variableB
                  ? `${variableB.SUBGRUPO} - ${variableB.CATEGORIA}`
                  : 'Seleccione Indicador B'
              }

            </div>

          </div>

          {/* ================================= */}
          {/* INTERPRETACIÓN */}
          {/* ================================= */}

          <div
            style={{
              marginTop: embedded ? '3px' : '10px',
              paddingTop: embedded ? '3px' : '8px',
              borderTop:
                '1px solid #eee',
              fontSize: '11px',
              color: '#666',
              textAlign: 'center',
              lineHeight: embedded ? '1.2' : '1.4'
            }}
          >

            → Mayor valor del Indicador A

            <br />

            ↑ Mayor valor del Indicador B

          </div>

        </div>

      )}

      {/* ================================= */}
      {/* TEXTO INFORMATIVO CUANDO NO HAY CRUCE */}
      {/* ================================= */}

      <div style={{
          marginTop: "12px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "11px",
          lineHeight: 1.2
      }}>
          <div style={{
              width: "18px",
              height: "18px",
              backgroundColor: "#cccccc",
              border: "1px solid #999",
              flexShrink: 0
          }}></div>
          <span>
              Sin información: no existe cruce entre los indicadores seleccionados
          </span>
      </div>

    </div>


  );

}

export default Legend;
