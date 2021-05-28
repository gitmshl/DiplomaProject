#! /usr/bin/bash

psql -d gmessengerdb -c "drop table cconstraints"

psql -d gmessengerdb -c "drop table friends"

psql -d gmessengerdb -c "drop table coordinates"

psql -d gmessengerdb -c "drop table messages"

psql -d gmessengerdb -c "drop table dialogs_info"

psql -d gmessengerdb -c "drop table dialogs"

psql -d gmessengerdb -c "drop table users"


psql -d gmessengerdb -c "drop sequence users_id_seq"
psql -d gmessengerdb -c "drop sequence dialogs_id_seq"
psql -d gmessengerdb -c "drop sequence messages_id_seq"
psql -d gmessengerdb -c "drop sequence cconstraints_id_seq"
