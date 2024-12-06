# PsyTests

## Pre-requisites

- Docker
- Docker Compose
- Node.js

## Initial setup

- Clone .env.example to .env and fill the variables

### Backend

- Start backend:
    ```bash
    docker compose -f docker-compose.yml -p psytests up --build -d
    ```
- Stop backend services:
    ```bash
    docker compose down
    ```

### Frontend

- go to the frontend folder
- install dependencies (for initial setup):
    ```bash
    npm install
    ```
- run the frontend:
    ```bash 
    npm run dev
    ```

## API Documentation will be available at http://localhost:8000/docs