from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.table import Table

from app.domains.tests.raven.schemas.test_history_results import RavenTestResults, RavenResultAnswer
from app.domains.tests.raven.to_docx.results_analyzer import ResultsAnalyzer
from app.utils.results_to_docx.document_formatter import DocumentFormatter


class ModulesRenderer:
    """Renders all module rows with answers"""

    def __init__(self, table: Table, formatter: DocumentFormatter, results: RavenTestResults):
        self.table = table
        self.formatter = formatter
        self.results = results
        self.analyzer = ResultsAnalyzer(results)

    def render(self) -> tuple[int, int]:
        correct_points = 0
        total_points = 0

        for module, answers in self.results.items():
            row_cells = self.table.add_row().cells
            self.formatter.format_cell(row_cells[0], module)

            module_correct_points, module_total_points = self._render_module_answers(row_cells, answers)

            self.formatter.format_cell(
                cell=row_cells[-1],
                text=module_correct_points,
                align=WD_ALIGN_PARAGRAPH.RIGHT
            )

            correct_points += module_correct_points
            total_points += module_total_points

        return correct_points, total_points

    def _render_module_answers(self, row_cells, answers: list[RavenResultAnswer]):
        module_correct, module_total = self.analyzer.calculate_module_points(answers)

        for i, answer in enumerate(answers):
            cell_text = self._format_answer_text(answer)
            self.formatter.format_cell(
                row_cells[i + 1],
                cell_text,
                align=WD_ALIGN_PARAGRAPH.CENTER
            )

        return module_correct, module_total

    @staticmethod
    def _format_answer_text(answer: RavenResultAnswer) -> str:
        user_answer = answer["user_answer"]
        correct_answer = answer["correct_answer"]

        str_user_answer = "" if user_answer is None else f"{user_answer + 1}"
        str_correct_answer = f" ({correct_answer + 1})" if user_answer is not None and user_answer != correct_answer else ""

        return str_user_answer + str_correct_answer
