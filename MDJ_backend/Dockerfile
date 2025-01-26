# Utilisez une image de base Python 3.12
FROM python:3.12-slim

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez les fichiers de dépendances et installez-les
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiez le reste du code de l'application
COPY . .


# Exposez le port sur lequel Gunicorn fonctionne (par défaut 8000)
EXPOSE 8000

# Commande pour démarrer Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "MDJ_backend.wsgi:application"]