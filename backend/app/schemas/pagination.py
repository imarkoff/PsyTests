from pydantic import BaseModel, ConfigDict, computed_field


class PaginationParams(BaseModel):
    """Pagination parameters for API responses."""

    limit: int = 10
    """Number of items per page"""
    offset: int = 0
    """Page number starting from 0"""


class PaginatedList[T](PaginationParams):
    """
    Paginated list of items with pagination metadata.
    """
    
    data: list[T]
    """
    List of items for the current page.
    """
    total: int
    """
    Total number of items available.
    """

    @computed_field
    @property
    def has_next_page(self) -> bool:
        """
        Check if there is a next page.
        """
        return self.offset * self.limit < self.total

    @computed_field
    @property
    def has_previous_page(self) -> bool:
        """
        Check if there is a previous page.
        """
        return self.offset > 1

    @computed_field
    @property
    def total_pages(self) -> int:
        """
        Total number of pages.
        """
        return (self.total + self.limit - 1) // self.limit

    model_config = ConfigDict(
        arbitrary_types_allowed=True
    )