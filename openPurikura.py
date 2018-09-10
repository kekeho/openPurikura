from flask import Flask, render_template, request, redirect, url_for
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.init_db import Base, User
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
    return render_template('index.html')


# Register name and e-mail address
@app.route('/register', methods=['POST'])
def register():
    global session
    session = Session()
    new_user = User(name=request.form['name'], email=request.form['email'])
    session.add(new_user)
    session.commit()
    return redirect('/')  # debug


def main():
    app.debug = True
    app.run()

if __name__ == '__main__':
    main()
