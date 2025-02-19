import os.path
import tempfile

from docx import Document
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt

from app.schemas.test.test_history_results import Results, Answer
from app.schemas.test_result import TestResultDto
from app.schemas.user_auth import UserDto

temp_dir = tempfile.gettempdir()

class ResultsToDocx:
    def __init__(self, test_result: TestResultDto, user_info: UserDto):
        self.test_result = test_result
        self.user_info = user_info
        self.max_answers = self._calculate_max_answers(test_result.results)

        self.doc = Document()

        self.doc.sections[0].left_margin = Pt(42)
        self.doc.sections[0].right_margin = Pt(32)

        self._create_header()
        self.table = self._create_table()
        self._fill_table()

        self.path = self._save()

    def _save(self):
        surname = self.user_info.surname
        name = self.user_info.name
        patronymic = self.user_info.patronymic
        credentials = "_".join([
            surname,
            name[0] if name else '',
            patronymic[0] if patronymic else '']
        )
        test_name = "_".join(self.test_result.test.name.split())
        file_name = f"{credentials}_{test_name}.docx"
        path = os.path.join(temp_dir, file_name)

        self.doc.save(path)
        return path

    @staticmethod
    def _set_font_size(cell, size):
        for paragraph in cell.paragraphs:
            for run in paragraph.runs:
                run.font.size = Pt(size)

    @staticmethod
    def _calculate_max_answers(results: Results):
        max_answers = 0

        for module, answers in results.root.items():
            if len(answers) > max_answers:
                max_answers = len(answers)

        return max_answers

    def _create_header(self):
        user = self.user_info
        (age, age_ending) = user.get_age()

        header = self.doc.add_paragraph()
        header.alignment = WD_ALIGN_PARAGRAPH.CENTER
        header.add_run(f"Бланк {self.test_result.test.name}").bold = True

        credentials = self.doc.add_paragraph(f"П.І.Б: {user.surname} "
                                             f"{user.name if user.name else ''} "
                                             f"{user.patronymic if user.patronymic else ''}")
        credentials.paragraph_format.space_after = Pt(0.5)

        age = self.doc.add_paragraph(f"Вік пацієнта: {age} {age_ending}")
        age.paragraph_format.space_after = Pt(0.5)

        pass_date = self.test_result.passed_at.strftime("%d.%m.%Y %H:%M")
        self.doc.add_paragraph(f"Дата проходження: {pass_date}")

    def _create_table(self):
        table = self.doc.add_table(rows=0, cols=self.max_answers + 2)
        table.style = "Table Grid"

        table.add_row()

        hdr_cells = table.rows[0].cells

        for i in range(self.max_answers):
            index_cell = hdr_cells[i + 1]
            index_cell.text = str(i + 1)
            index_cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
            index_cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            self._set_font_size(index_cell, 11)

        total_cell = hdr_cells[-1]
        total_cell.text = "Бали"
        self._set_font_size(total_cell, 11)

        return table

    def _fill_table(self):
        correct_points = 0
        total_points = 0

        for module, answers in self.test_result.results.root.items():
            row_cells = self.table.add_row().cells
            self._fill_cell(row_cells[0], module)

            module_correct_points, module_total_points = self._fill_answers(row_cells, answers)

            self._fill_cell(row_cells[-1], module_correct_points, align=WD_ALIGN_PARAGRAPH.RIGHT)

            total_points += module_total_points
            correct_points += module_correct_points

        self._add_total_row(correct_points, total_points)

    def _fill_cell(self, cell, text, align=WD_ALIGN_PARAGRAPH.LEFT):
        cell.text = str(text)
        self._set_font_size(cell, 11)
        cell.paragraphs[0].alignment = align
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER

    def _fill_answers(self, row_cells, answers: list[Answer]):
        module_correct_points = 0
        module_total_points = 0

        for i, answer in enumerate(answers):
            user_answer = answer.user_answer
            correct_answer = answer.correct_answer
            points = answer.points

            str_user_answer = "" if user_answer is None else f"{user_answer + 1}"
            str_correct_answer = f" ({correct_answer + 1})" if user_answer is not None and user_answer != correct_answer else ""

            self._fill_cell(
                row_cells[i + 1],
                str_user_answer + str_correct_answer,
                align=WD_ALIGN_PARAGRAPH.CENTER
            )

            module_total_points += points
            if user_answer == correct_answer:
                module_correct_points += points

        return module_correct_points, module_total_points

    def _add_total_row(self, correct_points, total_points):
        row = self.table.add_row()
        results = row.cells

        results_cell = results[0]
        self._fill_cell(
            results_cell,
            f"Загальний бал: {correct_points} з {total_points}",
            align=WD_ALIGN_PARAGRAPH.RIGHT
        )
        results_cell.merge(results[-1])