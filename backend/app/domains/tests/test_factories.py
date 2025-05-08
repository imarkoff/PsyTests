from typing import Type

from app.domains.tests.base.test_factory import TestFactory
from app.domains.tests.base.services.test_factory_impl import TestFactoryImpl
from app.domains.tests.mmpi.services.mmpi_test_factory import MMPITestFactory
from app.domains.tests.mmpi_big.services.mmpi_big_test_factory import MMPIBigTestFactory
from app.domains.tests.pcl5.services.pcl5_factory import PCL5TestFactory
from app.domains.tests.raven.services.raven_test_factory import RavenTestFactory


class TestFactories:
    factories: dict[str, Type[TestFactory]] = {
        "raven": RavenTestFactory,
        "mmpi": MMPITestFactory,
        "mmpi_big": MMPIBigTestFactory,
        "pcl-5": PCL5TestFactory
    }

    def get_factory_or_default(self, test_type: str) -> Type[TestFactory]:
        return self.factories.get(test_type, TestFactoryImpl)

    @staticmethod
    def get_default_factory() -> Type[TestFactory]:
        return TestFactoryImpl
