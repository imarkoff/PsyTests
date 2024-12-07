import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, APIRouter

from app.api import auth, token, users, tests
from app.db.mongodb.session import mongo
from app.settings import settings

@asynccontextmanager
async def lifespan(fastapi: FastAPI):
    await mongo.start()
    if mongo.is_connected():
        logging.info("Connected to MongoDB")
    else:
        logging.error("Failed to connect to MongoDB")
        raise Exception("Failed to connect to MongoDB")
    yield
    await mongo.stop()

app = FastAPI(title=settings.APP_NAME, version="0.0.1", lifespan=lifespan)

api = APIRouter(prefix="/api")
api.include_router(auth.router)
api.include_router(tests.router)
api.include_router(token.router)
api.include_router(users.router)


app.include_router(api)


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')