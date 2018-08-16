import cv2
import numpy as np
import os

CURRENT_DIRNAME = os.path.dirname(os.path.abspath(__file__))


class MaskShapeError(Exception):
    def __init__(self, ndarray1: np.ndarray, ndarray2: np.ndarray):
        self.shape1 = ndarray1.shape
        self.shape2 = ndarray2.shape

    def __str__(self):
        return f'The shapes of image and mask does not match! {self.shape1[:2]} != {self.shape2}'


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
