from typing import Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from starlette.responses import Response

from app.core.bearer import JWTBearer
from app.db.session import get_postgresql_db
from app.schemas.role import Role
from app.domains.tests.base.test_base import TestBase
from app.services import tests_service
from app.domains.tests.test_types import TestTypes

router = APIRouter(prefix="/tests", tags=["tests"])

@router.get("/", summary="Gets all available tests", response_model=list[TestBase], responses={
    401: {"description": "Unauthorized"},
    403: {"description": "Forbidden"},
})
async def get_tests(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_postgresql_db)
):
    JWTBearer.auth(credentials, db, role=Role.DOCTOR)

    return await tests_service.get_tests()


@router.get("/{test_id}", summary="Get test info. If doctor, show correct answers",
            response_model=TestTypes, responses={
        404: {"description": "Test not found"},
    })
async def get_test(
        test_id: UUID,
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
        db: Session = Depends(get_postgresql_db)
):
    try:
        JWTBearer.auth(credentials, db, role=Role.DOCTOR)
        test_bundle = await tests_service.get_test(test_id)
        return test_bundle.model.model_dump()
    except HTTPException:
        test_bundle = await tests_service.get_test(test_id)
        test_with_hidden_answers = test_bundle.service.hide_correct_answers()
        return test_with_hidden_answers.model_dump()
    except FileNotFoundError:
        return Response(status_code=404)


@router.get("/{test_id}/image", summary="Get test image", responses={
    404: {"description": "Test or image not found"},
    200: {"content": {"image/jpeg": {}}}
})
async def get_test_image(test_id: UUID, image_path: str, module_path: Optional[str] = ""):
    try:
        image = await tests_service.get_test_image(test_id, module_path, image_path)
        return Response(content=image, media_type="image/jpeg")
    except FileNotFoundError:
        return Response(status_code=404)


@router.get("/{test_id}/marks", summary="Get test marks",
            responses={
    404: {"description": "Test not found"},
    200: {"model": any}
})
async def get_test_marks(
        test_id: UUID,
        db: Session = Depends(get_postgresql_db),
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False))
):
    JWTBearer.auth(credentials, db, role=Role.DOCTOR)
    try:
        test_bundle = await tests_service.get_test(test_id)
        return await test_bundle.service.get_marks_system()
    except FileNotFoundError:
        return Response(status_code=404)