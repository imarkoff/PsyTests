from app.domains.tests.mmpi.to_docx.verdicts_table_component import VerdictsTableComponent
from app.domains.tests.mmpi.to_docx.profile_paragraphs_component import ProfileParagraphsComponent
from app.domains.tests.mmpi.to_docx.raw_results_table_component import RawResultsTableComponent
from app.domains.tests.mmpi.to_docx.result_bars_component import ResultBarsComponent
from app.utils.results_to_docx.results_to_docx import ResultsToDocx


class MMPIToDocx(ResultsToDocx):
    """Generate a document for passed MMPI test"""

    def _create_content(self):
        self._add_result_bars()
        self._add_raw_table()
        self._add_profiles()
        self._add_verdicts_table()

    def _add_result_bars(self):
        result_bars = ResultBarsComponent(
            document=self.doc,
            formatter=self.formatter,
            test_result=self.test_result
        )
        result_bars.render()

    def _add_raw_table(self):
        raw_results = RawResultsTableComponent(
            document=self.doc,
            formatter=self.formatter,
            test_result=self.test_result
        )
        raw_results.render()
        raw_results.add_space_after()

    def _add_profiles(self):
        profiles = ProfileParagraphsComponent(
            document=self.doc,
            formatter=self.formatter,
            test_result=self.test_result
        )
        profiles.render()

    def _add_verdicts_table(self):
        verdicts_table = VerdictsTableComponent(
            document=self.doc,
            formatter=self.formatter,
            test_result=self.test_result
        )
        verdicts_table.render()
        verdicts_table.add_space_after()
