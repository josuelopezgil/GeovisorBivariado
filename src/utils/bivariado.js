/*
 * ============================================
 * CLASIFICACIÓN DE UNA VARIABLE
 * ============================================
 * Devuelve:
 * {
 *   "05001": 3,
 *   "05002": 1,
 *   ...
 * }
 *
 * Clases:
 * 1 = Bajo
 * 2 = Medio
 * 3 = Alto
 */

export function parseIndicatorValue(value) {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }

    if (value === null || value === undefined) return null;

    let normalized = String(value)
        .trim()
        .replace(/\s+/g, "")
        .replace(/%$/, "");

    if (!normalized) return null;

    const commaIndex = normalized.lastIndexOf(",");
    const periodIndex = normalized.lastIndexOf(".");

    if (commaIndex >= 0 && periodIndex >= 0) {
        normalized = commaIndex > periodIndex
            ? normalized.replace(/\./g, "").replace(",", ".")
            : normalized.replace(/,/g, "");
    } else if (commaIndex >= 0) {
        normalized = normalized.replace(",", ".");
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
}

export function clasificarVariable(datos) {
    const valores = Object.values(datos)
        .map(item => parseIndicatorValue(item?.PP))
        .filter(Number.isFinite)
        .sort((a, b) => a - b);

    if (valores.length === 0) {
        return {
            clases: {},
            q1: null,
            q2: null,
            minimo: null,
            maximo: null
        };
    }

    const q1 =
        valores[Math.floor(valores.length * 0.33)];

    const q2 =
        valores[Math.floor(valores.length * 0.66)];

    const clases = {};

    Object.entries(datos).forEach(([codigoRegistro, item]) => {
        const valor = parseIndicatorValue(item?.PP);

        // NaN o valor no numérico: no se clasifica
        if (!Number.isFinite(valor)) {
            return;
        }

        const clase =
            valor === 0 || valor <= q1
                ? 1
                : valor <= q2
                    ? 2
                    : 3;

        const codigo =
            codigoRegistro ??
            item.NM ??
            item.MPIO ??
            item.ND ??
            item.COD_DPTO ??
            item.cod_dane ??
            item.COD_DANE ??
            item.COD_DANE_VIVIENDAS ??
            item.cod_dane_viviendas ??
            codigoRegistro;

        if (codigo !== undefined && codigo !== null && codigo !== '') {
            const codigoNormalizado = item.ND != null || item.COD_DPTO != null
                ? String(codigo).padStart(2, '0')
                : String(codigo);
            clases[codigoNormalizado] = clase;
        }
    });

    return {
        clases,
        q1,
        q2,
        minimo: valores[0],
        maximo: valores[valores.length - 1]
    };
}
/*
 * ============================================
 * MATRIZ BIVARIADA 3 x 3
 * ============================================
 */

export const coloresBivariados = {

  '1-1': '#e8e8e8',
  '2-1': '#dfb0d6',
  '3-1': '#be64ac',

  '1-2': '#ace4e4',
  '2-2': '#a5add3',
  '3-2': '#8c62aa',

  '1-3': '#5ac8c8',
  '2-3': '#5698b9',
  '3-3': '#3b4994'

};

/*
 * ============================================
 * CRUCE BIVARIADO
 * ============================================
 *
 * Devuelve:
 *
 * {
 *   "05001": {
 *      claseA: 3,
 *      claseB: 2,
 *      clase: "3-2"
 *   }
 * }
 *
 */

export function generarCruceBivariado(
  clasesA,
  clasesB
) {

  const resultado = {};

  Object.keys(clasesA).forEach(codigo => {

    if (!clasesB[codigo]) return;

    const claseA =
      clasesA[codigo];

    const claseB =
      clasesB[codigo];

    resultado[codigo] = {

      claseA,
      claseB,

      clase:
        `${claseA}-${claseB}`

    };

  });

  return resultado;
}

/*
 * ============================================
 * EXPRESIÓN MAPLIBRE
 * ============================================
 */

export function generarExpresionBivariada(
  datosBivariados,
  idField = 'id'
) {

  const idCandidates = [
    idField,
    idField?.toLowerCase?.(),
    idField?.toUpperCase?.(),
    'id'
  ].filter((value, index, array) => value && array.indexOf(value) === index);

  const idValueExpression = [
    'coalesce',
    ...idCandidates.map(candidate => ['get', candidate])
  ];

  const expression = [
    'match',
    ['to-string', idValueExpression]
  ];

  Object.entries(
    datosBivariados
  ).forEach(([codigo, info]) => {

    if (
      !coloresBivariados[
        info.clase
      ]
    ) {

      console.error(
        'Clase sin color:',
        info.clase
      );

    }

    expression.push(
      String(codigo),
      coloresBivariados[
        info.clase
      ]
    );

  });

  expression.push('#cccccc');

  return expression;
}

/**
 * Build relative polygon heights from indicator PP values. The maximum is a
 * visual scale, not a measured physical height for the territory.
 */
export function generarExpresionAlturaExtrusion(
  datos,
  idField = 'id',
  alturaMaxima = 120,
  codigosIncluidos = null
) {
  const records = Object.entries(datos || {}).flatMap(([key, item]) => {
    const value = parseIndicatorValue(item?.PP);
    if (!Number.isFinite(value)) return [];

    const codigo =
      key ??
      item.NM ??
      item.MPIO ??
      item.ND ??
      item.COD_DPTO ??
      item.cod_dane ??
      item.COD_DANE ??
      item.COD_DANE_VIVIENDAS ??
      item.cod_dane_viviendas ??
      key;

    if (codigo === undefined || codigo === null || codigo === '') return [];
    const codigoTexto = item.ND != null || item.COD_DPTO != null
      ? String(codigo).padStart(2, '0')
      : String(codigo);
    if (codigosIncluidos && !codigosIncluidos.has(codigoTexto)) return [];
    return [{ codigo: codigoTexto, value }];
  });

  const { minValue, maxValue } = records.reduce(
    (range, record) => ({
      minValue: Math.min(range.minValue, record.value),
      maxValue: Math.max(range.maxValue, record.value)
    }),
    { minValue: Infinity, maxValue: -Infinity }
  );
  const maxHeight = Math.max(1, Number(alturaMaxima) || 120);

  const idCandidates = [
    idField,
    idField?.toLowerCase?.(),
    idField?.toUpperCase?.(),
    'id'
  ].filter((value, index, array) => value && array.indexOf(value) === index);

  const expression = [
    'match',
    ['to-string', ['coalesce', ...idCandidates.map(candidate => ['get', candidate])]]
  ];

  records.forEach(({ codigo, value }) => {
    const ratio = maxValue === minValue
      ? 0.5
      : (value - minValue) / (maxValue - minValue);
    const altura = 10 + Math.sqrt(ratio) * (maxHeight - 10);
    expression.push(codigo, Math.min(maxHeight, altura));
  });

  expression.push(0);
  return expression;
}
