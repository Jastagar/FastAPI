from pydantic import BaseModel
from bson import ObjectId

class Task(BaseModel):
    title:str
    deadline: int
    description:str
    user: ObjectId
    completed: bool