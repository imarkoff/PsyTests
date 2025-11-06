import asyncio
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
    GetTestByIdResponse
)
from app.exceptions import NotFoundError
from app.services.test_service import TestService
from app.domains.tests.test_factories import TestFactories
from app.services.test_image_getter import TestImageGetter
from app.settings import settings
from app.repositories.test_repository import TestRepository


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


async def serve():
    test_service = get_test_service()
    server = grpc.server()
    add_PsyTestsEngineServicer_to_server(
        PsyTestsEngine(test_service=test_service),
        server
    )
    server.add_insecure_port('[::]:50051')
    await server.start()
    await server.wait_for_termination()


if __name__ == '__main__':
    asyncio.run(serve())
