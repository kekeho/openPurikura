import numpy as np


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