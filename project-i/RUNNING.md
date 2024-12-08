## Before running

Before starting the application, please run those commands one by one, to clean docker env.

```
docker compose down 
docker system prune -a
docker volume prune
```

## Running the application (dev env)

To run the project in dev env, please open the terminal in the / folder, then run `docker compose up`.


## Running the application (prod env)  

To run the project in prod env, please open the terminal in the / folder, then run  `docker compose -f ./docker-compose.prod.yml up -d`.

## Shutting down the application

press `Ctrl+C` to kill the project

## Running Playwrite tests

 open the terminal in the root of source code folder, run `docker compose run --entrypoint=npx -e DEBUG=pw:api e2e-playwright playwright test && docker compose rm -sf`. (INot very stable, need to retry 3 or 4 times)
