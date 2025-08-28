from fastapi import Depends

from app.repositories.user_repository import UserRepository
from app.services.user_service import UserService
from app.dependenies.core.authorization_rule_checker_di import get_authorization_rule_checker
from app.dependenies.repositories.user_repository_di import get_user_repository
from app.services.user_service.password_changer import PasswordChanger, PasswordChangerImpl
from app.core.authorization_rule_checker import AuthorizationRuleChecker


def get_password_changer(
        user_repository: UserRepository = Depends(get_user_repository),
        authorization_rule_checker: AuthorizationRuleChecker = Depends(get_authorization_rule_checker)
) -> PasswordChanger:
    return PasswordChangerImpl(user_repository, authorization_rule_checker)


def get_user_service(
        user_repository: UserRepository = Depends(get_user_repository),
        password_changer: PasswordChanger = Depends(get_password_changer)
) -> UserService:
    return UserService(user_repository, password_changer)
