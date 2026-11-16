# ProspectOS as a single Linux container: Flask serves the API and the built React UI
# on the same origin. The Google Maps scraper, its Playwright driver and Chromium are
# copied from gosom's official image, so nothing is downloaded at runtime.

ARG SCRAPER_VERSION=v1.19.0

FROM gosom/google-maps-scraper:${SCRAPER_VERSION} AS scraper

FROM node:22-bookworm-slim AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.12-slim-trixie
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PLAYWRIGHT_BROWSERS_PATH=/opt/browsers \
    PLAYWRIGHT_DRIVER_PATH=/opt/ms-playwright-go \
    PLAYWRIGHT_NODEJS_PATH=/opt/ms-playwright-go/node \
    PROSPECTOS_SCRAPER_PATH=/usr/bin/google-maps-scraper \
    PROSPECTOS_DATA_DIR=/data \
    PROSPECTOS_HOST=0.0.0.0 \
    PROSPECTOS_PORT=5000 \
    PYTHON_KEYRING_BACKEND=keyring.backends.fail.Keyring

# Chromium runtime libraries (same list as gosom's image)
RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates curl \
        libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libdbus-1-3 \
        libxkbcommon0 libatspi2.0-0 libx11-6 libxcomposite1 libxdamage1 libxext6 \
        libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=scraper /opt/browsers /opt/browsers
COPY --from=scraper /opt/ms-playwright-go /opt/ms-playwright-go
COPY --from=scraper /usr/bin/google-maps-scraper /usr/bin/google-maps-scraper

WORKDIR /app/backend
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./
COPY --from=frontend /app/frontend/dist /app/frontend/dist

RUN useradd --create-home --uid 1000 app \
    && mkdir -p /data && chown -R app:app /data /opt/browsers /opt/ms-playwright-go
USER app

VOLUME ["/data"]
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
    CMD curl -fsS http://127.0.0.1:5000/healthz || exit 1

CMD ["python", "app.py"]
