/*
==================================================
DANE - GEOPORTAL
Geovisor Bivariado Multinivel
Archivo: geoportalApi.js
Versión: 2.0.0
Fecha: Julio 2026

Descripción:
Servicios de consulta al Geoportal DANE para obtener
temas, grupos e indicadores utilizados por el
Geovisor Bivariado.

Esta versión hace parte de la refactorización del
Framework Multinivel, permitiendo la consulta
dinámica de indicadores para diferentes niveles
geográficos (Municipio, Manzana y futuros niveles),
manteniendo una única interfaz de acceso a los
servicios del Geoportal.

Proyecto desarrollado conjuntamente entre
Josué López Gil y ChatGPT.
==================================================
*/

export async function obtenerTemas(codigoGeovisor = 4, signal) {
    const params = new URLSearchParams({ codigo: String(codigoGeovisor), variables: "yes" });
    const response = await fetch(
        `https://geoportal.dane.gov.co/laboratorio/serviciosjson/visores/temas.php?${params}`,
        signal ? { signal } : undefined
    );
    return await response.json();
}

export async function obtenerCategoriasTematicas(codigoDimension = 1, signal) {
    const params = new URLSearchParams({ cod_dimension: String(codigoDimension) });
    const response = await fetch(
        `https://geoportal.dane.gov.co/laboratorio/serviciosjson/visores/dimensiones.php?${params}`,
        signal ? { signal } : undefined
    );
    return await response.json();
}



export async function obtenerIndicador(
    codigoSubgrupo,
    nivelGeografico = "MPIO",
    filtroGeografico = null,
    campoGeografico = null
) {
    const params = new URLSearchParams({
        codigo_subgrupo: codigoSubgrupo,
        nivel_geografico: nivelGeografico
    });

    if (
        nivelGeografico !== "MNZN"
    ) {

        params.append(
            "clase",
            0
        );

    }

    if (
        nivelGeografico === "MNZN" &&
        filtroGeografico
    ) {

        params.append(
            "filtro_geografico",
            filtroGeografico
        );

    }

    if (campoGeografico) {
        params.append("campo", campoGeografico);
    }

    const url =
        `https://geoportal.dane.gov.co/laboratorio/serviciosjson/visores/variables11.php?${params}`;

    console.log(
        "Consulta indicadores:",
        url
    );

    const response =
        await fetch(url);

    return await response.json();
}

function agregarParticipacionSiFalta(response, categoria, registros) {
    if (!registros || typeof registros !== "object" || Array.isArray(registros)) {
        return registros;
    }

    const filas = Object.values(registros);
    const primeraFila = filas.find(fila => fila && typeof fila === "object");
    if (!primeraFila || Object.prototype.hasOwnProperty.call(primeraFila, "PP")) {
        return registros;
    }

    const consultas = response?.consulta;
    if (!consultas || typeof consultas !== "object" || Array.isArray(consultas)) {
        return registros;
    }

    // For categorical indicators, infer the denominator from sibling
    // categories that provide both the count (K) and percentage (PP).
    const denominadores = new Map();
    for (const codigoCategoria of Object.keys(consultas)) {
        if (codigoCategoria === categoria) continue;
        const filasCategoria = response.resultado?.[codigoCategoria];
        if (!filasCategoria || typeof filasCategoria !== "object" || Array.isArray(filasCategoria)) {
            continue;
        }

        for (const [codigoGeografico, fila] of Object.entries(filasCategoria)) {
            const unidades = Number.parseFloat(fila?.K);
            const participacion = Number.parseFloat(fila?.PP);
            if (!Number.isFinite(unidades) || !Number.isFinite(participacion) || participacion <= 0) {
                continue;
            }

            const codigo = String(fila.MPIO ?? codigoGeografico);
            const valores = denominadores.get(codigo) || [];
            valores.push(unidades * 100 / participacion);
            denominadores.set(codigo, valores);
        }
    }

    return Object.fromEntries(
        Object.entries(registros).map(([codigoGeografico, fila]) => {
            if (fila?.PP !== undefined && fila?.PP !== null && fila?.PP !== "") {
                return [codigoGeografico, fila];
            }

            const unidades = Number.parseFloat(fila?.K);
            const codigo = String(fila?.MPIO ?? codigoGeografico);
            const denominadorMunicipio = denominadores.get(codigo);
            if (!Number.isFinite(unidades) || !denominadorMunicipio?.length) {
                return [codigoGeografico, fila];
            }

            const denominador = denominadorMunicipio.reduce((suma, valor) => suma + valor, 0)
                / denominadorMunicipio.length;
            return [codigoGeografico, {
                ...fila,
                PP: denominador > 0 ? String(unidades * 100 / denominador) : undefined
            }];
        })
    );
}

