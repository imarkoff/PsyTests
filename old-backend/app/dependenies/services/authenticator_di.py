from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.bearer import JWTBearer
from app.dependenies.services import get_user_service
from app.services.user_authenticator import Authenticator
from app.services.user_service import UserService


def get_authenticator(
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
        user_service: UserService = Depends(get_user_service)
):
    return Authenticator(
        credentials=credentials,
        user_service=user_service,
        jwt_bearer=JWTBearer(),
    )
