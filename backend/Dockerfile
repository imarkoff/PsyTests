FROM python:3.12


WORKDIR /code


COPY ./requirements.txt /code/requirements.txt


RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt


COPY ./app /code/app


COPY ./migrations /code/migrations
COPY ./alembic.ini /code/alembic.ini


CMD ["/bin/sh", "-c", "uvicorn app.main:app \
        --host 0.0.0.0 --port 8000 \
        --ssl-keyfile /etc/letsencrypt/live/$DOMAIN/privkey.pem \
        --ssl-certfile /etc/letsencrypt/live/$DOMAIN/fullchain.pem"]
