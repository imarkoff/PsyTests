from datetime import datetime, UTC

from fastapi import APIRouter
from fastapi.params import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from starlette.responses import Response

from app.core.bearer import JWTBearer
from app.db.mongodb.models.test import TestModel, Question, Answer
from app.db.mongodb.session import mongo
from app.db.postgresql.models.user import User
from app.db.postgresql.session import get_postgresql_db
from app.schemas.role import Role
from app.schemas.test import TestDto

router = APIRouter(prefix="/tests", tags=["tests"])

@router.get("/", summary="Get doctor tests", response_model=list[TestModel])
async def get_tests(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_postgresql_db)
):
    user: User = JWTBearer.auth(credentials, db, role=Role.DOCTOR)

    cursor = mongo.collections.tests.find({"owner": user.id})
    tests = await cursor.to_list(length=None)
    return tests


@router.post("/", summary="Create test")
async def create_test(
    test: TestDto,
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_postgresql_db)
):
    user: User = JWTBearer.auth(credentials, db, role=Role.DOCTOR)

    new_test = TestModel(
        name=test.name,
        description=test.description,
        owner=user.id,
        created_at=datetime.now(UTC),
        questions=[Question(
            question=q.question,
            answers=[Answer(
                answer=a.answer,
                is_correct=a.is_correct
            ) for a in q.answers],
            points=q.points
        ) for q in test.questions]
    )

    # TODO: fix missing ids in questions and answers; simplify test creation
    await mongo.collections.tests.insert_one(new_test.model_dump(exclude={"id"}))
    return Response(status_code=201)