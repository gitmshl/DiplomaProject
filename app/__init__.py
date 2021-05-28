from flask import Flask, request, render_template, session, url_for, redirect
from flask_socketio import SocketIO, send, emit, join_room, leave_room
import sys

sys.path.append('./app')

from PH import PH
from connector import Connector
from custom_exceptions import DBConnectionException


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app,  cors_allowed_origins='*')

ph = PH()
conn = Connector()
conn.connect()

