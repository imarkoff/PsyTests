from app.domains.tests.mmpi_big.utils.mmpi_big_results_converter import MMPIBigResultsConverter
from app.domains.tests.mmpi.utils.results_manager.results_manager import ResultsManagerFactory


class MMPIBigResultsManagerFactory(ResultsManagerFactory):
    converter_class = MMPIBigResultsConverter