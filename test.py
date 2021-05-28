import sys
sys.path.insert(1, './app')

from PH import PH
from connector import Connector


Connector().connect()
PH().handle({'code': 21, 'dialog_id': 4})