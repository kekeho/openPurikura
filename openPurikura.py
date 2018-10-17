from flask import Flask, render_template, request, redirect, url_for, Response
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.init_db import Base, User
from camera.camera_opencv import Camera
import os
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

@app.route('/')
def index():
    return render_template('index.html')


# Register name and e-mail address
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        if request.form['agree'] != None:
            return redirect('/end')

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
    if request.method == 'POST':
        global id_pack = int(request.form['pack'])
        return redirect('/take')
    else:
        return render_template('select1.html')


# Take a photo
@app.route('/take')
def take():
    return render_template('take.html')

# White out
@app.route('/take/whiteout')
def whiteout():
    global taken += 1
    if taken < 5:
        return redirect('/take')
    else:
        return redirect('/select2')

# Select 3 pics
@app.route('/select2', methods=['GET', 'POST'])
def select2():
    if request.method == 'POST':
        global id_photos = request.form.getlist('select')
        return redirect('/take')
    else:
        return render_template('select.html')


# Draw
@app.route('/draw')
def draw():
    return render_template('draw.html')


# Send a mail
@app.route('/mail')
def mail():
    return redirect('/end')

#@app.route('/end')
#def end():
#    global id_pack = 0
#    global id_photos = [0, 1, 2]
#    global taken = 0
#    return render_template('end.html')


# Video streaming test page
@app.route('/videostreaming')
def videoStreaming():
    return render_template('videostreaming.html')


# Video streaming
@app.route('/video_feed')
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    return Response(gen(Camera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


# Get camera frame
def gen(camera):
    """Video streaming generator function."""
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


def main():
    app.debug = True
    app.run(host='0.0.0.0', port=8080, threaded=True)

if __name__ == '__main__':
    main()
