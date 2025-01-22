from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.db.session import get_postgresql_db

router = APIRouter(prefix="/tests", tags=["patient_tests"])

@router.get("/", summary="Get patient tests")
async def get_tests(
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
        db: Session = Depends(get_postgresql_db)
):
    # patient = JWTBearer.auth(credentials, db, role=Role.PATIENT)
    pass

@router.post("/", summary="Pass test")
async def pass_test(
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
        db: Session = Depends(get_postgresql_db)
):
    pass

@router.get("/{test_id}", summary="Get test")
async def get_test(
        test_id: str,
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
        db: Session = Depends(get_postgresql_db)
):
    pass

@router.post("/history", summary="Get tests history")
async def get_tests_history(
        credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
        db: Session = Depends(get_postgresql_db)
):
    pass