from abc import ABC


class FileSystemRepository(ABC):
    def __init__(self, entity_dir: str):
        self.entity_dir = entity_dir
