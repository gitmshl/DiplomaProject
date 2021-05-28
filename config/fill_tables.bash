#! /usr/bin/bash

psql -d gmessengerdb -c "insert into users (login, password, name, avatar, online) values 
('logmusa', '345ferma', 'musa', 'rain.jpeg', TRUE),
('log1', '345ferma', 'name1', 'ironman.jpeg', FALSE),
('log2', '345ferma', 'name2', 'rain.jpeg', TRUE),
('log3', '345ferma', 'name3', 'ironman.jpeg', TRUE),
('log4', '345ferma', 'name4', 'rain.jpeg', FALSE),
('log5', '345ferma', 'name5', 'ironman.jpeg', TRUE),
('log6', '345ferma', 'name6', 'rain.jpeg', FALSE),
('log7', '345ferma', 'name7', 'ironman.jpeg', TRUE),
('log8', '345ferma', 'name8', 'rain.jpeg', FALSE)
"


psql -d gmessengerdb -c "insert into dialogs (dialog_id, dialog_name, type, avatar) values 
(1, '', 'p2p', ''),
(2, 'our_dialog_2', 'dialog', 'spider.jpeg'),
(3, 'super_dialog_3' ,'dialog', 'spider.jpeg'),
(4, '', 'p2p', ''),
(5, 'beseda_5' ,'dialog', 'spider.jpeg'),
(6, '', 'p2p', '')
"


psql -d gmessengerdb -c "insert into dialogs_info (dialog_id, user_id) values 
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(2, 3),
(3, 3),
(3, 4),
(3, 5),
(4, 6),
(4, 7),
(5, 8),
(5, 9),
(5, 3),
(6, 6),
(6, 9)
"

psql -d gmessengerdb -c "insert into messages (dialog_id, user_id, msg, picture, status) values 
(1, 1, 'it is from me', '', TRUE),
(1, 2, 'this message', '', FALSE),
(2, 3, 'this message', '', FALSE),
(3, 3, 'good, broo', '', FALSE),
(4, 6, 'i want to do something', '', TRUE),
(5, 3, 'how does it work?', '', TRUE),
(6, 9, 'let a = 2;', '', FALSE)
"