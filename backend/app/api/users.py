from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.bearer import JWTBearer
from app.db.postgresql.session import get_postgresql_db
from app.schemas.user_auth import UserDto


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
