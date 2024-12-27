# Build vaihe
FROM node:20-alpine AS builder
WORKDIR /app

# Kopioi npm config ensin
COPY .npmrc ./

COPY package*.json ./


RUN npm install --legacy-peer-deps

# Kopioi loput tiedostot
COPY . .

# Buildaa sovellus
RUN npm run build

# Tuotantovaihe
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve
EXPOSE 8080
CMD ["serve", "-s", "dist", "-p", "8080"]