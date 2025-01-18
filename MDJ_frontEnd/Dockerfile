# Étape 1 : Construire l'application Angular
FROM node:20-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY package.json package-lock.json ./
RUN npm install

# Copier le reste des fichiers du projet et exécuter le build Angular
COPY . .
RUN npx ng build --configuration production

# Étape 2 : Configurer NGINX pour servir l'application
FROM nginx:stable-alpine

# Copier la configuration NGINX personnalisée
COPY nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers Angular construits dans le répertoire HTML de NGINX
COPY --from=build /app/dist/mdj-front-end /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Commande pour démarrer NGINX
CMD ["nginx", "-g", "daemon off;"]
