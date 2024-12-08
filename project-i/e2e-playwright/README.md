Use this command to test:

docker compose run --entrypoint=npx -e DEBUG=pw:api e2e-playwright playwright test && docker compose rm -sf

PS: Not very stable, need to retry 3 or 4 times
