import os.path
import tempfile
from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

from docx import Document
from docx.shared import Pt

from app.schemas.user import UserDto
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
