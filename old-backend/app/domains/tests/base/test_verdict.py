from pydantic import BaseModel


class TestVerdict(BaseModel):
    """
    Base class for test verdicts.
    Should be inherited by all test verdict classes.
    """
    pass
