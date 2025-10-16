from app.domains.tests.raven.to_docx.results_table_component import ResultsTableComponent
from app.utils.results_to_docx.results_to_docx import ResultsToDocx


class RavenToDocx(ResultsToDocx):
    """Generates a document with passed results for Raven test"""

    def _create_content(self):
        self._add_results_table()

    def _add_results_table(self):
        results_table = ResultsTableComponent(
            test_result=self.test_result,
            formatter=self.formatter,
            document=self.doc
        )
        results_table.render()
