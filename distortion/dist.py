import numpy as np
import cv2
import glob

camera_param = np.load("camera.npz")
mtx  = camera_param["arr_0"]
dist = camera_param["arr_1"]

width  = 1920
height = 1080
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH,  width)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)

while cap.isOpened():
    ret, frame = cap.read()

    newcameramtx, roi = cv2.getOptimalNewCameraMatrix(mtx, dist, (width, height), 1, (width, height))

    mapx, mapy = cv2.initUndistortRectifyMap(mtx,dist,None,newcameramtx,(width,height),5)
    dst = cv2.remap(frame,mapx,mapy,cv2.INTER_LINEAR)

    x, y, w, h = roi
    dst = dst[y:y + h, x:x + w]

    cv2.imshow("frame", frame)
    cv2.imshow("dst", dst)

    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

cv2.destroyAllWindows()
