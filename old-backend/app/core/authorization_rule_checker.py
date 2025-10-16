from abc import ABC, abstractmethod
from app.schemas.enums.role import Role
from app.schemas.user import UserDto


class AuthorizationRuleChecker(ABC):
    """
    Checks authorization rules for various actions.
    """

    @abstractmethod
    def can_change_password(self, changed_by: UserDto, user: UserDto) -> bool:
        """
        Checks if the user changing the password is allowed to do so.

        :param changed_by: The user who is attempting to change the password.
        :param user: The user whose password is being changed.
        """
        pass


class AuthorizationRuleCheckerImpl(AuthorizationRuleChecker):
    def can_change_password(self, changed_by: UserDto, user: UserDto) -> bool:
        if (changed_by.id == user.id):
            return True

        if (changed_by.role == Role.ADMIN and user.role != Role.ADMIN):
            return True

        if (changed_by.role == Role.DOCTOR and user.role == Role.PATIENT):
            return True

        return False
