from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.table import Table

from app.utils.results_to_docx.document_formatter import DocumentFormatter


class TotalRowRenderer:
    """Renders the total score row"""

    def __init__(self, table: Table, formatter: DocumentFormatter, points: tuple[int, int]):
        self.table = table
        self.formatter = formatter
        self.points = points

    def render(self):
        correct, total = self.points
        results = self.table.add_row().cells

        results_cell = results[0]
        self.formatter.format_cell(
            results_cell,
            f"Загальний бал: {correct} з {total}",
            align=WD_ALIGN_PARAGRAPH.RIGHT
        )

        results_cell.merge(results[-1])