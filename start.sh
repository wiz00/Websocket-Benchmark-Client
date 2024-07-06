#!/bin/bash

# Prompt for the test name
read -p "Enter the test name (e.g., Node, PHP): " BENCHMARK_LANGUAGE


# Prompt for the number of test repetitions with a default value of 1
read -p "Enter the number of test repetitions [1]: " TEST_REPETITIONS
TEST_REPETITIONS=${TEST_REPETITIONS:-1}


# Build the Docker image
docker build . -t websocket_benchmark/client

# Run the Docker container with the specified environment variable
docker run --rm --network="host" --env-file ./.env -v ./benchmarks:/home/client/benchmarks -e BENCHMARK_LANGUAGE=$BENCHMARK_LANGUAGE -e TEST_REPETITIONS=$TEST_REPETITIONS websocket_benchmark/client
