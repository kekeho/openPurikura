import cv2
import dlib
import numpy
import os

# Cascade files directory path
CASCADE_PATH = os.path.dirname(os.path.abspath(__file__)) + "/haarcascades/"
LEARNED_MODEL_PATH = os.path.dirname(
    os.path.abspath(__file__)) + "/learned-models/"
predictor = dlib.shape_predictor(
    LEARNED_MODEL_PATH + 'shape_predictor_68_face_landmarks.dat')
face_cascade = cv2.CascadeClassifier(
    CASCADE_PATH + 'haarcascade_frontalface_default.xml')


def facemark(img):
    detector = dlib.get_frontal_face_detector()
    rects = detector(img, 1)

    landmarks = []
    for rect in rects:
        landmarks = numpy.array(
            [[p.x, p.y] for p in predictor(img, rect).parts()]
        )
    return landmarks
    # randmarks = [
    #   [x, y],
    #   [x, y],
    #   ...
    # ]
    # [0~17]: chin
    # [18~22]: left eyebrow
    # [23~27]: right eyebrow
    # [28-31]: center of nose
    # [32-36]: under-outline of nose
    # [37-42]: left eye
    # [43-46]: right-eye
    # [49-65]: mouth


if __name__ == '__main__':
    cap = cv2.VideoCapture(0)
    while cap.isOpened():
        ret, frame = cap.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        landmarks = facemark(gray)

        for point in landmarks:
            cv2.drawMarker(frame, (point[0], point[1]), (21, 255, 12))
        cv2.imshow("video frame", frame)
        if cv2.waitKey(25) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
