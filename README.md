# Geovisor Bivariado de Información Sociodemográfica

Aplicación web construida con React y Vite para explorar información sociodemográfica en un mapa bivariado.

## Desarrollo local

Requiere Node.js y npm.

```bash
npm ci
npm run dev
```

## Compilación

```bash
npm run build
npm run preview
```

Vite genera los archivos listos para publicar en `dist/`.

## Despliegue en Vercel

Importa el repositorio privado de GitHub desde Vercel. Para este proyecto, usa estos valores si Vercel no los detecta automáticamente:

- Framework: **Vite**
- Root Directory: **`.`**
- Build Command: **`npm run build`**
- Output Directory: **`dist`**
- Install Command: **`npm ci`** para instalar las versiones fijadas en `package-lock.json`.

Al conectar el repositorio, Vercel puede generar despliegues automáticamente a partir de los commits, de acuerdo con la configuración del proyecto.

## Configuración y servicios externos

No se identificaron archivos `.env` requeridos por la aplicación durante esta preparación. El cliente consulta servicios y fuentes cartográficas externos directamente desde el navegador. Después del primer despliegue, hay que comprobar que esos servicios acepten solicitudes desde el dominio de Vercel y que estén disponibles.

No guardes contraseñas, tokens ni claves privadas en variables `VITE_*`: Vite las incorpora al código entregado al navegador. Los archivos `.env*` están excluidos de Git, excepto `.env.example`, que debe contener solo nombres y valores de ejemplo no sensibles.
