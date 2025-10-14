from app.settings import settings
from app.services.test_image_getter import TestImageGetter


def get_test_image_getter():
    return TestImageGetter(
        settings=settings
    )
