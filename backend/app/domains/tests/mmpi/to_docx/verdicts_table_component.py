from docx.document import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Cm
from docx.table import Table

from app.schemas.test_result import TestResultDto
from app.utils.results_to_docx.document_component import TableComponent
from app.utils.results_to_docx.document_formatter import DocumentFormatter


class VerdictsTableComponent(TableComponent):
    """Renders verdicts by each scale for MMPI test"""

    def __init__(self, document: Document, formatter: DocumentFormatter, test_result: TestResultDto):
        super().__init__(document, formatter)
        self.scale_verdicts: dict[str, list[str]] = test_result.verdict.get("scale_verdicts")

    def _define_table(self) -> Table:
        table = self.doc.add_table(rows=0, cols=2, style="Table Grid")
        table.columns[0].width = Cm(1)
        table.columns[1].width = Cm(18)
        return table

    def render(self) -> None:
        self._add_header()
        self._add_verdicts_for_each_scale()

    def _add_header(self):
        header = self.table.add_row().cells
        header[0].text = "Висновки"
        header[0].merge(header[-1])

    def _add_verdicts_for_each_scale(self):
        for scale, description in self.scale_verdicts.items():
            row = self.table.add_row().cells
            self.formatter.format_cell(row[0], text=scale, align=WD_ALIGN_PARAGRAPH.CENTER)
            self.formatter.format_cell(row[1], text=''.join(description))
