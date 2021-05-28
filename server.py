from flask import Flask, request, render_template, session, url_for, redirect
from flask import send_from_directory
from flask_socketio import SocketIO, send, emit, join_room, leave_room

from app import ph, conn, app, socketio
from custom_exceptions import DBConnectionException
from DBHandler import DBHandler


@app.route('/page<int:page_id>')
def page(page_id):
    user = ph._getUsersInformationById(page_id)
    if user is None:
        return render_template('page_doesnt_exist.html')
    else:
        login, name, avatar, time, online = user['login'], user['name'], user['avatar'], user['time'], user['online']
        friend_btn_status = -1 if session['user_id'] == page_id else ph._getFriendStatus(session['user_id'], page_id)
        print(friend_btn_status)
    return render_template('page.html', showMap=True, page_id=page_id, login=login, name=name, 
                            avatar=avatar, time=time, online=online, friend_btn_status=friend_btn_status)


@app.route('/login')
@app.route('/')
def login():
    #if 'user_id' in session and session['user_id'] != -1:
    #    return redirect(url_for('messenger'))
    return render_template('index.html')


@app.route('/options')
def option():
    zones = ph._getZones(session['user_id'])
    return render_template('option.html', zones=zones)


@app.route('/aut', methods=['POST'])
def aut():
    user_login = request.args.get('login')
    user_password = request.args.get('password')
    if user_login and user_password:
        try:
            res = ph._getIdAndPasswordByLogin(user_login)
            if not res:
                print('trieng incorrect')
                return {'status': 'incorrect'}
            id, password = res
        except DBConnectionException:
            print('trieng failed')
            return {'status': 'fail'}

        if user_password != password:
            print('trieng incorrect')
            return {'status': 'incorrect'}
        
        session['user_login'] = user_login
        session['user_id'] = id
        print('trieng was successful')
        return {'status': 'success', 'id': id}
    else:
        print('trieng incorrect')
        return {'status': 'incorrect'}


@app.route('/image/<string:avatar>')
def image(avatar):
    print('another one')
    return send_from_directory('/app/app/static/img/', filename=avatar, as_attachment=True)


@app.route('/messenger')
def messenger():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('messenger.html', user_login=session['user_login'], user_id=session['user_id'], rooms=['room1', 'room2'])


@socketio.on('connect')
def connect():
    name_avatar = ph._getUserNameAndAvatarById(session['user_id'])
    name, avatar = name_avatar['name'], name_avatar['avatar']
    emit('init', {'user_id': session['user_id'], 'user_name': name, 'user_avatar': avatar})


@socketio.on('disconnect')
def connect():
    print(session['user_id'], 'disconnect')
    dialogs_ids = ph._getDialogsIdByUserId(session['user_id'])
    if dialogs_ids is not None:
        for dialog_id in dialogs_ids:
            leave_room(dialog_id)
    print('User has disconnected')


@socketio.on('proto2')
def proto_2(mproto_query):
    print('proto2')
    answer = ph.handle(mproto_query, session['user_id'])
    if answer['code'] >= 150 and answer['code'] < 160: # если ошибка
            emit('err', answer)
            return


@socketio.on('proto10')
def proto_10(mproto_query):
    print('proto10')
    answer = ph.handle(mproto_query, session['user_id'])
    if answer['code'] >= 150 and answer['code'] < 160: # если ошибка
        emit('err', answer)
        return
    emit('proto110', answer) # подтверждение что все хорошо
    name_avatar = ph._getUserNameAndAvatarById(session['user_id'])
    if name_avatar is None:
        name, avatar = 'undefined', ''
    else:
        name, avatar = name_avatar['name'], name_avatar['avatar']
    emit('proto10', {
        'code': 10, 
        'from': session['user_id'], 
        'dialog_id': mproto_query['dialog_id'],
        'msg': mproto_query['msg'],
        'user_name': name,
        'user_avatar': avatar
        }, to=mproto_query['dialog_id'])


@socketio.on('proto11')
def proto_11(mproto_query):
    print('proto11')
    print(mproto_query)
    answer = ph.handle(mproto_query, session['user_id'])
    if answer is not None and answer['code'] >= 150 and answer['code'] < 160: # если ошибка
        emit('err', answer)
        return


@socketio.on('proto20')
def proto_20(mproto_query):
    print('proto 20')
    answer = ph.handle(mproto_query, session['user_id'])
    if answer['code'] >= 150 and answer['code'] < 160: # если ошибка
        emit('err', answer)
        return

    for dialog in answer['dialogs']:
        join_room(dialog['dialog_id'])
    
    emit('proto20', answer)


@socketio.on('proto21')
def proto_21(mproto_query):
    print('proto 21')
    answer = ph.handle(mproto_query, session['user_id'])
    if answer['code'] >= 150 and answer['code'] < 160: # если ошибка
        emit('err', answer)
        return
    emit('proto21', answer)


@socketio.on('proto22')
def proto_22(mproto_query):
    print('proto22')
    answer = ph.handle(mproto_query, session['user_id'])
    print(answer)
    if answer['code'] >= 150 and answer['code'] < 160: # если ошибка
        emit('err', answer)
        return
    emit('proto122', answer)
    

@app.route('/addconstraint', methods=['POST'])
def addconstraint():
    lat = request.args.get('lat')
    long = request.args.get('long')
    rad = request.args.get('rad')
    return "ok" if ph._addConstraint(session['user_id'], lat, long, rad) else "fail"


@app.route('/deleteconstraint', methods=['POST'])
def deleteconstraint():
    c_id = request.args.get('c_id')
    return "ok" if ph._deleteConstraint(session['user_id'], c_id) else "fail"


if __name__ == "__main__":
    conn.connect()
    socketio.run(app, debug=True)

