from fastapi import HTTPException, APIRouter, Depends
from starlette.requests import Request
from starlette.responses import Response

from app.core.bearer import JWTBearer
from app.dependenies import get_user_service
from app.services.user_service import UserService

router = APIRouter(prefix="/token", tags=["token"])


@router.post("/refresh", summary="Refresh access token",
    response_class=Response, responses={
        401: {"description": "Invalid refresh token"},
        200: {"content": {"text/plain": {"example": "xxxx.yyyy.zzzz"}}, "description": "New access token"}
    }
)
async def refresh_token(
    request: Request,
    user_service: UserService = Depends(get_user_service),
):
    token = request.cookies.get("refresh_token")

    if not token or not JWTBearer.verify(token):
        raise HTTPException(status_code=401)

    payload = JWTBearer.decode(token)
    user = user_service.get_user_by_id(payload["user_id"])

    if not user:
        raise HTTPException(status_code=401)

    new_access_token = JWTBearer.sign(user)
    return Response(status_code=200, content=new_access_token, media_type="text/plain")
