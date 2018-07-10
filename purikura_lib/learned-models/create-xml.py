# FOR HELEN DATASET
import cv2
import os
import glob
import numpy as np
import matplotlib.pyplot as plt

NOW_ABS_FILEPATH = os.path.dirname(os.path.abspath(__file__))
HELEN_IMGS_ABS_FILEPATH = NOW_ABS_FILEPATH + '/helen-dataset/'
HELEN_ANNOTATIONS_ABS_FILEPATH = HELEN_IMGS_ABS_FILEPATH + 'annotations/'
helen_annotations_filelist = glob.glob(HELEN_ANNOTATIONS_ABS_FILEPATH + '*')

xml_template_header = """
<?xml version='1.0' encoding='ISO-8859-1'?>
<?xml-stylesheet type='text/xsl' href='image_metadata_stylesheet.xsl'?>
<dataset>
<name>imglab dataset</name>
<comment>Created by imglab tool.</comment>
<images>
"""

xml_template_footer = """
</images>
</dataset>
"""


def generate_xml(img_filename: str):
    for file_name in helen_annotations_filelist:
        with open(file_name, 'r') as file:
            img_filename = HELEN_IMGS_ABS_FILEPATH + file.readline().replace('\n', '') + '.jpg'  # header is imgfile name
            img_filename
            points_array = []
            image_xml = f"""
            <image file='{img_filename}'>
            """
            for line in file:
                x, y = line.replace('\n', '').replace(' ', '').split(',')
                plt.plot(x, y)
                return 
                image_xml += "<box top>"




def main():
    generate_xml('hoge')


if __name__ == '__main__':
    main()
