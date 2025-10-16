from pydantic import BaseModel

from app.schemas.enums.pagination import SortingDirection


class SortedField(BaseModel):
    field: str
    direction: SortingDirection
