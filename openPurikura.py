from flask import Flask, render_template, request, redirect, url_for, Response
from PIL import Image
from io import BytesIO
from camera.webcamera import VideoCamera
import purikura_lib as pl
import pickle
import time
import random
import shutil
import subprocess
import base64
import cv2
import os
import sys


CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = CURRENT_DIR + '/templates/assets'

app = Flask(__name__, static_folder=ASSETS_DIR)

# Front page
id_pack = 0
id_photos = ['1', '2', '3']
taken = 0

# Web camera
cam = None
subprocess.call(['bash', CURRENT_DIR + '/camera/v4l2-setting.sh'])

# Cache Number
cnum_file = CURRENT_DIR + '/cachenum.dat'
cache_num = 0


@app.route('/')
def index():
    global taken
    global cnum_file
    global cache_num

    taken = 0

    if (os.path.isfile(cnum_file)):
        with open(cnum_file, 'rb') as fp:
            cache_num = pickle.load(fp)

    cache_num += 1

    with open(cnum_file, 'wb') as fp:
        pickle.dump(cache_num, fp)

    return render_template('index.html')


# Select a pack
@app.route('/select1', methods=['GET', 'POST'])
def select1():
    global id_pack
    if request.method == 'POST':
        id_pack = int(request.form['pack'])
        return redirect('/take')
    else:
        return render_template('select1.html')


# Take a photo
@app.route('/take', methods=['GET', 'POST'])
def take():
    global id_pack
    global taken
    global cam
    global cache_num

    if request.method == 'GET':
        taken += 1

        if taken > 5:
            taken = 0
            return redirect('/retouching')

        else:
            return render_template('take.html', take_num=taken, cache_num=cache_num)

    else:
        image = cam.get_img()
        cv2.imwrite(ASSETS_DIR + '/photos/c{}_before-{}.png'.format(cache_num, taken), image)
        time.sleep(0.8)

        return render_template('take.html', take_num=taken, cache_num=cache_num)


# Retouching
@app.route('/retouching', methods=['GET', 'POST'])
def retouching():
    global id_pack
    global cache_num

    if request.method == 'GET':
        return render_template('retouching.html')

    else:
        for i in range(5):
            image = cv2.imread(ASSETS_DIR + '/photos/c{}_before-{}.png'.format(cache_num, i + 1))
            gray_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            face_landmarks = pl.find.facemark(gray_img)

            image = pl.effects.chromakey_green(image)
            background = cv2.imread(ASSETS_DIR + '/background/pack-{}/bg-{}.png'.format(id_pack, i))
            image = pl.effects.merge(background, image)
            #image = pl.dist.distortion(image)
            image = pl.effects.nose_shape_beautify(image, face_landmarks)
            #image = pl.effects.eye_bags(image, face_landmarks)
            #image = pl.effects.lips_correction(image, face_landmarks)
            image = pl.effects.eyes_shape_beautify(image, face_landmarks)
            #image = pl.effects.eyes_add_highlight(image, face_landmarks)
            image = pl.effects.chin_shape_beautify(image, face_landmarks)
            #image = pl.effects.skin_beautify(image, rate=2)
            image = pl.effects.color_correction(image)

            cv2.imwrite(ASSETS_DIR + '/photos/c{}_after-{}.png'.format(cache_num, i + 1), image)

        return render_template('retouching.html')


# Select 3 pictures
@app.route('/select2', methods=['GET', 'POST'])
def select2():
    global id_photos
    global cache_num

    if request.method == 'GET':
        return render_template('select2.html', cache_num=cache_num)

    else:
        id_photos = request.form.getlist('select')
        return redirect('/draw')


# Draw
@app.route('/draw', methods=['GET', 'POST'])
def draw():
    global id_photos
    global cache_num

    if request.method == 'GET':
        return render_template('draw.html', id_photos=id_photos, cache_num=cache_num)

    else:
        img_cnt  = request.form['cnt']
        enc_data = request.form['img']
        dec_data = base64.b64decode(enc_data.split(',')[1])
        dec_img  = Image.open(BytesIO(dec_data))
        dec_img.save(ASSETS_DIR + '/photos/c{}_finish-{}.png'.format(cache_num, img_cnt))
        return render_template('draw.html', id_photos=id_photos, cache_num=cache_num)


# End
@app.route('/end')
def theend():
    return render_template('end.html')


# Video streaming test page
@app.route('/videostreaming')
def videoStreaming():
    return render_template('videostreaming.html')


@app.route('/video_feed')
def video_feed():
    global cam

    if cam == None:
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
