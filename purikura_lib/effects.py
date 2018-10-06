import cv2
import numpy as np
import os
import sys
import math
from sympy import *
from PIL import Image
from skimage import transform
from PIL.PngImagePlugin import PngImageFile

CURRENT_DIRNAME = os.path.dirname(os.path.abspath(__file__))
sys.path.append(CURRENT_DIRNAME + '/')
import utils
import find

class MaskShapeError(Exception):
    def __init__(self, ndarray1: np.ndarray, ndarray2: np.ndarray):
        self.shape1 = ndarray1.shape
        self.shape2 = ndarray2.shape

    def __str__(self):
        return 'The shapes of image and mask does not match! {} != {}'.format(self.shape1[:2], self.shape2)


def delete_pixel(image: np.ndarray, mask: np.ndarray):
    """Generate image which has alpha channel & transparent pixel by mask
    Args:
        image: HSV or RGB(BGR) image
        mask: Make 0xff zone transparent
    Retrun:
        image which has alpha channel: np.ndarray
    """
    if image.shape[:2] != mask.shape:
        raise MaskShapeError(image, mask)

    image_list = image.tolist()
    for line_count, line in enumerate(mask):
        for row_count, pixel in enumerate(line):
            if (pixel == 255):
                # 0xff is transparent flag
                # insert alpha channel (transparent)
                image_list[line_count][row_count].append(0)
            else:
                # insert alpha channnel (set no transparent)
                image_list[line_count][row_count].append(255)

    return_img = np.array(image_list, dtype='uint8')
    return return_img


def chromakey(image: np.ndarray):
    """transpare green pixels
    Return:
        image which includes alpha channel: np.ndarray
    """
    # Green
    # why I should divide by 2...f**k
    lower_color = np.array([65 / 2, 50, 50])
    upper_color = np.array([155 / 2, 255, 255])

    # convert image to hsv
    hsv_img = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    # transparent mask
    mask = cv2.inRange(hsv_img, lower_color, upper_color)
    return_img = delete_pixel(image, mask)

    return return_img


def merge(image1: np.ndarray, image2: np.ndarray, x=0, y=0, per=100):
    """Put image2 on image 1
    Args:
        image1: base image
        image2: put image2 on image1
        x: upper left (default: 0)
        y: upper left (default: 0)
        per: resize image2 (default: 100%)
    Return:
        Merged image
    """
    # resize image2
    image2 = cv2.resize(
        image2, (int(image2.shape[1] * (per / 100)), int(image2.shape[0] * (per / 100))))

    # Convert opencv array to PIL data
    image1 = Image.fromarray(image1)
    image2 = Image.fromarray(image2)

    image1.paste(image2, box=(x, y), mask=image2)

    return np.asarray(image1)


def skin_beautify(image: np.ndarray, rate=10):
    """Skin beautify method (It called Bihada-Kako in Japanese Purikura)
    Args:
        image: openCV image (3-channel, 8bit color)
        power: Processing rate (defalut=10)
    Return:
        np.ndarray: Beautified image

    This function using Non-locale Means Algorithm
    """
    filtered_img = cv2.fastNlMeansDenoisingColored(
        image, None, rate, 10, 7, 21)
    return filtered_img


def distort(image: np.array, from_points: list, to_points: list, roi_points: list):
    """
    Args:
        image: openCV image (np.ndarray)
        roi_points: roi points list
        from_points and to_points: distort image from_points to to_points
    """
    # Convert openCV array to PIL data
    image = Image.fromarray(image)
    image = image.convert('RGBA')

    from_points = np.concatenate((roi_points, from_points))
    to_points = np.concatenate((roi_points, to_points))

    affin = transform.PiecewiseAffineTransform()
    affin.estimate(to_points, from_points)
    image_array = transform.warp(image, affin)
    image_array = np.array(image_array * 255, dtype='uint8')

    if image_array.shape[2] == 1:
        image_array = image_array.reshape(
            (image_array.shape[0], image_array.shape[1]))
    warped_image = Image.fromarray(image_array, 'RGBA')
    image.paste(warped_image, (0, 0), warped_image)

    return np.asarray(image)


def nose_shape_beautify(image: np.ndarray, face_landmarks: list):
    """Beautify nose👃
    This function can uses for many people
    """
    for landmark in face_landmarks:
        # Original face width
        face_width = np.linalg.norm(landmark[40] - landmark[0])
        # Original nose width (Under)
        original_nose_width = np.linalg.norm(landmark[53] - landmark[45])
        # Beautiful nose width
        expected_nose_width = face_width / 6

        if expected_nose_width >= original_nose_width:
            # Already has beautiful shape nose
            break
        else:
            # roi
            x1, y1, x2, y2 = utils.detect_roi(landmark[41:57 + 1])

            image = distort(image, [landmark[41]], [landmark[41] + (landmark[57] - landmark[41]) / 7],
                            [(x1, y1), (x2, y1), (x2, y2),
                             (x1, y2)])

            image = distort(image, [landmark[57]], [landmark[57] - (landmark[57] - landmark[41]) / 7],
                            [(x1, y1), (x2, y1), (x2, y2),
                             (x1, y2)])

            image = distort(image, [landmark[45]], [landmark[45] + (landmark[53] - landmark[45]) / 7],
                            [(x1, y1), (x2, y1), (x2, y2),
                             (x1, y2)])

            image = distort(image, [landmark[53]], [landmark[53] - (landmark[53] - landmark[45]) / 7],
                            [(x1, y1), (x2, y1), (x2, y2),
                             (x1, y2)])

    return image


