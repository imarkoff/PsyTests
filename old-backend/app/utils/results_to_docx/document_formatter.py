from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt
from docx.table import _Cell
from docx.text.paragraph import Paragraph


class DocumentFormatter:
    """Handles document formatting operations"""

    @staticmethod
    def set_font_size(paragraph: Paragraph, size: int):
        for run in paragraph.runs:
            run.font.size = Pt(size)

    @classmethod
    def set_cell_font_size(cls, cell: _Cell, size: int):
        for paragraph in cell.paragraphs:
            cls.set_font_size(paragraph, size)

    def format_cell(self, cell: _Cell, text: str, align=WD_ALIGN_PARAGRAPH.LEFT, size=11):
        cell.text = str(text)
        self.set_cell_font_size(cell, size)
        cell.paragraphs[0].alignment = align
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER

    def style_paragraph(self, paragraph: Paragraph, font_size=12, line_spacing=1.5, space_after=0):
        paragraph.paragraph_format.space_after = space_after
        paragraph.paragraph_format.line_spacing = line_spacing
        self.set_font_size(paragraph, font_size)
