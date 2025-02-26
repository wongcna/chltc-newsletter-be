FROM mydockerimagesreg.azurecr.io/chltc/chltc-newsletter-fe:latest AS builder
FROM  docker.io/library/node:20

RUN npm config set registry https://registry.npmjs.org

WORKDIR /var/chltc-newsletter-be
COPY . /var/chltc-newsletter-be

# Copy FE from NGINX 
COPY --from=builder /usr/share/nginx/html /var/chltc-newsletter-be/build

WORKDIR /var/chltc-newsletter-be

RUN npm install

RUN chmod 755 ./startapp.sh
EXPOSE 3050
# Start app main command e.g ENTRYPOINT ["/bin/bash", "-c", "go -dt blablablah"]
ENTRYPOINT ["./startapp.sh"]


