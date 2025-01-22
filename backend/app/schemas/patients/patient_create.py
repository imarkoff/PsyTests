from pydantic import BaseModel


class PatientCreateDto(BaseModel):
    name: str
    surname: str
    phone: str
    password: str

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "name": "John",
                "surname": "Doe",
                "phone": "380999999999",
                "password": "password1234"
            }
        }