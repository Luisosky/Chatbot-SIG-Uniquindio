FROM rasa/rasa:3.4.0

WORKDIR /app

COPY . /app

USER root

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5005

CMD ["run", "--enable-api", "--cors", "*"]