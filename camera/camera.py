import cv2

class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)
        self.video.set(cv2.CAP_PROP_FRAME_WIDTH,  1920)
        self.video.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)
    
    def __del__(self):
        self.video.release()

    def save(self, fname):
        cv2.imwrite(fname, self.img)

    def get_frame(self):
        _, self.img = self.video.read()
        self.img = self.img[0:1080, 420:1500]
        _, jpg = cv2.imencode('.jpg', self.img)
        return jpg.tobytes()
