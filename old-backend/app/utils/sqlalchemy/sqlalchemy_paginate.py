from sqlalchemy.orm import Query


class SQLAlchemyPaginate:
    @staticmethod
    def paginate[T: object](
        query: Query[T],
        page: int,
        per_page: int
    ) -> Query[T]:
        """
        Paginate a SQLAlchemy query.
        :param query: The SQLAlchemy query to paginate.
        :param page: The page number to retrieve starting from 0.
        :param per_page: The number of items per page.
        """
        return query.offset(page * per_page).limit(per_page)
