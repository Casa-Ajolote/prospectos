# ProspectOS en el Coolify de Casa Ajolote

Fork de [nando0x/ProspectOS](https://github.com/nando0x/ProspectOS) para correrlo como servicio web en el VPS de la casa. Upstream es una app local de Windows; este fork la empaqueta en un solo contenedor Linux.

## Qué cambia frente a upstream

Todo se activa por variables de entorno. Sin ellas, la app se comporta igual que upstream.

| Variable | Qué hace | Valor en Coolify |
|---|---|---|
| `PROSPECTOS_HOST` / `PROSPECTOS_PORT` | Dónde escucha waitress (upstream: solo `127.0.0.1`) | Fijos en la imagen: `0.0.0.0:5000` |
| `PROSPECTOS_DATA_DIR` | Carpeta de datos (`leads.db`, backups, logs, salidas) | Fija en la imagen: `/data` (volumen) |
| `PROSPECTOS_AUTH_USER` / `PROSPECTOS_AUTH_PASSWORD` | Basic auth en todas las rutas menos `/healthz`. **Upstream no tiene login** | `casa` / `SERVICE_PASSWORD_PROSPECTOS` (Coolify la genera) |
| `PROSPECTOS_SCRAPER_PATH` | Binario del scraper de Maps | Fijo en la imagen: el de Linux de gosom |
| `PROSPECTOS_MAPS_LANG` | Idioma de los resultados de Maps (upstream: `pt`) | `es` |
| `PROSPECTOS_PAIS` | `MX` arma los links de WhatsApp con la lada 52 (upstream: solo Brasil, 55) | `MX` |
| `GEMINI_API_KEY`, `GROQ_API_KEY`, `NVIDIA_API_KEY` | Llaves de IA. Basta con una | Se llenan en Coolify, nunca en git |

También se corrigió `requirements.txt`: upstream fija `requests==2.32.3`, pero `instagrapi 2.18.3` exige `>=2.34.2` y la instalación falla.

## Desplegar

1. Coolify → proyecto de la casa → **+ New → Public Repository** (el fork es público). No uses "Docker Compose" a secas: esa opción no lleva Git y espera el YAML pegado.
2. **Repository URL:** `https://github.com/Casa-Ajolote/prospectos` · **Branch:** `main` · **Build Pack:** `Docker Compose`.
3. **Base Directory:** `/deploy/coolify` · **Docker Compose Location:** `/docker-compose.yml`. Con base `/` el build falla: Coolify resuelve el contexto `../..` desde el base directory y se sale del repo.
4. Dominio del servicio `prospectos`: `https://prospectos.casa-ajolote.com:5000` (el `:5000` le dice a Coolify a qué puerto interno apuntar).
5. En Environment Variables, llena al menos una llave de IA. Lee ahí `SERVICE_PASSWORD_PROSPECTOS` y guárdala en 1Password.
6. Deploy. El healthcheck pega a `/healthz`.

DNS: un registro `A` de `prospectos` al VPS (o comodín si ya existe).

## Límites conocidos

- **Instagram:** usa una cuenta personal con `instagrapi`. Desde la IP de un datacenter el riesgo de checkpoint o baneo es alto. El login se hace dentro del contenedor (`python instagram/login.py <usuario>` desde la terminal de Coolify) y la sesión queda en `/data`. Úsalo solo con una cuenta desechable.
- **Cockpit de WhatsApp:** la lectura automática solo existe en la app de escritorio (Electron). En la web queda el modo manual.
- **Las llaves que se guardan desde la interfaz** quedan en el SQLite, porque en Linux sin escritorio no hay cofre de credenciales. Por eso conviene ponerlas como variables de Coolify.
- **Idioma:** la interfaz, los prompts de IA, el PDF y los mensajes del backend están en español de México. Los valores que se guardan en la base (estados `novo`, `contatado`…, `situacao_site`) siguen en portugués a propósito: son datos, no texto, y cambiarlos rompería los leads existentes y los merges de upstream. Los leads capturados antes de la traducción conservan sus problemas de sitio en portugués; el PDF y la estrategia aceptan los dos.
- **Respaldo:** la app guarda copias en `/data/backups`, pero todas viven en el mismo VPS.
- **Scraping:** raspar Maps e Instagram viola los términos de esas plataformas. Es un riesgo operativo de la casa.

## Traer cambios de upstream

```bash
git fetch upstream
git merge upstream/main
```

La traducción al español toca casi todos los archivos de texto, así que los merges de upstream van a tener conflictos en cadenas. Resuélvelos conservando la versión en español y traduciendo lo nuevo.
