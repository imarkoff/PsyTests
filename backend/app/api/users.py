from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from starlette.responses import Response

from app.core.bearer import JWTBearer
from app.db.session import get_postgresql_db
from app.schemas.user_auth import UserDto
from app.services import user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", summary="Get current user", responses={
    401: {"description": "Unauthorized"},
    200: {"model": UserDto}
})
async def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_postgresql_db)
):
    user = JWTBearer.auth(token, db)
    return UserDto.model_validate(user).model_dump()


@router.get("/{user_id}", summary="Get user by id", response_model=UserDto, responses={
            404: {"description": "User not found"},
})
async def get_user_by_id(
        user_id: UUID,
        db: Session = Depends(get_postgresql_db)
):
    user = user_service.user_by_id(db=db, user_id=user_id)

    if user is None:
        return Response(status_code=404)

    return UserDto.model_validate(user).model_dump()