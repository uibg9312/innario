# 🎵 Innario — La Luce del Mondo

> Esqueleto open-source de una app de himnario digital multiplataforma (PWA + Android).

Este repositorio contiene el **código fuente** de la aplicación web (React + Firebase) de un himnario digital bilingüe (italiano/español) desplegado en producción. Se publica como **esqueleto**: el código, la arquitectura y la interfaz están completos, pero los **datos de los himnos y las credenciales se han omitido** por privacidad.

![React](https://img.shields.io/badge/React-19-61dafb)
![Vite](https://img.shields.io/badge/Vite-7-646cff)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)
![PWA](https://img.shields.io/badge/PWA-Installable-purple)

## ✨ Características de la app

- **📖 Biblioteca de himnos** — Navega 330+ himnos por número, categoría (Regulares / Adicionales / Editor) o índice temático.
- **🔍 Búsqueda y filtros** — Búsqueda instantánea por texto y filtros por categoría.
- **❤️ Favoritos y recientes** — Marca himnos favoritos y continúa la lectura donde la dejaste.
- **⚙️ Personalizable** — Ajusta familia de fuente, tamaño y tema (claro/oscuro).
- **📱 PWA instalable** — Funciona offline una vez instalada, con soporte para múltiples pestañas.
- **🛠️ Panel de administración** — Editar, añadir y eliminar himnos que se sincronizan con Firestore (con *fallback* a `localStorage`).
- **🤖 App Android nativa** — Versión en Kotlin + Jetpack Compose (arquitectura MVVM, Room, Firestore) en una carpeta separada.

## 🛠️ Stack técnico

| Tecnología | Rol |
|---|---|
| **React 19 + Vite 7** | Framework UI y bundler |
| **Tailwind CSS 3** | Estilos y sistema de diseño |
| **Firebase Firestore** | Base de datos en tiempo real con caché offline |
| **Framer Motion** | Animaciones (splash screen, transiciones) |
| **React Router 7** | Navegación |
| **vite-plugin-pwa** | Service worker y manifiesto PWA |

## 🚀 Puesta en marcha

Este es un esqueleto: para ejecutarlo necesitas proporcionar tus propias credenciales y datos.

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar Firebase
#    Copia el template y rellena con tus credenciales:
cp .env.example .env.local
#    Edita .env.local con los valores de tu proyecto Firebase

# 3. Servidor de desarrollo
npm run dev

# 4. Build de producción
npm run build
```

> ⚠️ **Nota:** El esqueleto no incluye el archivo de datos `cantos.json` ni la base de datos Firestore. La app espera una colección Firestore (`innario`) con la estructura de himnos documentada en el código (`src/context/HymnContext.jsx`).

## 🔐 Privacidad

- Las credenciales de Firebase se cargan mediante variables de entorno (`.env.local`).
- No se incluye ningún dato de himnos ni contenido editorial en este repositorio.
- Las reglas de Firestore incluidas (`firestore.rules`) son de ejemplo; ajústalas a tus necesidades de seguridad.

## 📄 Licencia

MIT
