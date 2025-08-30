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

class ForbiddenError(Exception):
    """Raised when a user is not allowed to access a resource"""
    pass

class UnauthorizedError(Exception):
    """Raised when a user is not authenticated"""
    pass

class ValidationError(Exception):
    """Raised when input data fails validation"""
    pass