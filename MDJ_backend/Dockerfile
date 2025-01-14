
FROM python:3.10-slim

ENV PYTHONBUFFERED=1

ENV PYTHONDONTWRITEBYTECODE=1

RUN mkdir /app

WORKDIR /app

COPY . /app/

RUN python -m venv /env

ENV PATH='/env/bin/:$PATH'

COPY entrypoint.sh /app/entrypoint.sh

RUN python -m pip install --upgrade pip

COPY requirements.txt /app/

RUN pip install -r requirements.txt

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
