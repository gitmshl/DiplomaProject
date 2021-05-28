#! /usr/bin/bash

psql -d gmessengerdb -c "create sequence users_id_seq start 1"

psql -d gmessengerdb -c "create sequence dialogs_id_seq start 1"

psql -d gmessengerdb -c "create sequence messages_id_seq start 1"

psql -d gmessengerdb -c "create sequence cconstraints_id_seq start 1"

psql -d gmessengerdb -c "create table users (
        user_id integer not null default nextval('users_id_seq'),
        login varchar(60) not null,
        password varchar(100) not null,
        name varchar(60) not null,
        avatar varchar(60),
        last_visit_time timestamp default CURRENT_TIMESTAMP,
        online boolean,
        constraint user_pk primary key (user_id)
    )"

psql -d gmessengerdb -c "create table dialogs (
        dialog_id integer not null default nextval('dialogs_id_seq'),
        dialog_name varchar(60),
        type varchar(20),
        avatar varchar(60),
        constraint dialogs_pk_pk primary key (dialog_id)
    )"

psql -d gmessengerdb -c "create table dialogs_info (
        dialog_id integer references dialogs (dialog_id),
        user_id integer references users (user_id),
        constraint dialogs_info_pk primary key (dialog_id, user_id)
    )"

psql -d gmessengerdb -c "create table messages (
        id integer not null default nextval('messages_id_seq'),
        dialog_id integer references dialogs(dialog_id),
        user_id integer references users(user_id),
        msg varchar(1000),
        picture varchar(60),
        time timestamp default CURRENT_TIMESTAMP,
        status boolean,
        constraint messages_pk primary key (id)
    )"

psql -d gmessengerdb -c "create table coordinates (
        user_id integer references users (user_id),
        latitude float not null,
        longitude float not null,
        time timestamp default CURRENT_TIMESTAMP
    )"


psql -d gmessengerdb -c "create table cconstraints (
        c_id integer not null default nextval('cconstraints_id_seq'),
        user_id integer references users (user_id),
        latitude float not null,
        longitude float not null,
        radius float not null,
        constraint cconstraints_pk primary key (c_id)
    )"


psql -d gmessengerdb -c "create table friends (
        user_id1 integer references users (user_id),
        user_id2 integer references users (user_id),
        status boolean,
        constraint friends_pk primary key (user_id1, user_id2)
    )"

