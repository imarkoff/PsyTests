from docx.document import Document
from docx.table import Table

from app.schemas.test_result import TestResultDto
from app.tests.raven.services.raven_to_docx.header_row_renderer import HeaderRowRenderer
from app.tests.raven.services.raven_to_docx.modules_renderer import ModulesRenderer
from app.tests.raven.services.raven_to_docx.results_analyzer import ResultsAnalyzer
from app.tests.raven.services.raven_to_docx.total_row_renderer import TotalRowRenderer
from app.utils.results_to_docx.document_component import TableComponent
from app.utils.results_to_docx.document_formatter import DocumentFormatter


class ResultsTableComponent(TableComponent):
    """Renders Raven test result in table format"""

    def __init__(self,
                 document: Document, formatter: DocumentFormatter,
                 test_result: TestResultDto):
        self.test_result = test_result
        self.results_analyzer = ResultsAnalyzer(results=self.test_result.results)
        self.max_answers = self.results_analyzer.get_max_answers()
        super().__init__(document, formatter)

    def _define_table(self) -> Table:
        table = self.doc.add_table(rows=0, cols=self.max_answers + 2)
        table.style = "Table Grid"
        return table

    def render(self):
        self._add_header_row()
        points = self._fill_answers_for_each_module()
        self._add_total_row(points)

    def _add_header_row(self):
        header_row = HeaderRowRenderer(
            table=self.table,
            formatter=self.formatter,
            max_answers=self.max_answers
        )
        header_row.render()

    def _fill_answers_for_each_module(self):
        modules = ModulesRenderer(
            table=self.table,
            formatter=self.formatter,
            results=self.test_result.results
        )
        return modules.render()

    def _add_total_row(self, points: tuple[int, int]):
        total_row = TotalRowRenderer(
            table=self.table,
            formatter=self.formatter,
            points=points
        )
        total_row.render()