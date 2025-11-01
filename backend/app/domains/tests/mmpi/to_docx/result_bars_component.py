import os
import tempfile

from docx.document import Document
from matplotlib import pyplot as plt

from app.schemas.test_result import TestResultDto
from app.utils.results_to_docx.document_component import DocumentComponent
from app.utils.results_to_docx.document_formatter import DocumentFormatter


class ResultBarsComponent(DocumentComponent):
    """Renders pyplot image with converted results for each scale in MMPI test"""

    def __init__(self, document: Document, formatter: DocumentFormatter, test_result: TestResultDto):
        super().__init__(document, formatter)
        self.test_result = test_result

    def render(self):
        chart_path = self._create_and_save_chart()
        self.doc.add_picture(chart_path, width=None, height=None)
        self._cleanup_temp_file(chart_path)

    def _create_and_save_chart(self):
        data = self._prepare_chart_data()
        fig, ax = self._create_chart(data)
        temp_file = self._save_chart(fig)
        plt.close(fig)
        return temp_file

    def _prepare_chart_data(self):
        (x, y) = zip(*self.test_result.verdict.converted.items())
        bar_colors = ['red' if val <= 30 or val >= 70 else 'green' for val in y]
        return {'x': x, 'y': y, 'colors': bar_colors}

    @staticmethod
    def _create_chart(data):
        plt.style.use('_mpl-gallery')
        fig, ax = plt.subplots(figsize=(7.5, 3))

        # Create bars with data
        bars = ax.bar(data['x'], data['y'], width=1,
                      edgecolor="white", linewidth=1, color=data['colors'])

        # Configure chart appearance
        ax.set(ylim=(0, 130))
        ax.bar_label(bars, fmt='%i', label_type="center")
        ax.grid(axis='y', alpha=0.6)
        ax.grid(axis='x', alpha=0)
        ax.set_title("Конвертовані результати тесту")

        # Layout adjustments
        plt.tight_layout()
        plt.subplots_adjust(left=0.05, right=0.95, top=0.9, bottom=0.1)

        return fig, ax

    def _save_chart(self, fig):
        temp_name = f'mmpi_plot_{self.test_result.id}.png'
        temp_file = os.path.join(tempfile.gettempdir(), temp_name)
        fig.savefig(temp_file, dpi=300, bbox_inches='tight')
        return temp_file

    @staticmethod
    def _cleanup_temp_file(file_path):
        if os.path.exists(file_path):
            os.remove(file_path)
