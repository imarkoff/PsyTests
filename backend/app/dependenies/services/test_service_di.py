from fastapi import Depends

from app.dependenies.repositories.test_repository_di import get_test_repository
from app.domains.tests.test_factories import TestFactories
from app.services.test_service import TestService


def get_test_service(repository=Depends(get_test_repository)):
    test_factories = TestFactories()
    return TestService(
        test_repository=repository,
        test_factories=test_factories
    )
