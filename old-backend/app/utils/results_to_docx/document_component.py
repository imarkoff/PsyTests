from abc import ABC, abstractmethod

from docx.document import Document
from docx.table import Table

from app.utils.results_to_docx.document_formatter import DocumentFormatter


class DocumentComponent(ABC):
    """Base class for document components"""

    def __init__(self, document: Document, formatter: DocumentFormatter):
        self.doc = document
        self.formatter = formatter

    @abstractmethod
    def render(self) -> None:
        pass


class TableComponent(DocumentComponent, ABC):
    """Base class for table components."""

    def __init__(self, document: Document, formatter: DocumentFormatter):
        super().__init__(document, formatter)
        self.table = self._define_table()

    @abstractmethod
    def _define_table(self) -> Table:
        pass

    def add_space_after(self):
        paragraph = self.doc.add_paragraph(" ")
        paragraph.paragraph_format.space_after = 0
        paragraph.paragraph_format.space_before = 0
        paragraph.paragraph_format.line_spacing = 0
        self.formatter.set_font_size(paragraph, 5)
        return paragraph