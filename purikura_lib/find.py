import cv2
import dlib
import numpy
import os

# Cascade files directory path
CASCADE_PATH = os.path.dirname(os.path.abspath(__file__)) + "/haarcascades/"
LEARNED_MODEL_PATH = os.path.dirname(
    os.path.abspath(__file__)) + "/learned-models/"
predictor = dlib.shape_predictor(
    LEARNED_MODEL_PATH + 'helen-dataset.dat')
face_cascade = cv2.CascadeClassifier(
    CASCADE_PATH + 'haarcascade_frontalface_default.xml')


def face_position(gray_img):
    """Detect faces position
    Return:
        faces: faces position list [x, y, w, h]
    """
    faces = face_cascade.detectMultiScale(gray_img, minSize=(100, 100))
    return faces


def normalization(face_landmarks):
    return_list = []
    for facemark in face_landmarks:
        # nose
        nose = list(range(130, 147 + 1))
        nose.remove(139)

        # right eyebrows
        right_eyebrow = list(range(62, 83 + 1))
        right_eyebrow.remove(68)
        right_eyebrow.remove(79)

        # left eyebrows
        left_eyebrow = list(range(84, 105 + 1))
        left_eyebrow.remove(90)
        left_eyebrow.remove(101)

        # right eye
        right_eye = list(range(18, 39 + 1))
        right_eye.remove(24)
        right_eye.remove(35)

        # left_eye
        left_eye = list(range(40, 61 + 1))
        left_eye.remove(46)
        left_eye.remove(57)

        # outside lips
        outside_lips = list(range(148, 178 + 1))
        outside_lips.remove(150)
        outside_lips.remove(161)
        outside_lips.remove(172)

        # inside lips
        inside_lips = list(range(3, 17 + 1))
        inside_lips.remove(13)
        add_list_lips = list(range(179, 193 + 1))
        add_list_lips.remove(183)
        inside_lips += add_list_lips

        # chin
        chin = [0, 1, 106, 117, 128, 139, 150, 161, 172,
                183, 2, 13, 24, 35, 46, 57, 68, 79, 90, 101]
        add_list = list(range(107, 129 + 1))
        add_list.remove(117)
        add_list.remove(128)
        chin += add_list
        
        for nose_i, fm_i in enumerate(nose):
            nose[nose_i] = facemark[fm_i]

        for reb_i, fm_i in enumerate(right_eyebrow):
            right_eyebrow[reb_i] = facemark[fm_i]

        for leb_i, fm_i in enumerate(left_eyebrow):
            left_eyebrow[leb_i] = facemark[fm_i]

        for re_i, fm_i in enumerate(right_eye):
            right_eye[re_i] = facemark[fm_i]

        for le_i, fm_i in enumerate(left_eye):
            left_eye[le_i] = facemark[fm_i]

        for ol_i, fm_i in enumerate(outside_lips):
            outside_lips[ol_i] = facemark[fm_i]

        for il_i, fm_i in enumerate(inside_lips):
            inside_lips[il_i] = facemark[fm_i]

        for chin_i, fm_i in enumerate(chin):
            chin[chin_i] = facemark[fm_i]

        return_list.append(chin + nose + outside_lips + inside_lips + \
                        right_eye + left_eye + right_eyebrow + left_eyebrow)
        
    return return_list


def facemark(gray_img):
    """Recoginize face landmark position by helen dataset
    Return:
        randmarks = [
        [x, y],
        [x, y],
        ...
        ]
        [0~40]: chin
        [41~57]: nose
        [58~85]: outside of lips
        [86-113]: inside of lips
        [114-133]: right eye
        [134-153]: left eye
        [154-173]: right eyebrows
        [174-193]: left eyebrows
    """
    landmarks = []

    detector = dlib.get_frontal_face_detector()
    rects = detector(gray_img, 1)
    for rect in rects:
        landmarks.append(
            numpy.array(
                [[p.x, p.y] for p in predictor(gray_img, rect).parts()])
        )

    return normalization(landmarks)


if __name__ == '__main__':
    cap = cv2.VideoCapture(0)
    while cap.isOpened():
        ret, frame = cap.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        landmarks = facemark(gray)

        for landmark in landmarks:
            for points in landmark:
                cv2.drawMarker(frame, (points[0], points[1]), (21, 255, 12))
        cv2.imshow("video frame", frame)
        if cv2.waitKey(25) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
