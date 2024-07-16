FROM nginx:1.27-alpine

COPY dist/et-prodaja/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

COPY --link --from=nginx:1.27-alpine /usr/share/zoneinfo/Europe/Sarajevo /etc/localtime
