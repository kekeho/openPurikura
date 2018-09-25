import sys
import os
CURRENT_DIRNAME = os.path.dirname(os.path.abspath(__file__))
# set include path to openPurikura directory
sys.path.append(CURRENT_DIRNAME + '/../')

import unittest
import purikura_lib
import cv2
import numpy as np

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


class TestEffects(unittest.TestCase):
    """Test cases for synthesis (like greenback etc)
    """

    def test_chromakey(self):
        """Transpare green pixel test (for chroma key)
        """
        green_img = cv2.imread(CURRENT_DIRNAME + '/sources/greenback.jpg')
        transmitted_img = cv2.imread(
            CURRENT_DIRNAME + '/sources/transparent-img.png', cv2.IMREAD_UNCHANGED)

        green_img = purikura_lib.effects.chromakey(green_img)

        np.testing.assert_array_equal(green_img, transmitted_img)

    def test_marge(self):
        """Marge images test
        """
        paris = cv2.imread(CURRENT_DIRNAME + '/sources/paris.jpg')
        girl = cv2.imread(CURRENT_DIRNAME +
                          '/sources/transparent-img.png', cv2.IMREAD_UNCHANGED)
        marged_img = purikura_lib.effects.merge(paris, girl)
        cv2.imwrite(CURRENT_DIRNAME + '/sources/test-marged.png', marged_img)

        expected_img = cv2.imread(
            CURRENT_DIRNAME + '/sources/girl_in_paris.jpg', cv2.IMREAD_UNCHANGED)
        expected_img = cv2.imread(
            CURRENT_DIRNAME + '/sources/test-marged.png', cv2.IMREAD_UNCHANGED)

        np.testing.assert_array_equal(expected_img, marged_img)

    def test_skin_beautify(self):
        """Skin beautify test
        """
        grandfather = cv2.imread(CURRENT_DIRNAME + '/sources/grandfather.jpg')
        beautified = purikura_lib.effects.skin_beautify(grandfather)

        expected_img = cv2.imread(
            CURRENT_DIRNAME + '/sources/grandfather-beautify.png')
        np.testing.assert_array_equal(expected_img, beautified)


class TestUtils(unittest.TestCase):
    """Test cases for util lib
    """

    def test_add_alpha_channel(self):
        non_alpha_img = cv2.imread(CURRENT_DIRNAME + '/sources/paris.jpg')
        added_alpha_img = purikura_lib.utils.add_alpha_channel(non_alpha_img)

        self.assertEqual(
            non_alpha_img.shape[-1] + 1, added_alpha_img.shape[-1])


if __name__ == '__main__':
    unittest.main()
