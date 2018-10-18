from flask import Flask, render_template, request, redirect, url_for, Response
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.init_db import Base, User
from camera.camera import VideoCamera
import os
import subprocess
import cv2
import sys


CURRENT_DIRNAME = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, static_folder='./templates/assets')

# Database setup
database_file = CURRENT_DIRNAME + '/database/openPurikura.db'
db_engine = create_engine('sqlite:///' + database_file,
                          convert_unicode=True, echo=True)
Base.metadata.bind = db_engine
Session = sessionmaker(bind=db_engine)
session = None

# Front page
id_pack = 0
id_photos = [0, 1, 2]
taken = 0

#Web camera
cam = 0


@app.route('/')
def index():
    return render_template('purikura.html')

@app.route('/oekaki')
def oekaki():
    return render_template('purikura.html')

# Register name and e-mail address
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        if 'agree' not in request.form:
            return redirect('/reset')

        global session
        session = Session()
        new_user = User(name=request.form['name'], email=request.form['email'])
        session.add(new_user)
        session.commit()
        return redirect('/select1')  # debug
    else:
        return render_template('register.html')


# Select a pack
@app.route('/select1', methods=['GET', 'POST'])
def select1():
    global id_pack
    if request.method == 'POST':
        id_pack = int(request.form['pack'])
        return redirect('/take')
        #return redirect('/debug') #DEBUG
    else:
        return render_template('select1.html')


# Take a photo
@app.route('/take', methods=['GET', 'POST'])
def take():
    global taken
    global cam

    if request.method == 'GET':
        print(taken)
        if (taken >= 5):
            taken = 0
            del cam
            return redirect('/select2')
        else:
            return render_template('take.html')

    else:
        taken += 1
        cam.save('photos/' + str(taken) + '.png')

        return render_template('take.html')


# Select 3 pics
@app.route('/select2', methods=['GET', 'POST'])
def select2():
    global id_photos
    if request.method == 'POST':
        id_photos = request.form.getlist('select')
        return redirect('/draw')
        #return redirect('/debug') #DEBUG
    else:
        return render_template('select2.html')


# Draw
@app.route('/draw')
def draw():
    return render_template('draw.html')


# Send a mail
@app.route('/mail')
def mail():
    return redirect('/end')

# Reset variables
@app.route('/reset')
def end():
    global id_pack
    global id_photos
    global taken
    id_pack = 0
    id_photos = [0, 1, 2]
    taken = 0
    return redirect('/')


# Debug
@app.route('/debug')
def debug():
    global id_pack
    global id_photos
    global taken
    return render_template('debug.html', id_pack=id_pack, id_photos=id_photos, taken=taken)

# Video streaming test page
@app.route('/videostreaming')
def videoStreaming():
    return render_template('videostreaming.html')


@app.route('/video_feed')
def video_feed():
    global cam

    if (cam == 0):
        cam = VideoCamera()

    return Response(gen(cam),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


def main():
    app.debug = True
    app.run(host='0.0.0.0', port=8080, threaded=True)


if __name__ == '__main__':
    main()
