/**
==================================================
GeoViewer Framework V2
Módulo: IndicatorFilter.js
Versión: 2.0
Descripción:
Filtra los indicadores disponibles según el nivel
geográfico configurado en GeographicLevels.js.
Desarrollado durante la generalización del
Framework Multinivel del Geovisor Bivariado DANE.
==================================================
*/

import { getFilterCode } from "../config/GeographicLevels";

/*
==================================================
FILTRAR INDICADORES
==================================================
*/

export function filterIndicators(
    indicadores,
    nivel
) {

    if (!Array.isArray(indicadores))
        return [];

    const filterCode =
        String(getFilterCode(nivel) || "").toUpperCase();

    if (!filterCode) return [];

    return indicadores.filter(indicador => {

        const filtro =
            indicador.FILTRO_GEOGRAFICO || "";

        const codigosGeograficos = Array.isArray(filtro)
            ? filtro.flatMap(valor => String(valor || "").toUpperCase().split(/[^A-Z0-9]+/))
            : String(filtro).toUpperCase().split(/[^A-Z0-9]+/);

        return codigosGeograficos.includes(filterCode);

    });

}
