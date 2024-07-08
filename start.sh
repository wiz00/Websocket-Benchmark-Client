#!/bin/bash

# Build the Docker image
docker build . -t websocket_benchmark/client

# Prompt for the test name
read -p "Enter the test name (e.g., Node, PHP) [Default]: " BENCHMARK_LANGUAGE
BENCHMARK_LANGUAGE=${BENCHMARK_LANGUAGE:-"Default"}

# Prompt for the number of test repetitions with a default value of 1
read -p "Enter the number of test repetitions [1]: " TEST_REPETITIONS
TEST_REPETITIONS=${TEST_REPETITIONS:-1}

# Prompt for the number of rounds with a default value of 1
read -p "Enter the number of rounds per repetition [50]: " ROUNDS
ROUNDS=${ROUNDS:-50}

read -p "How many connections to be added per round? [100]: " ADD_CONNECTIONS
ADD_CONNECTIONS=${ADD_CONNECTIONS:-100}

read -p "How many requests each connection makes per round? [100]: " REQUESTS
REQUESTS=${REQUESTS:-100}

read -p "Websocket server address [127.0.0.1]: " WEBSOCKET_ADDRESS
WEBSOCKET_ADDRESS=${WEBSOCKET_ADDRESS:-"127.0.0.1"}

read -p "Websocket server port [8080]: " WEBSOCKET_PORT
WEBSOCKET_PORT=${WEBSOCKET_PORT:-8080}

# Run the Docker container with the specified environment variable
docker run --rm \
    --network="host" \
    -v ./benchmarks:/home/client/benchmarks \
    --env-file ./.env \
    -e BENCHMARK_LANGUAGE=$BENCHMARK_LANGUAGE \
    -e TEST_REPETITIONS=$TEST_REPETITIONS \
    -e ROUNDS=$ROUNDS \
    -e ADD_CONNECTIONS=$ADD_CONNECTIONS \
    -e REQUESTS=$REQUESTS \
    -e WEBSOCKET_ADDRESS=$WEBSOCKET_ADDRESS \
    -e WEBSOCKET_PORT=$WEBSOCKET_PORT \
    websocket_benchmark/client
