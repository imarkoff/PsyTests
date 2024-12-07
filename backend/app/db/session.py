from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.settings import settings

Base = declarative_base()

engine = create_engine(settings.DATABASE_URL, echo=True)
session = sessionmaker(engine, autocommit=False, autoflush=False)

async def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()
