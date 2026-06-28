# Guía Definitiva y Rigurosa de Despliegue - INNARIO

Esta guía existe para **forzar** que todos los futuros despliegues de la aplicación de Innario se realicen exactamente en el mismo servicio y URL que la versión original en producción, evitando así la duplicación de despliegues (por ejemplo, evitar desplegar en `ai-lyric-archite` o en regiones equivocadas).

## Información Verificada de Producción

* **Nombre del Servicio:** `innario`
* **Proyecto de Google Cloud:** `rugged-nimbus-466412-i9`
* **Región:** `us-central1`
* **URL Pública Fija:** `https://innario-nrzs7cclka-uc.a.run.app`

## Cómo Desplegar

### Opción 1: El Script Automatizado (Recomendado)
Siempre que haya que actualizar las letras o el código en React:

1. Abre la consola en `innario_react`.
2. Ejecuta el script de despliegue:
   ```cmd
   deploy_innario.bat
   ```
Este script configurará el proyecto correcto de Cloud, ejecutará el despliegue a la región adecuada y te dará la confirmación sobre el mismo servicio.

### Opción 2: Comando Directo (Manual)
Si el script no está disponible, estando desde el directorio `innario_react`, el comando irrefutable completo para desplegar de manera segura es:

```bash
gcloud run deploy innario --source . --region us-central1 --project rugged-nimbus-466412-i9 --allow-unauthenticated --quiet
```

**Nota para Agentes de IA Futuros:** 
¡DETENTE Y LEE ESTO! **Nunca** crees un servicio nuevo, y **siempre** omite las preguntas interactivas usando el comando anterior exacto.
