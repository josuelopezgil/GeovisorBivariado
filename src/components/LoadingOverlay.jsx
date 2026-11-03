/*
==================================================
LOADING OVERLAY
GeoViewer Bivariado
--------------------------------------------------
Muestra un indicador de carga mientras se realizan
operaciones pesadas:

- Cambio de nivel geográfico
- Carga de indicadores
- Clasificación bivariada
- Aplicación de simbología
==================================================
*/

import "./LoadingOverlay.css";

export default function LoadingOverlay({

    visible,

    message = "Cargando..."

}) {

    if (!visible) {

        return null;

    }

    return (

        <div className="loading-overlay">

            <div className="loading-box">

                <div className="loading-spinner" />

                <div className="loading-text">

                    {message}

                </div>

            </div>

        </div>

    );

}