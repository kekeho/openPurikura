import cv2
import numpy as np
import os
import sys
from PIL import Image
from skimage import transform

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


def distort(image: np.array, from_points: list, to_points: list):
    """
    Args:
        image: openCV image (np.ndarray)
        roi_points: roi points list
        from_points and to_points: distort image from_points to to_points
    """
    # Convert openCV array to PIL data
    image = Image.fromarray(image)
    image = image.convert('RGBA')

    # roi == image size
    roi_points = [(0, 0), (image.width, 0),
                  (image.width, image.height),
                  (0, image.height)]
    from_points = np.concatenate((roi_points, from_points))
    to_points = np.concatenate((roi_points, to_points))
    
    affin = transform.PiecewiseAffineTransform()
    affin.estimate(to_points, from_points)
    image_array = transform.warp(image, affin)
    image_array = np.array(image_array * 255, dtype='uint8')

    if image_array.shape[2] == 1:
        image_array = image_array.reshape((image_array.shape[0], image_array.shape[1]))
    warped_image = Image.fromarray(image_array, 'RGBA')
    
    return np.asarray(warped_image)


def main():
    image = cv2.imread(CURRENT_DIRNAME + '/../Tests/sources/grandfather.jpg')
    image = distort(image, [(600, 600)], [(600, 700)])
    cv2.imshow('image', image)
    cv2.waitKey()
    cv2.imwrite('yugami.png', image)

if __name__ == '__main__':
    main()
