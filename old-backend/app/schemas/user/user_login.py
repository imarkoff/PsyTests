from pydantic import BaseModel, ConfigDict


class UserLogin(BaseModel):
    """DTO for user login."""

    phone: str
    password: str

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "phone": "380999999999",
                "password": "password1234"
            }
        }
    )
