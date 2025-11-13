from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Message(BaseModel):
    text: str

messages = []

@app.get("/")
def home():
    return {"message": "Hello from NEXT24!"}

@app.get("/messages")
def get_messages():
    return messages

@app.post("/messages")
def create_message(msg: Message):
    messages.append(msg.text)
    return {"status": "created", "message": msg.text}
