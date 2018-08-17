import numpy as np

def add_alpha_channel(image: np.ndarray):
    image = image.tolist()
    for line_count, line in enumerate(image):
        for row_count, pixel in enumerate(line):
            image[line_count][row_count].append(255)

    return np.array(image, dtype='uint8')