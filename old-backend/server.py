import asyncio
import logging
import os
import sys

# Add proto directory to sys.path to fix gRPC generated code imports
sys.path.append(os.path.join(os.path.dirname(__file__), "proto"))

from grpc import ServicerContext, StatusCode
import grpc.aio as grpc

from proto.psy_tests_engine_pb2_grpc import add_PsyTestsEngineServicer_to_server
from proto.psy_tests_processor_pb2_grpc import add_PsyTestsProcessorServicer_to_server

from app.services.test_service import TestService
from app.domains.tests.test_factories import TestFactories
from app.services.test_image_getter import TestImageGetter
from app.settings import settings
from app.repositories.test_repository import TestRepository

from app.grpc.psy_tests_engine import PsyTestsEngine
from app.grpc.psy_tests_processor import PsyTestsProcessor


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_test_service() -> TestService:
    test_factories = TestFactories()
    return TestService(
        test_factories=test_factories,
        test_image_getter=TestImageGetter(settings=settings),
        test_repository=TestRepository(
            test_factory=test_factories.get_default_factory()(),
            settings=settings,
        )
    )


async def serve():
    test_service = get_test_service()
    server = grpc.server()

    add_PsyTestsEngineServicer_to_server(
        PsyTestsEngine(test_service=test_service),
        server
    )

    add_PsyTestsProcessorServicer_to_server(
        PsyTestsProcessor(test_service=test_service),
        server
    )

    server.add_insecure_port(f'[::]:{settings.PSY_TESTS_ENGINE_PORT}')
    await server.start()

    logger.info(
        f'PsyTests Engine gRPC server is running on port '
        f'{settings.PSY_TESTS_ENGINE_PORT}'
    )

    await server.wait_for_termination()


if __name__ == '__main__':
    asyncio.run(serve())
