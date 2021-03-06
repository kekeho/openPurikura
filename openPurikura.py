from flask import * #Flask, render_template, request, redirect, url_for, Response
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from PIL import Image
from io import BytesIO
import purikura_lib as pl
import time
import shutil
import subprocess
import base64
import cv2
import random
import os
import sys


CURRENT_DIRNAME = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = './templates/assets'

sys.path.append(CURRENT_DIRNAME + '/database')
sys.path.append(CURRENT_DIRNAME + '/camera')
from init_db import Base, User, CurId
from camera import VideoCamera

app = Flask(__name__, static_folder=ASSETS_DIR)

# Database setup
database_file = CURRENT_DIRNAME + '/openPurikura.db'
db_engine = create_engine('sqlite:///' + database_file,
                          convert_unicode=True, echo=True)
Base.metadata.bind = db_engine
Session = sessionmaker(bind=db_engine)
session = None

# Front page
id_pack = 0
id_photos = [0, 1, 2]
taken = 0

# Web camera
cam = None

# User
curid = 0
email = ""

# Camera Setting
subprocess.call(['bash', 'v4l2-setting.sh'])


@app.route('/')
def index():
    return render_template('index.html')


# Register name and e-mail address
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        if 'agree' not in request.form:
            return redirect('/reset')

        global session
        global curid
        global email

        session = Session()
        new_curid = CurId()
        curid = session.query(CurId.id).first().id

        session.query(User).filter_by(id=curid).delete()
        name = request.form['name']
        email = request.form['email']
        
        new_user = User(id=curid, name=name, email=email)
        session.add(new_user)
        session.commit()

        return redirect('/select1')

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
    global id_pack
    global taken
    global cam

    if request.method == 'GET':
        if (taken >= 5):
            taken = 0
            return redirect('/retouching')

        if (taken == 0):
            for i in range(5):
                shutil.copyfile(ASSETS_DIR + '/src/white.png', ASSETS_DIR + '/photos/{}_before.png'.format(i))
            return render_template('take.html')

        #elif (taken == 4):
        #    return render_template('take.html', pack=str(id_pack))

        else:
            return render_template('take.html')

    else:
        image = cam.get_img()
        cv2.imwrite(ASSETS_DIR + '/photos/{}_before.png'.format(taken), image)
        cv2.imwrite(ASSETS_DIR + '/photos/retouch.png', image)
        time.sleep(0.8)

        taken += 1
        return render_template('take.html')


# Retouching
@app.route('/retouching', methods=['GET', 'POST'])
def retouching():
    global id_pack

    if request.method == 'GET':
        return render_template('retouching.html')

    else:
        for i in range(5):
            image = cv2.imread(ASSETS_DIR + '/photos/{}_before.png'.format(i))
            gray_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            face_landmarks = pl.find.facemark(gray_img)

            print("a")
            image = pl.effects.chromakey_blue(image)
            print("b")
            background = cv2.imread(ASSETS_DIR + '/background/pack-{}/bg-{}.png'.format(id_pack, i))
            image = pl.effects.merge(background, image)
            print("c")

            #image = pl.dist.distortion(image)
            image = pl.effects.nose_shape_beautify(image, face_landmarks)
            print("d")
            #image = pl.effects.eye_bags(image, face_landmarks)
            #image = pl.effects.lips_correction(image, face_landmarks)
            image = pl.effects.eyes_shape_beautify(image, face_landmarks)
            print("e")
            #image = pl.effects.eyes_add_highlight(image, face_landmarks)
            image = pl.effects.chin_shape_beautify(image, face_landmarks)
            print("f")
            #image = pl.effects.skin_beautify(image, rate=2)
            image = pl.effects.color_correction(image)

            #if (i == 4):
            #    teacher = cv2.imread(ASSETS_DIR + '/background/pack-{}/teacher.png'.format(id_pack))
            #    image = pl.effects.merge(image, teacher)

            cv2.imwrite(ASSETS_DIR + '/photos/{}_after.png'.format(i), image)

        return render_template('retouching.html')


# Select 3 pics
@app.route('/select2', methods=['GET', 'POST'])
def select2():
    global id_photos
    if request.method == 'POST':
        id_photos = request.form.getlist('select')

        for i in range(3):
            shutil.copyfile(ASSETS_DIR + '/photos/{}_after.png'.format(id_photos[i]), ASSETS_DIR + '/photos/draw_{}.png'.format(i))

        return redirect('/draw')
        #return redirect('/debug') #DEBUG
    else:
        return render_template('select2.html')


# Draw
@app.route('/draw', methods=['GET', 'POST'])
def draw():
    global curid

    if request.method == 'GET':
        return render_template('draw.html')

    else:
        img_cnt  = request.form['cnt']
        enc_data = request.form['img']
        dec_data = base64.b64decode(enc_data.split(',')[1])
        dec_img  = Image.open(BytesIO(dec_data))
        dec_img.save('images/{}_{}.png'.format(curid, img_cnt))
        return render_template('draw.html')


# Send a mail
@app.route('/mail', methods=['GET', 'POST'])
def mail():
    global id_pack
    global curid
    global email

    if request.method == 'GET':
        print('email={}'.format(email))
        if (email == ""):
            session = Session()
            session.query(CurId).first().id = curid + 1
            session.commit()
            return redirect('/end')

        else:
            return render_template('mail.html')

    else:
        subprocess.call(['ruby', 'database/mail.rb', str(curid)])

        session = Session()
        session.query(CurId).first().id = curid + 1
        session.commit()

        time.sleep(3)

        return render_template('mail.html')

# End
@app.route('/end')
def theend():
    return render_template('end.html')

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

    if (cam == None):
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
