from typing import Union

from app.domains.tests.base.test_verdict import TestVerdict
from app.domains.tests.bdi.schemas.bdi_verdict import BDIVerdict
from app.domains.tests.mmpi.schemas.mmpi_verdict import MMPIVerdict
from app.domains.tests.pcl5.schemas.pcl5_verdict import PCL5Verdict
from app.domains.tests.raven.schemas.raven_verdict import RavenVerdict
from app.domains.tests.stai.schemas.stai_verdict import STAIVerdict

TestVerdictTypes = Union[
    TestVerdict,
    RavenVerdict,
    MMPIVerdict,
    PCL5Verdict,
    BDIVerdict,
    STAIVerdict
]
