export default function NoDataModal({ onClose }) {
    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
        }}>
            <div style={{
                width: "420px",
                maxWidth: "90%",
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                padding: "28px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                textAlign: "center"
            }}>
                <div style={{
                    fontSize: "22px",
                    fontWeight: "600",
                    marginBottom: "16px"
                }}>
                    No se puede generar el mapa bivariado
                </div>
                <div style={{
                    fontSize: "15px",
                    lineHeight: "1.5",
                    color: "#555",
                    marginBottom: "24px"
                }}>
                    Los indicadores seleccionados no tienen información
                    compatible para generar el mapa bivariado.
                    <br />
                    <br />
                    Por favor, seleccione otros indicadores.
                </div>
                <button
                    onClick={onClose}
                    style={{
                        padding: "9px 24px",
                        border: "none",
                        borderRadius: "5px",
                        backgroundColor: "#1976d2",
                        color: "#ffffff",
                        fontSize: "14px",
                        cursor: "pointer"
                    }}
                >
                    Aceptar
                </button>
            </div>
        </div>
    );
}