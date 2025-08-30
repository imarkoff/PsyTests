from uuid import UUID

from app.db.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.pagination import PaginatedList, PaginationParams
from app.schemas.role import Role
from app.schemas.user_auth import UserCreate, UserDto, UserUpdate
from app.core.password import cache_password
from app.exceptions import AlreadyExistsError, NotFoundError
from .password_changer import PasswordChanger


class UserService:
    def __init__(self, 
                 user_repository: UserRepository,
                 password_changer: PasswordChanger
                 ):
        self.user_repository = user_repository
        self.password_changer = password_changer

    async def register_user(self, user_create: UserCreate, registered_by_id: UUID | None = None) -> User:
        """
        Register a new user.

        :param user_create: The data to create the user
        :param registered_by_id: The ID of the user who registered the new user

        :return: The created user.

        :raises AlreadyExistsError: If a user with the same phone number already exists.
        """

        existing_user = await self.get_user_by_phone(user_create.phone)

        if existing_user:
            raise AlreadyExistsError(f"User with phone number {user_create.phone} already exists.")
        
        (password, password_salt) = cache_password(user_create.password)

        new_user = user_create.to_user(
            password=password,
            password_salt=password_salt,
            registered_by_id=registered_by_id
        )

        await self.user_repository.create_user(new_user)

        return new_user
    
    async def update_user(self, user_id: UUID, user_update: UserUpdate) -> User:
        """
        Update an existing user.

        :raise NotFoundError: if the user does not exist.
        """
        user = await self.get_user_by_id(user_id)

        if (user is None):
            raise NotFoundError(f"User with id {user_id} not found")
        
        user_update.update_model(user)

        await self.user_repository.update_user(user)
        
        return user
    
    async def change_password(self, user_id: UUID, changed_by: User | UserDto, new_password: str) -> None:
        """
        Changes a user's password.

        :param user_id: The id of the user whose password is being changed
        :param changed_by: The user who is changing the password
        :param new_password: The new password to set for the user 

        :raise NotFoundError: If the user is not found
        :raise ForbiddenError: If the changer is not allowed
        """
        await self.password_changer.change_password(user_id, changed_by, new_password)


    async def get_user_by_id(self, user_id: UUID) -> User | None:
        return await self.user_repository.get_user_by_id(user_id)

    async def get_user_by_phone(self, phone: str) -> User | None:
        return await self.user_repository.get_user_by_phone(phone)

    async def get_patients_by_data(self, data: str) -> list[User]:
        return await self.user_repository.get_patients_by_data(data)

    async def get_users_by_role(self, role: Role, pagination_params: PaginationParams) -> PaginatedList[User]:
        return await self.user_repository.get_users_by_role(role, pagination_params)