def eyes_shape_beautify(image: np.ndarray, face_landmarks: list):
    """Beautify eyes👀
    This function can uses for many people
    """
    for landmark in face_landmarks:
        # left eye
        x1, y1, x2, y2 = utils.detect_roi(landmark[134:153 + 1])  # roi
        l_upside_from_points = []
        l_upside_to_points = []
        l_down_from_points = []
        l_down_to_points = []
        for i, j in zip(range(134,143+1), list(range(143, 153+1))[:][::-1]):
            l_upside_from_points.append(landmark[i] + (landmark[j] - landmark[i]) / 50)
            l_upside_to_points.append(landmark[i] - (landmark[j] - landmark[i]) / 5)
            l_down_from_points.append(landmark[j] - (landmark[j] - landmark[i]) / 20)
            l_down_to_points.append(landmark[j] + (landmark[j] - landmark[i]) / 5)


        image = distort(image, l_upside_from_points, l_upside_to_points,
                        [(x1, y1), (x2, y1), (x2, y2),
                            (x1, y2)])
        image = distort(image, l_down_from_points, l_down_to_points,
                        [(x1, y1), (x2, y1), (x2, y2),
                            (x1, y2)])

        # right eye
        x1, y1, x2, y2 = utils.detect_roi(landmark[114:133 + 1])  # roi
        r_upside_from_points = []
        r_upside_to_points = []
        r_down_from_points = []
        r_down_to_points = []
        for i, j in zip(range(114,123+1), list(range(124, 133+1))[:][::-1]):
            r_upside_from_points.append(landmark[i] + (landmark[j] - landmark[i]) / 50)
            r_upside_to_points.append(landmark[i] - (landmark[j] - landmark[i]) / 5)
            r_down_from_points.append(landmark[j] - (landmark[j] - landmark[i]) / 20)
            r_down_to_points.append(landmark[j] + (landmark[j] - landmark[i]) / 5)


        image = distort(image, r_upside_from_points, r_upside_to_points,
                        [(x1, y1), (x2, y1), (x2, y2),
                            (x1, y2)])
        image = distort(image, r_down_from_points, r_down_to_points,
                        [(x1, y1), (x2, y1), (x2, y2),
                            (x1, y2)])

        highlight = cv2.imread(CURRENT_DIRNAME + '/eyes_highlight.png', cv2.IMREAD_UNCHANGED)
        
        line1 = Segment(Point(landmark[134]), Point(landmark[145]))
        line2 = Segment(Point(landmark[139]), Point(landmark[150]))
        ls = intersection(line1, line2)

        dx, dy = (landmark[150] - landmark[139]) / 5
        x, y = int(ls[0].x) - dx, int(ls[0].y) - dy
        w = np.linalg.norm(landmark[150] - landmark[139])
        ratio = w/highlight.shape[1] * 100
        x = int(x - highlight.shape[0]*(ratio/100)/2)
        y = int(y - highlight.shape[1]*(ratio/100)/2)
        image = merge(image, highlight, x, y, ratio)

        line1 = Segment(Point(landmark[114]), Point(landmark[124]))
        line2 = Segment(Point(landmark[120]), Point(landmark[129]))
        ls = intersection(line1, line2)
        
        dx, dy = (landmark[129] - landmark[120]) / 5
        x, y = int(ls[0].x) - dx, int(ls[0].y) - dy
        w = np.linalg.norm(landmark[129] - landmark[120])
        ratio = w/highlight.shape[1] * 100
        x = int(x - highlight.shape[0]*(ratio/100)/2)
        y = int(y - highlight.shape[1]*(ratio/100)/2)
        image = merge(image, highlight, x, y, ratio)

    return image


def animal_ears(image: np.ndarray, ear_image: PngImageFile, face_landmarks: list):
    """attach animal_ears like nekomimi
    args:
        image: base image
        ear_image: one animal ear image
        face_landmarks: face_landmarks list
    """
    for landmark in face_landmarks:
        # position of ear_image center
        left = landmark[140] - ((landmark[20] - landmark[140])*0.8).astype(np.int32)
        right = landmark[119] - ((landmark[20] - landmark[119])*0.8).astype(np.int32)
        
        
        l_delta = landmark[20] - landmark[140]
        l_rad = math.atan2(l_delta[1], l_delta[0])
        l_deg = math.degrees(l_rad)
        l_deg = (l_deg-90) * -1
        l_ear_image = ear_image.rotate(l_deg)
        l_ear_image = np.asarray(l_ear_image)

        r_delta = landmark[20] - landmark[119]
        r_rad = math.atan2(r_delta[1], r_delta[0])
        r_deg = math.degrees(r_rad)
        r_deg = (r_deg-90) * -1
        r_ear_image = ear_image.rotate(r_deg)
        r_ear_image = np.asarray(r_ear_image)

        ear_par = 20 #resize 20%
        image = merge(image, l_ear_image, int(left[0]-l_ear_image.shape[0]/2*(ear_par/100)), int(left[1]-l_ear_image.shape[1]/2*(ear_par/100)), per=20)
        image = merge(image, r_ear_image, int(right[0]-r_ear_image.shape[0]/2*(ear_par/100)), int(right[1]-r_ear_image.shape[1]/2*(ear_par/100)), per=20)

    return image


def main():
    image = cv2.imread(CURRENT_DIRNAME + '/../Tests/sources/japanese_girl.jpg')
    gray_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    face_landmarks = find.facemark(gray_img)

    image = nose_shape_beautify(image, face_landmarks)
    image = eyes_shape_beautify(image, face_landmarks)
    image = skin_beautify(image, rate=5)

    nekomimi = Image.open(CURRENT_DIRNAME + '/../Tests/sources/nekomimi.png')
    image = animal_ears(image, nekomimi, face_landmarks)

    cv2.imshow('image', image)
    cv2.waitKey()


if __name__ == '__main__':
    main()
