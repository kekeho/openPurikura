import numpy as np

def add_alpha_channel(image: np.ndarray):
    image = image.tolist()
    for line_count, line in enumerate(image):
        for row_count, pixel in enumerate(line):
            image[line_count][row_count].append(255)

    return np.array(image, dtype='uint8')


def detect_roi(points: list):
    xlist = []
    ylist = []
    e = 20
    for x, y in points:
        xlist.append(x)
        ylist.append(y)
    return min(xlist)-e, min(ylist)-e, max(xlist)+e, max(ylist)+e
