/**
==================================================
GeoViewer Framework V2
Módulo: ThemeFilter.js
Versión: 2.0
Descripción:
Filtra los temas disponibles según los indicadores
habilitados para el nivel geográfico seleccionado.

El proceso consiste en:
1. Obtener los indicadores válidos para el nivel.
2. Identificar sus Subgrupos.
3. Obtener los Grupos (Temas) asociados.
4. Retornar únicamente los Temas válidos.

Desarrollado durante la generalización del
Framework Multinivel del Geovisor Bivariado DANE.

Proyecto desarrollado conjuntamente entre
Josué López Gil y ChatGPT.
==================================================
*/

/*
==================================================
FILTRAR TEMAS
==================================================
*/

export function filterThemes(
    grupos,
    subTemas,
    indicadores
) {

    if (
        !Array.isArray(grupos) ||
        !Array.isArray(subTemas) ||
        !Array.isArray(indicadores)
    ) {
        return [];
    }

    /*
    ----------------------------------------------
    Subgrupos válidos
    ----------------------------------------------
    */

    const subgruposValidos =
        new Set(
            indicadores.map(
                item => item.COD_SUBGRUPO
            )
        );

    /*
    ----------------------------------------------
    Grupos válidos
    ----------------------------------------------
    */

    const gruposValidos =
        new Set(
            subTemas
                .filter(item =>
                    subgruposValidos.has(
                        item.COD_SUBGRUPO
                    )
                )
                .map(item =>
                    item.COD_GRUPO
                )
        );

    /*
    ----------------------------------------------
    Filtrar Temas
    ----------------------------------------------
    */

    return grupos.filter(grupo =>
        gruposValidos.has(
            grupo.COD_GRUPO
        )
    );

}