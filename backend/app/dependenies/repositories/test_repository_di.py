from app.settings import settings
from app.domains.tests.test_factories import TestFactories
from app.repositories.test_repository import TestRepository


def get_test_repository():
    test_factory_type = TestFactories().get_default_factory()
    return TestRepository(
        settings=settings,
        test_factory=test_factory_type()
    )
