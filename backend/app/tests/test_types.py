from typing import Union

from app.schemas.test_base import TestBase
from app.tests.pcl5.schemas.pcl5_test import PCL5Test
from app.tests.raven.raven_test import RavenTest
from app.tests.mmpi.mmpi_test import MMPITest
from app.tests.mmpi_big.mmpi_big import MMPIBigTest

TestTypes = Union[
    TestBase,
    RavenTest,
    MMPITest,
    MMPIBigTest,
    PCL5Test
]