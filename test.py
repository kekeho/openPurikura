from flask import *

app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def odd_even():
    if request.method == "GET":
        return """
        下に整数を入力してください。奇数か偶数か判定します
        <form action="/" method="POST">
        <input name="num"></input>
        </form>"""
    else:
        return """
        {}は{}です！
        <form action="/" method="POST">
        <input name="num"></input>
        </form>""".format(str(request.form["num"]), ["偶数", "奇数"][int(request.form["num"]) % 2])

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8888, threaded=True)
