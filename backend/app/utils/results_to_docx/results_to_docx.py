import os.path
import tempfile
from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

from docx import Document
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt

from app.schemas.user_auth import UserDto
from app.utils.results_to_docx.document_formatter import DocumentFormatter
from app.utils.results_to_docx.header_component import HeaderComponent

if TYPE_CHECKING:
    from app.schemas.test_result import TestResultDto

temp_dir = tempfile.gettempdir()

class ResultsToDocx(ABC):
    """
    Base class for creating docx file with test results
    Logic for filling the document should be implemented in child classes
    """

    path: str = None

    def __init__(self, test_result: 'TestResultDto', patient: UserDto):
        self.test_result = test_result
        self.patient = patient

        self.doc = Document()
        self.formatter = DocumentFormatter()

        self._initialize_margins()
        self._create_header()
        self._create_content()

        self.path = self._save()

    def __del__(self):
        if self.path and os.path.exists(self.path):
            os.remove(self.path)

    def _initialize_margins(self):
        """Set up document formatting"""
        self.doc.sections[0].left_margin = Pt(42)
        self.doc.sections[0].right_margin = Pt(32)

    def _create_header(self):
        header = HeaderComponent(
            document=self.doc,
            formatter=self.formatter,
            patient=self.patient,
            test_result=self.test_result
        )
        header.render()

    @abstractmethod
    def _create_content(self):
        """Method for filling the document with content"""
        pass

    def _save(self) -> str:
        """Save document to file and return path"""
        file_name = self._generate_file_name()
        path = os.path.join(temp_dir, file_name)
        self.doc.save(path)
        return path

    def _generate_file_name(self) -> str:
        """Generate a filename based on patient information and test name"""
        surname = self.patient.surname
        name = self.patient.name
        patronymic = self.patient.patronymic
        credentials = "_".join([
            surname,
            name[0] if name else '',
            patronymic[0] if patronymic else '']
        )
        test_name = "_".join(self.test_result.test.name.split())
        return f"{credentials}_{test_name}.docx"

    def _set_cell_font_size(self, cell, size):
        """
        Set font size for all runs in cell
        """
        for paragraph in cell.paragraphs:
            self._set_font_size(paragraph, size)

    @staticmethod
    def _set_font_size(paragraph, size):
        """
        Set font size for all runs in paragraph
        """
        for run in paragraph.runs:
            run.font.size = Pt(size)


    def _fill_cell(self, cell, text, align=WD_ALIGN_PARAGRAPH.LEFT):
        """
        Fill cell with text and set alignment
        """
        cell.text = str(text)
        self._set_cell_font_size(cell, 11)
        cell.paragraphs[0].alignment = align
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER

    def _style_paragraph(self, paragraph):
        """
        Style paragraph with common settings (font size, spacing)
        """
        paragraph.paragraph_format.space_after = 0
        paragraph.paragraph_format.line_spacing = 1.5
        self._set_font_size(paragraph, 12)

    def _add_space_after_table(self):
        """
        Add empty paragraph after table
        """
        paragraph = self.doc.add_paragraph(" ")
        paragraph.paragraph_format.space_after = 0
        paragraph.paragraph_format.space_before = 0
        paragraph.paragraph_format.line_spacing = 0
        self._set_font_size(paragraph, 5)
        return paragraph
