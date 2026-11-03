import estadistico from "../assets/basemaps/estadistico.jpg";
import osm from "../assets/basemaps/osm.jpg";
import noche from "../assets/basemaps/noche.jpg";
import satelital from "../assets/basemaps/satelital.jpg";
import urbano3d from "../assets/basemaps/urbano3d.jpg";

export const BASEMAPS = [

{
    id:"estadistico",

    nombre:"Gris",

    descripcion:"Ideal para indicadores",

    imagen:estadistico,

    recomendado:true,

     badge:null
},

{
    id:"callejero",

    nombre:"Callejero",

    descripcion:"OpenStreetMap",

    imagen:osm,

    recomendado:false,

    badge:null
},

{
    id:"noche",

    nombre:"Noche",

    descripcion:"Modo oscuro",

    imagen:noche,

    recomendado:false,

    badge:null
},

{
    id: "urbano3d",

    nombre: "Urbano 3D",

    descripcion: "Edificios y visualización 3D",

    imagen: urbano3d,

    recomendado: false,

    badge: "🆕"
},

{
    id:"satelital",

    nombre:"Satelital",

    descripcion:"Imágenes",

    imagen:satelital,

    recomendado:false,

    badge:null
}

];