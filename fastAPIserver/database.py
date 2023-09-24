from pymongo import MongoClient

myclient = MongoClient("mongodb://localhost:27017/")
database = myclient['test']
UserDB = database["Users"]
TaskDB = database["Tasks"]