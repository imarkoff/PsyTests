import os

import yaml

path = os.path.dirname(__file__)

def get_mark_verdicts():
    mark_verdicts = f"{path}/mark_verdicts.yaml"
    return yaml.load(open(mark_verdicts), Loader=yaml.FullLoader)
