import sys
import os
import cv2
import socket
from contextlib import closing


def main():
    
    #s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s = socket.socket()
    cap = cv2.VideoCapture(0)
    
    with closing(s):
        s.bind(('127.0.0.1', 80))
        s.listen(10)
        while True:
            conn, address = s.accept()
            with closing(conn):
                msg = conn.recv(2048)
                print(msg)
                conn.send(msg)


    print('e')


    while cap.isOpened():
        (ret, frame) = cap.read()
        cv2.imwrite(sys.argv[1] + '.png', frame)
        break

    cap.release()


if __name__ == '__main__':
    main()