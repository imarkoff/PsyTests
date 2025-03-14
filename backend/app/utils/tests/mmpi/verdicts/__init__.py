import os

from yaml import load
try:
    from yaml import CLoader as Loader
except ImportError:
    from yaml import Loader


__path = os.path.dirname(__file__)


def get_scale_verdicts() -> dict[str, dict[str, str]]:
    """
    scale-name:
        ...
        min-max: Description
        max+: Description
    """
    return load(open(f"{__path}/scale_verdicts.yaml"), Loader=Loader)


def get_profile_types() -> dict[str, dict[str, str]]:
    """
    profile-name:
        name: Profile name
        description: Profile description
    """
    return load(open(f"{__path}/profile_types.yaml"), Loader=Loader)