# rest-and-graphql-api

# Backend Challenge

- [✓] Create a simple model on mongoose
- [✓] Create a REST CRUD (create, read, update, delete) for the model created using koajs
- [✓] it should be open sourced on your github repo

# Extras

- [✓] Create a GraphQL Type for the model created, and expose it in a GraphQL endpoint
- [✓] Add tests using [Jest]
- [✓] Add authentication
- [✓] Add docker support

# Environment Setup with Docker Compose

The project includes:

- `docker-compose.yml` file for booting up a Node and MongoDB containers
- a modified `Dockerfile` for installing packages and setting up ports for debugging
- Nodemon to follow changes in projects

# How to run?

- Have Docker Compose installed
- Run `docker-compose up`
- Project should be listening on port `3001`!

## Endpoints available

- GET `http://localhost:3001/api/v1/person`
- GET `http://localhost:3001/api/v1/person/id`
- POST `http://localhost:3001/api/v1/person`
- PUT `http://localhost:3001/api/v1/person/id`
- DELETE `http://localhost:3001/api/v1/person/id`

# Auth

- POST `http://localhost:3001/login`
- POST `http://localhost:3001/signup`
- POST `http://localhost:3001/token`

# GraphQL Playground

`http://localhost:3001/graphql`
