import os.path

from app.db import tests
from app.domains.tests.test_factories import TestFactories
from app.repositories.test_repository import TestRepository


def get_test_repository():
    entity_dir = os.path.dirname(tests.__file__)
    test_factory_type = TestFactories().get_default_factory()
    return TestRepository(
        entity_dir=entity_dir,
        test_factory=test_factory_type()
    )
