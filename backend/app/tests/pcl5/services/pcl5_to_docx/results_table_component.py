from docx.document import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.table import Table

from app.tests.pcl5.utils.verdict_getter.pcl5_verdict import PCL5Verdict
from app.utils.results_to_docx.document_component import TableComponent
from app.utils.results_to_docx.document_formatter import DocumentFormatter


class ResultsTableComponent(TableComponent):
    def __init__(self, document: Document, formatter: DocumentFormatter, verdict: PCL5Verdict):
        self.verdict = verdict
        super().__init__(document, formatter)

    def _define_table(self) -> Table:
        table = self.doc.add_table(rows=0, cols=len(self.verdict.counts) + 1)
        table.style = "Table Grid"
        return table

    def render(self):
        self._add_results_header()
        criterion_row, counts_row = self._add_data_rows()
        total_count = self._populate_criteria_and_counts(criterion_row, counts_row)
        self._add_total_column(criterion_row, counts_row, total_count)

    def _add_results_header(self):
        header = self.table.add_row().cells
        header[0].text = "Результати"
        header[0].merge(header[-1])

    def _add_data_rows(self):
        criterion_row = self.table.add_row().cells
        counts_row = self.table.add_row().cells
        return criterion_row, counts_row

    def _populate_criteria_and_counts(self, criterion_row, counts_row):
        total_count = 0

        for i, (criteria, count) in enumerate(self.verdict.counts.items()):
            self.formatter.format_cell(criterion_row[i], text=criteria, align=WD_ALIGN_PARAGRAPH.CENTER)
            self.formatter.format_cell(counts_row[i], text=str(count), align=WD_ALIGN_PARAGRAPH.CENTER)
            total_count += count

        return total_count

    def _add_total_column(self, criterion_row, counts_row, total_count: int):
        self.formatter.format_cell(criterion_row[-1], "Загалом", WD_ALIGN_PARAGRAPH.CENTER)
        self.formatter.format_cell(counts_row[-1], str(total_count), WD_ALIGN_PARAGRAPH.CENTER)
