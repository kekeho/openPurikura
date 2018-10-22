"""Create openPurikura.db
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
import os

CURRENT_DIRNAME = os.path.dirname(os.path.abspath(__file__))
database_file = CURRENT_DIRNAME + '/openPurikura.db'
engine = create_engine('sqlite:///' + database_file,
                       convert_unicode=True, echo=True)


Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)

    def __repr__(self):
        return '<User(id=\'{}\', name=\'{}\', email=\'{}\')>'.format(self.id, self.name, self.email)


class CurId(Base):
    __tablename__ = 'curid'

    id = Column(Integer, primary_key=True)

    def __repr__(self):
        return '<User(id=\'{}\')>'.format(self.id)


def init():
    Base.metadata.create_all(engine)


if __name__ == '__main__':
    init()
