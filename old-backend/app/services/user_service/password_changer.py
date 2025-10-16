from abc import ABC, abstractmethod
from uuid import UUID

from app.db.models.user import User
from app.core.password import cache_password
from app.exceptions import ForbiddenError, NotFoundError
from app.repositories.user_repository import UserRepository
from app.core.authorization_rule_checker import AuthorizationRuleChecker
from app.schemas.user import UserDto


class PasswordChanger(ABC):
    """
    A class for password changing functionality.
    """

    @abstractmethod
    async def change_password(self, user_id: UUID, changed_by: User | UserDto, new_password: str) -> None:
        """
        Changes a user's password in the database.

        :param user_id: The id of the user whose password is being changed
        :param changed_by: The user who is changing the password
        :param new_password: The new password to set for the user 

        :raise NotFoundError: If the user is not found
        :raise ForbiddenError: If the changer is not allowed
        """
        pass


class PasswordChangerImpl(PasswordChanger):
    def __init__(self, 
                 user_repository: UserRepository,
                 authorization_rule_checker: AuthorizationRuleChecker
                 ):
        self.user_repository = user_repository
        self.authorization_rule_checker = authorization_rule_checker

    async def change_password(self, user_id: UUID, changed_by: User | UserDto, new_password: str) -> None:
        user = await self.user_repository.get_user_by_id(user_id)

        if user is None:
            raise NotFoundError(f"User with id {user_id} not found")
        
        if not self.authorization_rule_checker.can_change_password(changed_by, user):
            raise ForbiddenError("You are not allowed to change this user's password")
        
        (cached_password, password_salt) = cache_password(new_password)

        user.password = cached_password
        user.password_salt = password_salt

        await self.user_repository.update_user(user)