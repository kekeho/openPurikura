from flask import Flask, render_template, request, redirect, url_for
import os
CURRENT_DIRNAME = os.path.dirname(os.path.abspath(__file__))


app = Flask(__name__, static_folder='./templates/assets')

@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.debug = True
    app.run()