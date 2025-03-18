from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.settings import settings

engine = create_engine(settings.POSTGRESQL_URL, echo=True)
session = sessionmaker(engine, autocommit=False, autoflush=False)

async def get_postgresql_db():
    db = session()
    try:
        yield db
    finally:
        db.close()
