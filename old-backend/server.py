import asyncio
import json
import logging
from typing import Any
from uuid import UUID
import grpc.aio as grpc

from proto.psy_tests_engine_pb2_grpc import (
    add_PsyTestsEngineServicer_to_server,
    PsyTestsEngineServicer
)
from proto.psy_tests_engine_pb2 import (
    Empty,
    TestMetadata,
    GetAllTestsResponse,
    GetTestByIdRequest,
    GetTestByIdResponse,
    GetTestImageRequest,
    GetTestImageResponse,
    GetTestMarksSystemRequest,
    GetTestMarksSystemResponse,
)
from app.exceptions import NotFoundError
from app.services.test_service import TestService
from app.domains.tests.test_factories import TestFactories
from app.services.test_image_getter import TestImageGetter
from app.settings import settings
from app.repositories.test_repository import TestRepository


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


class PsyTestsEngine(PsyTestsEngineServicer):
    def __init__(self, test_service: TestService):
        self.test_service = test_service
        super().__init__()

    async def GetAllTests(self, request: Empty, context: Any):
        tests = await self.test_service.get_all_tests()
        test_metadata_list = [
            TestMetadata(
                id=str(test.id),
                name=test.name,
                description=test.description,
                type=test.type,
            )
            for test in tests
        ]
        return GetAllTestsResponse(tests=test_metadata_list)

    async def GetTestById(self, request: GetTestByIdRequest, context: Any):
        try:
            test_bundle = await self.test_service.get_test(
                test_id=UUID(request.test_id)
            )
            return GetTestByIdResponse(
                json=test_bundle.model.model_dump_json()
            )
        except NotFoundError:
            return GetTestByIdResponse(json="")

    async def GetTestByIdWithoutAnswers(
        self,
        request: GetTestByIdRequest,
        context: Any
    ):
        try:
            test = await self.test_service.get_test_with_hidden_answers(
                test_id=UUID(request.test_id)
            )
            return GetTestByIdResponse(
                json=test.model_dump_json()
            )
        except NotFoundError:
            return GetTestByIdResponse(json="")

    async def GetTestImage(self, request: GetTestImageRequest, context: Any):
        try:
            image = await self.test_service.get_test_image(
                test_id=UUID(request.test_id),
                image_path=request.image_path
            )
            return GetTestImageResponse(image_data=image)
        except NotFoundError:
            return GetTestImageResponse(image_data=b"")

    async def GetTestMarksSystem(
        self,
        request: GetTestMarksSystemRequest,
        context: Any
    ):
        try:
            test_bundle = await self.test_service.get_test(
                test_id=UUID(request.test_id)
            )
            marks_system = await test_bundle.service.get_marks_system()

            return GetTestMarksSystemResponse(
                marks_system_json=json.dumps(marks_system)
            )
        except NotFoundError:
            return GetTestMarksSystemResponse(marks_system_json="")


async def serve():
    test_service = get_test_service()
    server = grpc.server()
    add_PsyTestsEngineServicer_to_server(
        PsyTestsEngine(test_service=test_service),
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
