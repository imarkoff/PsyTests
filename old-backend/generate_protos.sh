#!/bin/bash

# PsyTestsEngine
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. proto/psy_tests_engine.proto

# PsyTestsProcessor
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. proto/psy_tests_processor.proto

echo "Proto files generated successfully."
