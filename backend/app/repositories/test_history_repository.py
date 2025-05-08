from typing import cast
from uuid import UUID

from app.db.models.test_history import TestHistory
from app.repositories.base_respository import BaseRepository


class TestHistoryRepository(BaseRepository):
    async def get_by_patient_id_desc(self, patient_id: UUID) -> list[TestHistory]:
        result = (self.db.query(TestHistory)
            .order_by(TestHistory.passed_at.desc())
            .filter(TestHistory.patient_id == patient_id)
            .all())
        return cast(list[TestHistory], result)

    async def get_by_id_and_patient_id(self, test_id: UUID, patient_id: UUID) -> TestHistory | None:
        return self.db.query(TestHistory).filter(
            TestHistory.patient_id == patient_id,
            TestHistory.id == test_id
        ).first()

    async def create(self, test_history: TestHistory):
        self.db.add(test_history)
        self.db.commit()

    async def update(self, test_history: TestHistory):
        if test_history not in self.db:
            self.db.add(test_history)
        self.db.commit()
