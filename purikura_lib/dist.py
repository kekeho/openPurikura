import numpy as np
import cv2
import glob
import os


CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

# Output camera calibration file
def calibration():
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.001)
    objp = np.zeros((6 * 7, 3), np.float32)
    objp[:, :2] = np.mgrid[0:7, 0:6].T.reshape(-1, 2)

    objpoints = []
    imgpoints = []

    images = glob.glob(CURRENT_DIR + "/calib_img/*.png")

    for fname in images:
        img = cv2.imread(fname)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        ret, corners = cv2.findChessboardCorners(gray, (7, 6), None)

        if ret == True:
            corners2 = cv2.cornerSubPix(gray, corners, (11, 11), (-1, -1), criteria)
            objpoints.append(objp)
            imgpoints.append(corners2)

        else:
            print("filed: " + fname)

    ret, mtx, dst, rvecs, tvecs = cv2.calibrateCamera(objpoints, imgpoints, gray.shape[::-1], None, None)
    np.savez(CURRENT_DIR + "/calib_img/camera.npz", mtx, dst)


# Camera distortion
def distortion(img):
    camera_param = np.load(CURRENT_DIR + "/calib_img/camera.npz")
    mtx = camera_param["arr_0"]
    dst = camera_param["arr_1"]
    height, width = img.shape[:2]

    newcameramtx, roi = cv2.getOptimalNewCameraMatrix(mtx, dst, (width, height), 1, (width, height))
    out = cv2.undistort(img, mtx, dst, None, newcameramtx)

    x, y, w, h = roi
    out = out[y:y + h, x:x + w]

    return out


if __name__ == "__main__":
    cap = cv2.VideoCapture(0)

    while cap.isOpened():
        ret, frame = cap.read()
        dist = distortion(frame)

        cv2.imshow("frame", frame)
        cv2.imshow("dist", dist)

        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

    cv2.destroyAllWindows()
