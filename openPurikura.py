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


@app.route('/')
def index():
    return render_template('purikura.html')


# Register name and e-mail address
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        global session
        session = Session()
        new_user = User(name=request.form['name'], email=request.form['email'])
        session.add(new_user)
        session.commit()
        return redirect('/take')  # debug
    else:
        return render_template('register.html')


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
