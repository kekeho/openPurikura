# FOR HELEN DATASET
import cv2
import os
import glob

NOW_ABS_FILEPATH = os.path.dirname(os.path.abspath(__file__))
HELEN_IMGS_ABS_FILEPATH = NOW_ABS_FILEPATH + '/helen-dataset/'
HELEN_ANNOTATIONS_ABS_FILEPATH = HELEN_IMGS_ABS_FILEPATH + 'annotations/'
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

    for file_name in helen_annotations_filelist:
        with open(file_name, 'r') as file:
            img_filename = HELEN_IMGS_ABS_FILEPATH + file.readline().replace('\n', '') + \
                '.jpg'  # header is imgfile name
            img_filename

            image_xml = f"""
            <image file='{img_filename}'>
            """

            i = 0
            for line in file:
                x, y = line.replace('\n', '').replace(
                    '\r', '').replace(' ', '').split(',')
                image_xml += f"<box top='{y.split('.')[0]}' left='{x.split('.')[0]}' width='1' height='1'>\n"
                image_xml += f'<label>{i}</label>\n'
                image_xml += '</box>\n'
                i += 1

            image_xml += '</image>\n'

            xml += image_xml

    xml += xml_template_footer
    return xml


def main():
    with open('helen-dataset.xml', 'w') as out_xml_file:
        xml = generate_xml()
        out_xml_file.write(xml)


if __name__ == '__main__':
    main()
