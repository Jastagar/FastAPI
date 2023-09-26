from pymongo import MongoClient
from config import get_envs

print("DATABASE-->",get_envs())

myclient = MongoClient(get_envs().MONGO_URL)
database = myclient['test']
UserDB = database["Users"]
TaskDB = database["Tasks"]