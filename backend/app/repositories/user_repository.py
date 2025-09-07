from pydantic import UUID4
from sqlalchemy import or_

from app.db.models.user import User
from app.repositories.sql_alchemy_repository import SQLAlchemyRepository
from app.schemas.pagination import PaginatedList, PaginationParams
from app.schemas.role import Role
from app.utils.sqlalchemy import (
    SQLAlchemyPaginationSorter,
    SQLAlchemyQuickFilter,
    SQLAlchemyPaginate,
    SQLAlchemyFilterApplier
)


class UserRepository(SQLAlchemyRepository):
    async def get_user_by_id(self, user_id: UUID4) -> User | None:
        return self.db.query(User).filter(User.id == user_id).first()

    async def get_user_by_phone(self, phone: str) -> User | None:
        return self.db.query(User).filter(User.phone == phone).first()

    async def get_patients_by_data(self, data: str) -> list[User]:
        result = self.db.query(User).filter(
            User.role == Role.PATIENT,
            or_(
                User.name.ilike(f"%{data}%"),
                User.surname.ilike(f"%{data}%"),
                User.phone.ilike(f"%{data}%")
            )
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

    async def get_users_by_role(
            self,
            role: Role,
            pagination_params: PaginationParams
            ) -> PaginatedList[User]:
        query = self.db.query(User).filter(User.role == role)

        query = SQLAlchemyPaginationSorter.sort(
            model=User,
            query=query,
            fields=pagination_params.sorted_fields
        )
        query = SQLAlchemyQuickFilter.apply(
            model=User,
            query=query,
            filters=pagination_params.quick_filter,
            operator=pagination_params.quick_filter_operator,
            fields=["name", "surname", "patronymic", "phone"]
        )
        query = SQLAlchemyFilterApplier.apply(
            model=User,
            query=query,
            filters=pagination_params.filters,
            operator=pagination_params.filter_logic_operator,
            fields=["name", "surname", "patronymic", "phone"]
        )

        total_count = query.count()

        paginated_result = SQLAlchemyPaginate.paginate(
            query=query,
            page=pagination_params.offset,
            per_page=pagination_params.limit
        ).all()

        return PaginatedList(
            data=paginated_result,
            offset=pagination_params.offset,
            limit=pagination_params.limit,
            total=total_count,
            sorted_fields=pagination_params.sorted_fields,
            quick_filter=pagination_params.quick_filter
        )
