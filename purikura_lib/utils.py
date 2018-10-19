import numpy as np
import cv2

def add_alpha_channel(image: np.ndarray):
    image = image.tolist()
    for line_count, line in enumerate(image):
        for row_count, pixel in enumerate(line):
            image[line_count][row_count].append(255)

    return np.array(image, dtype='uint8')


def detect_roi(points: list, e=50):
    """
    Args:
        points: points list
        e: margin (default=50)
    Return: (min_x, min_y, max_x, max_y)
    """
    xlist = []
    ylist = []
    for x, y in points:
        xlist.append(x)
        ylist.append(y)
    return min(xlist) - e, min(ylist) - e, max(xlist) + e, max(ylist) + e


def line_generator(points: list):
    """
    Create line from few points (set of pixels)
    Arg:
        points: few points list
    Return:
        line (set of pixels) list
    """
    before_point = None
    line_list = []
    for point in points:
        if before_point is None:
            line_list.append(point)
            before_point = point.tolist()
            continue
        before_x = before_point[0]
        before_y = before_point[1]
        dx = point[0] - before_x
        dy = point[1] - before_y
        for x in range(abs(dx)):
            roi_x = int(before_x + x)
            roi_y = int(before_y + (dy / dx * x))
            line_list.append((roi_x, roi_y))
        before_point = point
    
    return line_list



def hsv_color_range(image: np.ndarray, points: list):
    """
    detect color range (hsv)
    Args:
        image: cv2 image (BGR COLOR)
        points: check pixel points list [(x0, y0), (x1, y1), ...]
    Returns:
        [h_max, s_max, v_max], [h_low, s_low, v_low]
    """
    image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    color_list = []
    for point in points:
        color = image[point[0], point[1]][:3]
        color_list.append(color)
    color_list = np.asarray(color_list)
    max = [color_list[:, 0].max(), 
                color_list[:, 1].max(), 
                color_list[:, 2].max()]
    low = [color_list[:, 0].min(), 
                color_list[:, 1].min(),
                color_list[:, 2].min(),]
    
    return max, low
    


def main():
    import os
    import find
    CURRENT_DIRNAME = os.path.dirname(os.path.abspath(__file__))

    image = cv2.imread(CURRENT_DIRNAME + '/../Tests/sources/katy.jpg')
    gray_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    face_landmarks = find.facemark(gray_img)
    for facemark in face_landmarks:
        hsv_color_range(image, facemark)

if __name__ == '__main__':
    main()
    