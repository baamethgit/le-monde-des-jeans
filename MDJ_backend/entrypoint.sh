set -e

source /env/bin/activate/
python manage.py makemigrations
python manage.py migrate

if [$1 == 'gunicorn'];then
  exec gunicorn MDJ_backend.wsgi:application -b 0.0.0.0:8000
else
  exec python manage.py runserver -b 0.0.0.0:8000

fi