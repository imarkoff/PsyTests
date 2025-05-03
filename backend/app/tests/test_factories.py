from typing import Type

from app.services.tests.test_factory import TestFactory
from app.services.tests.test_factory_impl import TestFactoryImpl
from app.tests.mmpi.services.mmpi_test_factory import MMPITestFactory
from app.tests.mmpi_big.services.mmpi_big_test_factory import MMPIBigTestFactory
from app.tests.pcl5.services.pcl5_factory import PCL5TestFactory
from app.tests.raven.services.raven_test_factory import RavenTestFactory


class TestFactories:
    factories: dict[str, Type[TestFactory]] = {
        "raven": RavenTestFactory,
        "mmpi": MMPITestFactory,
        "mmpi_big": MMPIBigTestFactory,
        "pcl-5": PCL5TestFactory
    }

    def get_factory_or_default(self, test_type: str):
        return self.factories.get(test_type, TestFactoryImpl)