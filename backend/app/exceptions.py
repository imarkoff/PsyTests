class ErrorWithMessage(Exception):
    """Base class for exceptions with a message"""
    def __init__(self, message: str = "") -> None:
        super().__init__(message)
        self.message = message

    pass


class NotFoundError(Exception):
    """Raised when a resource is not found"""
    def __init__(self, message: str = "") -> None:
        super().__init__(message)
        self.message = message

    pass


class AlreadyExistsError(Exception):
    """Raised when a resource already exists"""
    def __init__(self, message: str = "") -> None:
        super().__init__(message)
        self.message = message

    pass


class PaginationError(ErrorWithMessage):
    """Raised when there is an error with pagination parameters"""
    pass


class ParseSortDirectionError(PaginationError):
    """Raised when parsing sort direction fails"""
    pass


class IncorrectFilterOperatorError(PaginationError):
    """Raised when an incorrect filter operator is used"""
    pass


class IncorrectOperatorError(PaginationError):
    """Raised when an incorrect logical operator is used in filters"""
    pass


class ForbiddenError(Exception):
    """Raised when a user is not allowed to access a resource"""
    pass


class UnauthorizedError(Exception):
    """Raised when a user is not authenticated"""
    pass


class ValidationError(Exception):
    """Raised when input data fails validation"""
    pass
