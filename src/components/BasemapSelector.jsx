import "./BasemapSelector.css";

import { BASEMAPS } from "../config/basemaps";

function BasemapSelector({

    basemap,

    setBasemap

}) {

    return (

        <div className="basemap-selector">

            <h3>

                Mapa Base

            </h3>

            <div className="basemap-grid">

                {

                    BASEMAPS.map((item) => (

                        <div
                            key={item.id}
                            className={`basemap-card ${basemap === item.id ? "active" : ""}`}
                            onClick={() => setBasemap(item.id)}
                        >

                            {/* Badge de recomendado */}
                            {item.badge && (
                                <div className="basemap-badge">
                                    {item.badge}
                                </div>
                            )}

                            {/* Check de selección */}
                            {basemap === item.id && (
                                <div className="basemap-check">
                                    ✓
                                </div>
                            )}

                            <img
                                src={item.imagen}
                                alt={item.nombre}
                            />

                            <div className="basemap-info">

                                <div className="basemap-title">
                                    {item.nombre}
                                </div>

                                <div className="basemap-description">
                                    {item.descripcion}
                                </div>

                            </div>

                        </div>



                    ))

                }

            </div>

        </div>

    );

}

export default BasemapSelector;