from typing import Any


class NestedAttributeResolver:
    @staticmethod
    def get_nested_attribute(model: Any, path: str) -> Any:
        """
        Resolves a nested attribute path on a SQLAlchemy model or relationship.
        Handles relationships by traversing to the related class.

        :param obj: The starting SQLAlchemy model class or attribute.
        :param path: Dot-separated path (e.g., 'patient.name').
        :return: The resolved attribute.
        """

        for part in path.split('.'):
            attr = getattr(model, part)
            if hasattr(attr, 'mapper'):  # Handle relationships
                model = attr.mapper.class_
            else:
                model = attr
        return model
