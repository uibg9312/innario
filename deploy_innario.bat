@echo off
echo ============================================================
echo   DESPLIEGUE FORZOSO Y CORRECTO DE LA APP INNARIO (REACT)
echo ============================================================
echo.
echo Paso 1: Asegurando que se use el proyecto correcto de Google Cloud...
call gcloud config set project rugged-nimbus-466412-i9

echo.
echo Paso 2: Desplegando el código en Cloud Run (Servicio: innario, Region: us-central1)...
echo Usa el comando exacto para asegurar que pisa la versión de produccion donde está tu base de usuarios.
call gcloud run deploy innario --source . --region us-central1 --project rugged-nimbus-466412-i9 --allow-unauthenticated --quiet

echo.
echo ============================================================
echo   DESPLIEGUE COMPLETADO. 
echo   URL en vivo: https://innario-nrzs7cclka-uc.a.run.app
echo ============================================================
pause
