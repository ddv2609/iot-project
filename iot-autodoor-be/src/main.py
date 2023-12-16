from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from websockets import client
from PIL import Image
from io import BytesIO
import os
import json
from keras.models import load_model
from keras.preprocessing import image
import numpy as np
from train import train
import time
import asyncio

app = FastAPI()

origins = [
  "http://localhost",  
  "http://localhost:3000", 
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

img_width, img_height = 128, 128

model = load_model('face_detection_model.h5')

async def handle_recognize_face(face):
  face = face.resize((img_width, img_height))

  img_array = image.img_to_array(face)

  img_array = np.expand_dims(img_array, axis=0)

  img_array /= 255.0

  prediction = model.predict(img_array)

  if prediction[0][0] > prediction[0][1]:
    return False
  else:
    return True

def add_image_to_real_time(real_time_path, face):
  amountImagesRealTime = len(os.listdir(real_time_path))
  face.save(f'{real_time_path}{amountImagesRealTime + 1}.jpg')
  if amountImagesRealTime > 200:
    image_files = [f for f in os.listdir(real_time_path) if f.endswith('.jpg')]
    oldest_image_path = os.path.join(real_time_path, min(image_files, key=lambda x: os.path.getctime(os.path.join(real_time_path, x))))
    os.remove(oldest_image_path)

@app.get("/")
def read_root():
  return {"message": "Hello, World!"}


@app.websocket("/recognize")
async def recognize_enpoint(server: WebSocket):
  try:
    await server.accept()
    print("Start '/recognize'")

    text_file_path = "../user_open_door.txt"
    images_folder_path = "../images/open/"
    real_time_path = "../real_time/"

    names = []
    with open(text_file_path, 'r') as file:
      content = file.read()
      if not content.strip() == "":
        names = content.split(",")

    await server.send_json(json.dumps({
      "type": "users",
      "users": names
    }))

    print("'/recognize' is connecting to ESCP32-CAM...")

    async with client.connect("ws://192.168.207.38:60/") as socket:
      print("'/recognize' connected to ESCP32-CAM") 
      isAllow = 0
      isEmpty = False if len(os.listdir(images_folder_path)) > 0 else True
      open_door_time = 0
      while True:
        current_time = time.time()
        blob = await socket.recv()
        if current_time - open_door_time >= 10:
          face = Image.open(BytesIO(blob))
          face_task = asyncio.create_task(handle_recognize_face(face))

          await asyncio.sleep(0) 

          if not isEmpty:
            if await face_task:
              isAllow += 1
            else:
              isAllow = 0
              add_image_to_real_time(real_time_path, face)
          
          if isAllow == 50:
            isAllow = 0
            open_door_time = time.time()
            await socket.send("9")
            await server.send_json(json.dumps({
              "type": "notification",
              "allow": "open"
            }))


  except Exception as err:
    print(f"Error in /recognize: {err}")

@app.websocket("/train")
async def train_enpoint(server: WebSocket):
  try:
    await server.accept()
    global model
    print("Start '/train'")
    text_file_path = "../user_open_door.txt"
    images_folder_path = "../images/open/"
    while True:
      message = await server.receive_json()
      names = []
      print(message)
      if message["action"] == "add":

        with open(text_file_path, 'r') as file:
          content = file.read()
          if not content.strip() == "":
            names = content.split(",")
        
        if message["user"] not in names:
          print("'/train' is connecting to ESCP32-CAM...")
          async with client.connect("ws://192.168.207.38:60/") as socket:
            print("'/train' connected to ESCP32-CAM") 
            for num in range(1, 101):
              print(f"Received data ({num})")
              blob = await socket.recv()
              image = Image.open(BytesIO(blob))
              image.save(f'{images_folder_path}{message["user"]}_{num}.jpg')
          
          train()
          model = load_model('face_detection_model.h5')

          names.append(message["user"])
          with open(text_file_path, 'w') as file:
            file.write(','.join(names))
          
          await server.send_json(json.dumps({
            "users": names,
            "status": "train success"
          }))
        else:
          await server.send_json(json.dumps({
            "users": names,
            "status": "namesake"
          }))
      else: 
        if message["action"] == "delete":
          with open(text_file_path, 'r') as file:
            content = file.read()
            names = content.split(",")
          names.remove(message["user"])
          
          for filename in os.listdir(images_folder_path):
            if filename.startswith(f'{message["user"]}_') and filename.endswith('.jpg'):
              image_path = os.path.join(images_folder_path, filename)
              os.remove(image_path)

          train()
          model = load_model('face_detection_model.h5')

          with open(text_file_path, 'w') as file:
            file.write(','.join(names))
          
          await server.send_json(json.dumps({
            "users": names,
            "status": "delete success"
          }))
        else:
          with open(text_file_path, 'w') as file:
            file.write("")
          
          for filename in os.listdir(images_folder_path):
            image_path = os.path.join(images_folder_path, filename)
            os.remove(image_path)

          train()
          model = load_model('face_detection_model.h5')

          await server.send_json(json.dumps({
            "users": [],
            "status": "delete all success"
          }))
  except Exception as err:
    await server.send_json(json.dumps({
      "status": "error"
    }))


if __name__ == "__main__":
  uvicorn.run("main:app", port=8000, log_level="info")