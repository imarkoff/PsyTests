from app.utils.tests.mmpi.mmpi_big.schemas.mmpi_big_results_converter import MMPIBigResultsConverter
from app.utils.tests.mmpi.utils.results_manager.abstract_results_converter import AbstractResultsConverter
from app.utils.tests.mmpi.utils.results_manager.results_manager import ResultsManagerFactory


class MMPIBigResultsManagerFactory(ResultsManagerFactory):
    converter_class: type[AbstractResultsConverter] = MMPIBigResultsConverter