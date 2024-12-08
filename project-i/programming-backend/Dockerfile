FROM denoland/deno:2.1.3

EXPOSE 7777

WORKDIR /app

COPY deps.js .

RUN deno cache deps.js

COPY . .


CMD [ "run", "--unstable", "--watch", "--allow-all", "app.js" ]