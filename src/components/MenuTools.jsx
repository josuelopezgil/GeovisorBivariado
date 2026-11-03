export default function MenuTools({
  activeTool,
  setActiveTool
}) {

  const tools = [
    {
      id: "ayuda",
      label: "Ayuda",
      icon: "https://geoportal.dane.gov.co/descargas/iconos-geoportal/svg/DANE__Geovisor__icon__ask.svg"
    },
    {
      id: "ubicacion",
      label: "Ubicación",
      icon: "https://geoportal.dane.gov.co/descargas/iconos-geoportal/svg/DANE__Geovisor__icon__searchGeo.svg"
    },
    {
      id: "tema",
      label: "Tema",
      icon: "https://geoportal.dane.gov.co/descargas/iconos-geoportal/svg/DANE__Geovisor__icon__searchTheme.svg"
    },
    {
      id: "herramientas",
      label: "Herramientas",
      icon: "https://geoportal.dane.gov.co/descargas/iconos-geoportal/svg/DANE__Geovisor__icon__settings.svg"
    }
  ];

  return (
    <div className="menu-tools">
      {tools.map(tool => (
        <button
          key={tool.id}
          className={
            activeTool === tool.id
              ? "tool-btn active"
              : "tool-btn"
          }
          onClick={() => setActiveTool(tool.id)}
        >
          <img src={tool.icon} alt={tool.label}/>
          <span>{tool.label}</span>
        </button>
      ))}
    </div>
  );
}