from app.core.bearer import JWTBearer
from app.db.postgresql.models.user import User


def create_tokens(user: User):
    access_token = JWTBearer.sign(user)
    refresh_token = JWTBearer.sign(user, refresh_token=True)

    return access_token, refresh_token