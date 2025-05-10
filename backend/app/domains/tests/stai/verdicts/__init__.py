import os

import yaml

path = os.path.dirname(__file__)

def get_stai_verdicts():
    file_path = f"{path}/stai_verdicts.yaml"
    return yaml.load(open(file_path), Loader=yaml.FullLoader)