/**
 * Devuelve los registros de la categoría elegida con el valor normalizado en
 * PP. Algunos subgrupos devuelven una tabla plana por código geográfico y
 * columnas V0, V1, ...; en esos casos la consulta indica qué columna de origen
 * corresponde a cada alias.
 */
export function extraerRegistrosIndicador(response, variable) {
    const resultado = response?.resultado;
    if (!resultado || typeof resultado !== "object") return null;

    const categoria = String(variable?.COD_CATEGORIA ?? "");
    if (categoria && resultado[categoria]) {
        return agregarParticipacionSiFalta(response, categoria, resultado[categoria]);
    }

    const filas = Object.values(resultado);
    const primeraFila = filas.find(
        fila => fila && typeof fila === "object" && !Array.isArray(fila)
    );
    if (!primeraFila) return null;
    if (Object.prototype.hasOwnProperty.call(primeraFila, "PP")) {
        return resultado;
    }

    const aliasPorCampo = new Map();
    const expresionAlias = /\b([A-Z][A-Z0-9_]*)\s+AS\s+(V\d+)\b/gi;
    let coincidencia;
    while ((coincidencia = expresionAlias.exec(response.consulta || ""))) {
        aliasPorCampo.set(coincidencia[1].toUpperCase(), coincidencia[2]);
    }

    const categoriaNombre = String(variable?.CATEGORIA ?? "")
        .trim()
        .toUpperCase();
    let campoValor = aliasPorCampo.get(categoriaNombre);

    // Category codes are sequenced as ...001, ...002, etc. The query exposes
    // those category values in the matching V0, V1, ... aliases.
    if (!campoValor) {
        const sufijoCategoria = categoria.match(/(\d{3})$/)?.[1];
        const indiceCategoria = sufijoCategoria
            ? Number(sufijoCategoria) - 1
            : -1;
        const aliasCategoria = indiceCategoria >= 0
            ? `V${indiceCategoria}`
            : null;

        if (aliasCategoria && [...aliasPorCampo.values()].includes(aliasCategoria)) {
            campoValor = aliasCategoria;
        }
    }

    // If this response contains only one value alias, it is unambiguous even
    // when the catalog's display name differs from the database column name.
    const aliasUnicos = [...new Set(aliasPorCampo.values())];
    if (!campoValor && aliasUnicos.length === 1) {
        [campoValor] = aliasUnicos;
    }

    if (!campoValor || !Object.prototype.hasOwnProperty.call(primeraFila, campoValor)) {
        return null;
    }

    return Object.fromEntries(
        Object.entries(resultado).map(([codigo, fila]) => [
            codigo,
            { ...fila, PP: fila?.[campoValor] }
        ])
    );
}

export async function obtenerGrupos(codigoGeovisor = 4, signal) {
    const params = new URLSearchParams({ codigo: String(codigoGeovisor) });
    const response = await fetch(
        `https://geoportal.dane.gov.co/laboratorio/serviciosjson/visores/temas.php?${params}`,
        signal ? { signal } : undefined
    );
    return await response.json();
}

/*
==================================================
OBTIENE LA RELACIÓN TEMA - SUBTEMAS
==================================================
*/

export async function obtenerSubTemas(codigoGeovisor = 4, signal) {
    const params = new URLSearchParams({ codigo: String(codigoGeovisor), sub_temas: "yes" });
    const response = await fetch(
        `https://geoportal.dane.gov.co/laboratorio/serviciosjson/visores/temas.php?${params}`,
        signal ? { signal } : undefined
    );

    return await response.json();

}
