FROM nginx:1.27-alpine

COPY dist/et-prodaja/browser /usr/share/nginx/html
