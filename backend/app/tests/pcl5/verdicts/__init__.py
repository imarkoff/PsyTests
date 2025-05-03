import os

__path__ = os.path.dirname(os.path.abspath(__file__))

from yaml import load, Loader


def get_count_verdicts():
    file_path = os.path.join(__path__, "count_verdicts.yaml")
    return load(open(file_path), Loader=Loader)