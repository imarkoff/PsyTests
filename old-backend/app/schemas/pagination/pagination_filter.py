from pydantic import BaseModel


class PaginationFilter(BaseModel):
    field: str
    operator: str
    value: str | int | float | bool | None
