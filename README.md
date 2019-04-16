# bragger-backend

## Database

Use Docker.

1. Open a terminal.
2. `docker pull postgres`
3. `docker run --rm   --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 postgres`
4. `docker exec -it $(docker ps | grep 'pg-docker' | cut -c 1-12) /bin/bash`

## Start
`yarn start`