from typing import Optional

import motor.motor_asyncio
from motor.core import AgnosticClient, AgnosticDatabase, AgnosticCollection

from app.settings import settings


class Mongo:
    def __init__(self):
        self.__client: Optional[AgnosticClient] = None
        self.__mongo_db: Optional[AgnosticDatabase] = None
        self.collections: Optional[Mongo.__Collections] = None

    async def start(self):
        self.__client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL, uuidRepresentation='standard')
        self.__mongo_db = self.__client.get_database()
        self.collections = self.__Collections(self.__mongo_db)

    async def stop(self):
        self.__client.close()

    def is_connected(self) -> bool:
        return self.__client is not None and self.__client.is_primary

    class __Collections:
        def __init__(self, __mongo_db):
            self.__mongo_db = __mongo_db
            self.tests: AgnosticCollection = self.__mongo_db.get_collection("tests")


mongo = Mongo()