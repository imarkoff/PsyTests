from app.domains.tests.pcl5.to_docx.results_table_component import ResultsTableComponent
from app.domains.tests.pcl5.utils.verdict_getter.pcl5_verdict import PCL5Verdict
from app.utils.results_to_docx.results_to_docx import ResultsToDocx


class PCL5ToDocx(ResultsToDocx):
    """Generate a document for passed PCL5 test"""

    def _create_content(self):
        verdict = PCL5Verdict(**self.test_result.verdict)

        self._add_results_table(verdict)

        if verdict.verdict is not None:
            self._add_verdict_paragraph(verdict.verdict)

    def _add_results_table(self, verdict: PCL5Verdict):
        table = ResultsTableComponent(
            document=self.doc,
            formatter=self.formatter,
            verdict=verdict
        )
        table.render()
        table.add_space_after()

    def _add_verdict_paragraph(self, verdict_text: str):
        result_paragraph = self.doc.add_paragraph()
        result_paragraph.add_run("Висновок: ").bold = True
        result_paragraph.add_run(verdict_text)
        self.formatter.style_paragraph(result_paragraph)
