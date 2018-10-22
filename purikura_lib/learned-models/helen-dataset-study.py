import dlib
import os
import sys
import multiprocessing
import cv2
import glob

NOW_ABS_FILEPATH = os.path.dirname(os.path.abspath(__file__))
HELEN_IMGS_ABS_FILEPATH = NOW_ABS_FILEPATH + '/helen-dataset/'
HELEN_ANNOTATIONS_ABS_FILEPATH = HELEN_IMGS_ABS_FILEPATH + 'annotations/'
CASCADE_PATH = os.path.dirname(os.path.abspath(__file__)) + "/../haarcascades/"

face_cascade = cv2.CascadeClassifier(
    CASCADE_PATH + 'haarcascade_frontalface_default.xml')
helen_annotations_filelist = glob.glob(HELEN_ANNOTATIONS_ABS_FILEPATH + '*')

xml_template_header = """<?xml version='1.0' encoding='ISO-8859-1'?>
<?xml-stylesheet type='text/xsl' href='image_metadata_stylesheet.xsl'?>
<dataset>
<name>imglab dataset</name>
<comment>Created by imglab tool.</comment>
<images>
"""

xml_template_footer = """</images>
</dataset>
"""

def generate_xml():
    xml = xml_template_header

    count = 0
    for file_name in helen_annotations_filelist:
        with open(file_name, 'r') as file:
            # count += 1
            # if count == 10:
            #     break

            img_filename = HELEN_IMGS_ABS_FILEPATH + file.readline().replace('\n', '') + \
                '.jpg'  # header is imgfile name

            image_xml = f"""
            <image file='{img_filename}'>
            """

            gray_image = cv2.imread(img_filename, cv2.IMREAD_GRAYSCALE)

            image_xml += f"<box top='{0}' left='{0}' width='{gray_image.shape[0]}' height='{gray_image.shape[1]}'>\n"

            i = 0
            for line in file:
                x, y = line.replace('\n', '').replace(
                    '\r', '').replace(' ', '').split(',')
                image_xml += f"<part name='{i}' y='{y.split('.')[0]}' x='{x.split('.')[0]}' />\n"
                i += 1
            image_xml += '</box>\n'
            image_xml += '</image>\n'

            xml += image_xml

    xml += xml_template_footer
    return xml


def face_position(gray_img):
    """Detect faces position
    Return:
        faces: faces position list (x, y, w, h)
    """
    faces = face_cascade.detectMultiScale(gray_img, minSize=(
        int(len(gray_img[0]) / 6), int(len(gray_img) / 6)))
    return faces


def main():

    # generate xml file
    with open('helen-dataset.xml', 'w') as out_xml_file:
        xml = generate_xml()
        out_xml_file.write(xml)

    # set options
    options = dlib.shape_predictor_training_options()
    options.num_threads = multiprocessing.cpu_count()  # cpu threads
    options.be_verbose = True

    train_xml_filename = './helen-dataset.xml'

    print("Start training")
    dlib.train_shape_predictor(
        train_xml_filename, "helen-dataset.dat", options)
    print("Finish")


if __name__ == '__main__':
    main()
