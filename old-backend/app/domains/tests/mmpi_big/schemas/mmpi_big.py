from app.domains.tests.mmpi_big.schemas.mmpi_big_scale import MMPIBigScale
from app.domains.tests.mmpi.schemas.mmpi_test import MMPITest


class MMPIBigTest(MMPITest):
    scales: list[MMPIBigScale]
    type: str = "mmpi_big"