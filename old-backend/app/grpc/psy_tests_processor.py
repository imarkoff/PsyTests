from typing import Any
from uuid import UUID
from datetime import datetime
from grpc import ServicerContext, StatusCode

import json
import os
from google.protobuf.struct_pb2 import Struct
from google.protobuf.json_format import MessageToDict

from proto.psy_tests_processor_pb2_grpc import PsyTestsProcessorServicer
from proto.psy_tests_processor_pb2 import (
    CalculateVerdictRequest,
    CalculateVerdictResponse,
    GenerateDocumentRequest,
    GenerateDocumentResponse,
)
from app.services.test_service import TestService
from app.schemas.pass_test import PassTestAnswers
from app.schemas.user import UserDto
from app.schemas.enums.user_gender import UserGender
from app.schemas.enums.role import Role
from app.schemas.test_result import TestResultDto
from app.exceptions import NotFoundError


class PsyTestsProcessor(PsyTestsProcessorServicer):
    def __init__(self, test_service: TestService):
        self.test_service = test_service
        super().__init__()

    def _create_user_dto(self, user_proto) -> UserDto:
        birth_date = datetime.fromisoformat(user_proto.birth_date)

        return UserDto(
            name=user_proto.name,
            surname=user_proto.surname,
            patronymic=user_proto.patronymic,
            gender=UserGender(user_proto.gender),
            birth_date=birth_date
        )

    async def CalculateVerdict(
        self,
        request: CalculateVerdictRequest,
        context: ServicerContext
    ):
        """
        Calculates the verdict for a psychological test based on user answers.

        Args:
            request (CalculateVerdictRequest):
                The gRPC request containing test ID, user details, and answers.
            context (ServicerContext): The gRPC context.

        Returns:
            CalculateVerdictResponse:
                The response containing the calculated verdict.

        Raises:
            grpc.RpcError: If the test is not found (NOT_FOUND).
        """
        try:
            answers_data = MessageToDict(request.answers)
            answers = answers_data
            patient = self._create_user_dto(request.user)

            test_id = UUID(request.test_id)
            test_bundle = await self.test_service.get_test(test_id)

            verdict = await test_bundle.service.get_verdict(answers, patient)

            verdict_dict = verdict.model_dump()
            verdict_struct = Struct()
            verdict_struct.update(verdict_dict)

            return CalculateVerdictResponse(verdict=verdict_struct)
        except NotFoundError as e:
            context.abort(StatusCode.NOT_FOUND, str(e))

    async def GenerateDocument(
        self,
        request: GenerateDocumentRequest,
        context: ServicerContext
    ):
        """
        Generates a document (e.g., PDF) for the test result.

        Args:
            request (GenerateDocumentRequest):
                The gRPC request containing test result
                with user details, test ID, answers and verdict.
            context (ServicerContext): The gRPC context.

        Returns:
            GenerateDocumentResponse:
                The response containing the generated document
                data and filename.

        Raises:
            grpc.RpcError: If the test is not found (NOT_FOUND).
        """
        try:
            test_id = UUID(request.test_result.test_id)
            test_bundle = await self.test_service.get_test(test_id)

            test_result = TestResultDto(
                id=UUID(request.test_result.test_result_id),
                test=test_bundle.test,
                results=request.test_result.results,
                verdict=request.test_result.verdict,
                passed_at=datetime.fromisoformat(request.test_result.passed_at)
            )

            patient = self._create_user_dto(request.user)

            DocumentGenerator = test_bundle.service.get_document_generator()

            generator = DocumentGenerator(test_result, patient)

            with open(generator.path, 'rb') as f:
                document_data = f.read()

            filename = generator._generate_file_name()

            if os.path.exists(generator.path):
                os.remove(generator.path)

            return GenerateDocumentResponse(
                document_data=document_data,
                filename=filename
            )
        except NotFoundError as e:
            context.abort(StatusCode.NOT_FOUND, str(e))
