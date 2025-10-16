import os
from pathlib import Path
from uuid import UUID

from app.settings import Settings


class TestImageGetter:
    """
    Service to safely get test images from filesystem
    """

    def __init__(self, settings: Settings):
        self.entity_dir = settings.PSY_TESTS_DIR

    async def get_test_image(
        self,
        test_id: UUID,
        relative_image_path: str
    ) -> bytes | None:
        """
        Get test image by name
        :param test_id: ID of the test
        :param relative_image_path:
            Relative path to the image within the test directory
        :returns: Image bytes or None if not found or unsafe path
        """
        safe_root_path = (Path(self.entity_dir) / test_id.__str__())

        target_path = safe_root_path / relative_image_path

        if not self._check_is_path_safe(safe_root_path, target_path):
            print(
                "SECURITY ALERT: Path Traversal attempt blocked: "
                f"{target_path}"
            )
            return None

        return self._get_image(target_path)

    def _check_is_path_safe(
        self,
        base_dir: Path,
        target_path: Path
    ) -> bool:
        """Checks if the target path is a subpath of the base directory."""
        try:
            return target_path.resolve().is_relative_to(base_dir)
        except (OSError, RuntimeError):
            return False

    def _get_image(
        self,
        image_path: Path
    ) -> bytes | None:
        if not self._check_is_image_file(image_path):
            return None

        if not os.path.isfile(image_path):
            return None

        with open(image_path, 'rb') as file:
            return file.read()

    def _check_is_image_file(self, image_path: Path) -> bool:
        return image_path.suffix.lower() in [
            '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'
        ]
