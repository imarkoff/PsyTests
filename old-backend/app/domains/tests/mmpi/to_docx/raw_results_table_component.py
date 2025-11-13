from docx.document import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.table import Table

from app.schemas.test_result import TestResultDto
from app.utils.results_to_docx.document_component import TableComponent
from app.utils.results_to_docx.document_formatter import DocumentFormatter


class RawResultsTableComponent(TableComponent):
    """Component to render raw results of passed MMPI test"""

    def __init__(self, document: Document, formatter: DocumentFormatter, test_result: TestResultDto):
        (self.scales, self.values) = zip(*test_result.verdict.raw.items())
        super().__init__(document, formatter)

    def _define_table(self) -> Table:
        return self.doc.add_table(rows=0, cols=len(self.scales), style="Table Grid")

    def render(self) -> None:
        self._add_header_row()
        self._add_row(self.scales)
        self._add_row(self.values)

    def _add_header_row(self):
        header = self.table.add_row().cells
        header[0].text = "Сирі результати"
        header[0].merge(header[-1])

    def _add_row(self, values):
        row = self.table.add_row().cells
        for i, value in enumerate(values):
            self.formatter.format_cell(row[i], text=value, align=WD_ALIGN_PARAGRAPH.CENTER)
