import sys, os
CURRENT_DIRNAME = os.path.dirname(os.path.abspath(__file__))
# set include path to openPurikura directory
sys.path.append(CURRENT_DIRNAME + '/../')

import unittest
import purikura_lib
import cv2

CURRENT_DIRNAME = os.path.dirname(os.path.abspath(__file__))

class TestFaceRecognition(unittest.TestCase):
    """test class for face recognition
    """

    def test_single_face(self):
        """test method for recognition facemark (194 points) with mona-lisa
        """
        expected_num_of_people = 1
        expected_points_len = 194

        # test with mona-lisa face :D
        mona_lisa = cv2.imread(CURRENT_DIRNAME + '/sources/Mona_Lisa.jpg')
        gray_mona_lisa = cv2.cvtColor(mona_lisa, cv2.COLOR_BGR2GRAY)

        landmarks = purikura_lib.find.facemark(gray_mona_lisa)

        # in the mona-lisa, there is one person, 194 points.
        self.assertEqual(expected_num_of_people, len(landmarks))
        self.assertEqual(expected_points_len, len(landmarks[0]))

    
    def test_three_faces(self):
        """test method for three faces recognition (194 points) with three-man.jpg (cc0)
        """
        expected_num_of_people = 3
        expected_points_len = 194

        # test with mona-lisa face :D
        three_man_img = cv2.imread(CURRENT_DIRNAME + '/sources/three-man.jpg')
        gray_three_man_img = cv2.cvtColor(three_man_img, cv2.COLOR_BGR2GRAY)

        landmarks = purikura_lib.find.facemark(gray_three_man_img)

        # in the mona-lisa, there is one person, 194 points.
        self.assertEqual(expected_num_of_people, len(landmarks))
        self.assertEqual(expected_points_len, len(landmarks[0]))
        self.assertEqual(expected_points_len, len(landmarks[1]))
        self.assertEqual(expected_points_len, len(landmarks[2]))


if __name__ == '__main__':
    unittest.main()