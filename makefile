
dbstatus:
	systemctl status postgresql

dbstop: 
	systemctl stop postgresql

dbstart: 
	systemctl start postgresql

db:
	psql -U musa -d gmessengerdb

install_packages:
	pip install -r requirements.txt


refresh_db:
	./config/drop_tables.sh
	./config/create_tables.bash


fill_db:
	./config/fill_tables.bash

heroku_db:
	heroku pg:psql

start:
	gunicorn --worker-class eventlet -w 1 server:app
	
