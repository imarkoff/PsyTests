from fastapi import Depends

from app.dependenies.repositories.test_repository_di import get_test_repository
from app.dependenies.services.test_image_getter_di import get_test_image_getter
from app.domains.tests.test_factories import TestFactories
from app.repositories.test_repository import TestRepository
from app.services.test_image_getter import TestImageGetter
from app.services.test_service import TestService


def get_test_service(
    test_image_getter: TestImageGetter = Depends(get_test_image_getter),
    repository: TestRepository = Depends(get_test_repository)
) -> TestService:
    test_factories = TestFactories()
    return TestService(
        test_repository=repository,
        test_factories=test_factories,
        test_image_getter=test_image_getter
    )
