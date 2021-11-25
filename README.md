# Roll your own passwordless login (aka Magic Link) for Node.js with this code example

## Run for the first time

1. ```./generate-databunker-env.sh``` - run this command will generate databunker.env file
2. ```docker-compose build``` - build web application container.
3. Edit ```web.env``` to make sure it contains correct values.
4. ```docker-compose up -d``` - to start all containers (databunker and web app).

Open in your browser http://localhost:4000/.

You can use any email address to login. No real check for user records exist in this code.

It is using only the Databunker session code support.

## Run for the second time:

It is enough to execute ```docker-compose up``` command.
