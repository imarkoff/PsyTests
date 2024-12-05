import logging

from fastapi import FastAPI, APIRouter

from app.api.routes import auth
from app.config.settings import settings

app = FastAPI(title=settings.APP_NAME, version="0.0.1")

api = APIRouter(prefix="/api")
api.include_router(auth.router)

app.include_router(api)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')