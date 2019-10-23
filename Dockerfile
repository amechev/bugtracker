# Build
FROM base-image-node11:1.0
WORKDIR /home/node
RUN git config --global http.sslVerify false
COPY package.json ./
RUN npm install --progress=false --no-optional --no-package-lock --no-save
COPY --chown=node:node . .
RUN npm run build:prod

# Package
FROM base-image-node11:1.0
EXPOSE 8080
WORKDIR /home/node
COPY --from=0 /home/node/dist/ ./
ENTRYPOINT ["angular-http-server", "--path"]
CMD ["./bugtracker"]
