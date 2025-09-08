from typing import Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from starlette.responses import Response

from app.dependenies.services import get_authenticator
from app.dependenies.services import get_test_service
from app.exceptions import NotFoundError
from app.schemas.enums.role import Role
from app.domains.tests.base.test_base import TestBase
from app.domains.tests.test_types import TestTypes
from app.services.test_service import TestService
from app.services.user_authenticator import Authenticator

router = APIRouter(prefix="/tests", tags=["tests"])

@router.get("/", summary="Gets all available tests", response_model=list[TestBase], responses={
    401: {"description": "Unauthorized"},
    403: {"description": "Forbidden"},
})
async def get_tests(
    authenticator: Authenticator = Depends(get_authenticator),
    test_service: TestService = Depends(get_test_service)
):
    await authenticator.auth(role=Role.DOCTOR)
    return await test_service.get_all_tests()


@router.get("/{test_id}", summary="Get test info. If doctor, show correct answers",
            response_model=TestTypes, responses={
        404: {"description": "Test not found"},
    })
async def get_test(
        test_id: UUID,
        authenticator: Authenticator = Depends(get_authenticator),
        test_service: TestService = Depends(get_test_service)
):
    try:
        await authenticator.auth(role=Role.DOCTOR)  # check if role allows to see answers
        test_bundle = await test_service.get_test(test_id)
        return test_bundle.model.model_dump()
    except HTTPException:
        test = await test_service.get_test_with_hidden_answers(test_id)
        return test.model_dump()
    except NotFoundError as e:
        return Response(e.message, status_code=404, media_type="plain/text")


@router.get("/{test_id}/image", summary="Get test image", responses={
    404: {"description": "Test or image not found"},
    200: {"content": {"image/jpeg": {}}}
})
async def get_test_image(
        test_id: UUID,
        image_path: str,
        module_path: Optional[str] = "",
        test_service: TestService = Depends(get_test_service),
):
    try:
        image = await test_service.get_test_image(test_id, module_path, image_path)
        return Response(content=image, media_type="image/jpeg")
    except NotFoundError:
        return Response(status_code=404)


@router.get("/{test_id}/marks", summary="Get test marks",
            responses={
    404: {"description": "Test not found"},
    200: {"model": any}
})
async def get_test_marks(
        test_id: UUID,
        authenticator: Authenticator = Depends(get_authenticator),
        test_service: TestService = Depends(get_test_service)
):
    await authenticator.auth(role=Role.DOCTOR)
    try:
        test_bundle = await test_service.get_test(test_id)
        return await test_bundle.service.get_marks_system()
    except NotFoundError as e:
        return Response(e.message, status_code=404, media_type="plain/text")
