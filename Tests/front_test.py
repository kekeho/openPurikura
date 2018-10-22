import sys
import os
CURRENT_DIRNAME = os.path.dirname(os.path.abspath(__file__))
# set include path to openPurikura directory
sys.path.append(CURRENT_DIRNAME + '/../')

from selenium import webdriver
import openPurikura
import unittest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.init_db import Base, User

database_file = CURRENT_DIRNAME + '/../database/openPurikura.db'
db_engine = create_engine('sqlite:///' + database_file,
                          convert_unicode=True, echo=True)
Base.metadata.bind = db_engine
db_session = sessionmaker(bind=db_engine)

# Selenium driver
driver = webdriver.Firefox()

class TestRegistration(unittest.TestCase):
    """test class for registration
    """

    def test_registration_name_email(self):
        """test method for register name and email address
        """
        driver.get('http://localhost:5000/register')
        name_form = driver.find_element_by_id('register-name')
        email_form = driver.find_element_by_id('register-email')

        expected_name = 'TEST_USER'
        expected_email = 'test_user@example.com'

        name_form.send_keys(expected_name)
        email_form.send_keys(expected_email)

        submit_button = driver.find_element_by_id('submit-button')
        submit_button.click()

        session = db_session()
        result = session.query(User).order_by(User.id.desc()).all()[0]
        self.assertEqual(result.name, expected_name)
        self.assertEqual(result.email, expected_email)


def main():
    unittest.main()

if __name__ == '__main__':
    main()


        

        
