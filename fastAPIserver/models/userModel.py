from pydantic import BaseModel

class User(BaseModel):
    name: str
    number: int
    password: str
    email:str
    tasks: list[str]