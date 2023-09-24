from fastapi import FastAPI, Header, Request
import json, logging, uvicorn,random
from pydantic import BaseModel
from database import UserDB,TaskDB
from datetime import datetime,timedelta
from fastapi.middleware.cors import CORSMiddleware
from models.userModel import User
from utils.security import hash_password,verify_password,signAuthToken,verify_token
from bson.objectid import ObjectId


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],)

class SignupCreds(BaseModel):
    name:str
    email:str
    password:str
    number:int | None=None

class LoginPost(BaseModel):
    email:str
    password:str
    remember: bool

class PostTask(BaseModel):
    title:str
    deadline: int
    description:str
    user: str | None =None


@app.get("/")
async def root():
    print("-----------HELLO--------------")
    return {"Message":"HelloWorld"}

@app.post("/api/signup")
async def signup(item:SignupCreds):
    checkForUser = UserDB.find_one({"email":item.email})
    if checkForUser:
        return{
            "error":True,
            "message":"User with this email already exists"
        }
    copyOfItem = item.model_copy()
    copyOfItem.number = int(random.random()*10)
    encryptedPass = hash_password(copyOfItem.password)
    copyOfItem.password = encryptedPass
    insertedUserId = UserDB.insert_one(copyOfItem.model_dump()).inserted_id
    return {
        "error":False,
        "user":{
                "name":copyOfItem.name,
                "email":copyOfItem.email,
                "number":copyOfItem.number,
                "id":str(insertedUserId)
            }
        }

@app.post("/api/login")
async def loginHandle(creds:LoginPost):
    try:
        foundUser = UserDB.find_one({ "email":creds.email })      
        if(foundUser==None):
            raise Exception("Sorry UserDB Not found")
        if not verify_password(creds.password,foundUser['password']):
            raise Exception("Wrong Password, Try again")

        if(creds.remember==True):
            print("Remembering")
            expiry = datetime.now() + timedelta(days=9999)
        else:
            expiry = datetime.now() + timedelta(days=1)

        token = signAuthToken({
            "name":foundUser['name'],
            "email":foundUser['email'],
            "number":foundUser['number']
        },expiry)
        return {
            "error":False,
            "message":"Logged In",
            "user":{
                "name":foundUser['name'],
                "email":foundUser['email'],
                "number":foundUser['number']
            },
            "token": token,
            "token_type": "bearer"
        }
    except Exception as err:
        print(err)
        return {
            "error":True,
            "message":str(err),
            "user":None,
            "token": None,
            "token_type": None
        }

@app.get("/api/verify")
async def verifyAuth(req:Request):
    try:
        incommingToken = str(req.headers['authorization'].split(" ")[1])
        verification = verify_token(incommingToken)
        verification['_id'] = None
        verification['user'] = None
        return verification
    except Exception as err:
        print(err)
        return {
            "error":True,
            "message":str(err)
        }

# ------------------------------TASK Routes--------------------

@app.get("/api/tasks")
async def getAllTasksOfUser(req:Request):
    token = req.headers['authorization'].split(" ")[1]
    user = verify_token(token)['user']
    usersTasksIdList=[]
    for x in user['tasks']:
        task = TaskDB.find_one({"_id":x})
        task["_id"] = str(x)
        task["user"] = str(task["user"])
        usersTasksIdList.append(task)
    return {
        "error":False,
        "data": usersTasksIdList
    }

@app.post("/api/tasks")
async def postTask(req:Request,taskData:PostTask):
    token = req.headers['authorization'].split(" ")[1]
    user = verify_token(token)['user']
    
    InsertedTaskId = TaskDB.insert_one({
        **taskData.model_dump(),
        "user":user['_id'],
        "completed":False
        }).inserted_id
    
    usersTasks = user['tasks']
    usersTasks.append(InsertedTaskId)
    UserDB.find_one_and_update({"email":user['email']},{"$set" : {"tasks":usersTasks}})
    return {
        "error":False,
        "message": "Added New Task to the list"
    }

# @app.update("/api/tasks")
# async def updateTask(req:Request):

# @app.delete("/api/tasks")
# async def deleteTask(req:Request):
