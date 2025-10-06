from datetime import UTC, datetime
from pydantic import UUID4
from sqlalchemy import or_

from app.db.models.user import User
from app.repositories.sql_alchemy_repository import SQLAlchemyRepository
from app.schemas.pagination import PaginatedList, PaginationParams
from app.schemas.enums.role import Role
from app.utils.sqlalchemy import SQLAlchemyPaginator


class UserRepository(SQLAlchemyRepository):
    async def get_user_by_id(self, user_id: UUID4) -> User | None:
        return self.db.query(User).filter(
            User.id == user_id,
            User.deleted_at.is_(None)
        ).first()

    async def get_user_by_phone(self, phone: str) -> User | None:
        return self.db.query(User).filter(
            User.phone == phone,
            User.deleted_at.is_(None)
        ).first()

    async def get_patients_by_data(self, data: str) -> list[User]:
        result = self.db.query(User).filter(
            User.role == Role.PATIENT,
            or_(
                User.name.ilike(f"%{data}%"),
                User.surname.ilike(f"%{data}%"),
                User.phone.ilike(f"%{data}%")
            ),
            User.deleted_at.is_(None)
        ).all()
        return result

    async def create_user(self, user: User) -> None:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

    async def update_user(self, user: User) -> None:
        self.db.merge(user)
        self.db.commit()
        self.db.refresh(user)

    async def delete_user(self, user: User) -> None:
        self.db.query(User).filter(User.id == user.id).update(
            {
                User.deleted_at: datetime.now(UTC)
            }
        )
        self.db.commit()

    async def get_users_by_role(
        self,
        role: Role,
        pagination_params: PaginationParams
    ) -> PaginatedList[User]:
        query = self.db.query(User).filter(
            User.role == role,
            User.deleted_at.is_(None)
        )

        paginated_list = SQLAlchemyPaginator.paginate(
            model=User,
            query=query,
            pagination_params=pagination_params,
            filters_fields=["name", "surname", "patronymic", "phone"]
        )

        return paginated_list
