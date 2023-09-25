from pydantic_settings import BaseSettings
# from functools import lru_cache

class Envariables(BaseSettings):
    MONGO_URL:str="mongodb://localhost:27017/"

    class Config:
        env_file='fastAPIserver/.env'

def get_envs()-> Envariables:
    return Envariables()