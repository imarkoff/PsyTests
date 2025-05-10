from typing import Union

from app.domains.tests.base.test_base import TestBase
from app.domains.tests.bdi.schemas.bdi_test import BDITest
from app.domains.tests.pcl5.schemas.pcl5_test import PCL5Test
from app.domains.tests.raven.schemas.raven_test import RavenTest
from app.domains.tests.mmpi.schemas.mmpi_test import MMPITest
from app.domains.tests.mmpi_big.schemas.mmpi_big import MMPIBigTest
from app.domains.tests.stai.schemas.stai_test import STAITest

TestTypes = Union[
    TestBase,
    RavenTest,
    MMPITest,
    MMPIBigTest,
    PCL5Test,
    BDITest,
    STAITest
]
