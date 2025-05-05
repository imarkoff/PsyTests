from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.table import Table

from app.utils.results_to_docx.document_formatter import DocumentFormatter


class HeaderRowRenderer:
    def __init__(self, table: Table, formatter: DocumentFormatter, max_answers: int):
        self.table = table
        self.formatter = formatter
        self.max_answers = max_answers

    def render(self):
        index_cells = self.table.add_row().cells

        for i in range(self.max_answers):
            index_cell = index_cells[i + 1]
            self.formatter.format_cell(
                cell=index_cell, text=str(i + 1),
                align=WD_ALIGN_PARAGRAPH.CENTER, size=11
            )

        total_cell = index_cells[-1]
        self.formatter.format_cell(
            cell=total_cell, text="Бали",
            align=WD_ALIGN_PARAGRAPH.RIGHT, size=11
        )