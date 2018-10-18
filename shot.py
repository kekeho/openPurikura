import sys
import os
import cv2


def main():
    cap = cv2.VideoCapture(0)

    if cap.isOpened():
        ret, frame = cap.read()
        cv2.imwrite(sys.argv[1] + '.png', frame)

    cap.release()


if __name__ == '__main__':
    main()
