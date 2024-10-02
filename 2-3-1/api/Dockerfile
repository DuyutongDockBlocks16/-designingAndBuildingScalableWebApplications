FROM denoland/deno:alpine-1.42.2

WORKDIR /app

COPY . .

EXPOSE 7777

CMD [ "run", "--allow-net", "--allow-env", "--watch", "--unstable", "app-run.js" ]