import bcrypt,jwt,datetime
from database import UserDB

SECRET_JWT = "alsdkThislksdjfkajfIsksndfmnRandom"

def hash_password(password:str) -> str:
    SALT = bcrypt.gensalt(10)
    hashed_password = bcrypt.hashpw(password.encode('utf-8'),SALT)
    return hashed_password.decode('utf-8')

def verify_password(password:str,knownPassword:str) -> bool:
    return  bool(bcrypt.checkpw(password.encode('utf-8'),knownPassword.encode('utf-8')))

def signAuthToken(data,expiry):
    return jwt.encode({
                "name":data['name'],
                "email":data['email'],
                "number":data['number'],
                "exp":expiry
            },SECRET_JWT)

def verify_token(token:str):
    decodedToken = jwt.decode(token,SECRET_JWT,"HS256")
    currentTime = int(datetime.datetime.now().timestamp())
    if(decodedToken['exp']<=currentTime):
        return {
            "error":True,
            "authStatus":False,
            "message":"Expired Token"
        }
    findingUser = UserDB.find_one({"email": decodedToken['email']})
    if not findingUser:
        return{
            "error":True,
            "authStatus":False,
            "message":"User no longer exists"
        }
    return {
        "error":False,
        "message":"Returning user",
        "authStatus":True,
        "user":{
            "name":findingUser['name'],
            "email":findingUser['email'],
            "number":findingUser['number']
        }
    }
