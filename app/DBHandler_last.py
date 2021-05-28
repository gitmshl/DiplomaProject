from connector import Connector
from custom_exceptions import DBConnectionException

class DBHandler:

    __connector = None

    def __init__(self):
        self.__connector = Connector()


    def insertCoordinates(self, user_id, latitude, longitude):
        try:
            print('insertCoordinates 1')
            conn = self.__connector.getConnection()
            print('insertCoordinates 2')
            with conn.cursor() as cursor:
                cursor.execute(f'insert into coordinates (user_id, latitude, longitude) values ({user_id}, {latitude}, {longitude});')
                print('insertCoordinates 3')
                self.__connector.commit()
        except Exception as e:
            print('insertCoordinates err 1')
            print(e)
            raise DBConnectionException


    def insertMessageIntoMessages(self, user_id, dialog_id, msg, picture=''):
        try:
            conn = self.__connector.getConnection()
            with conn.cursor() as cursor:
                cursor.execute(f'insert into messages (dialog_id, user_id, msg, picture, status) values ({dialog_id}, {user_id}, \'{msg}\', \'{picture}\', True);')
                self.__connector.commit()
        except Exception:
            raise DBConnectionException


    def getDialogIdsByUserId(self, user_id):
        print('getDialogIds')
        try:
            conn = self.__connector.getConnection()
            with conn.cursor() as cursor:
                cursor.execute(f'select dialog_id from dialogs_info where user_id = {user_id};')
                dialogs_ids = []
                res = cursor.fetchall()

                if res is not None:
                    for dialog_id in res:
                        dialogs_ids.append(dialog_id[0])
                
                return dialogs_ids

        except Exception as e:
            print(e)
            raise DBConnectionException
        
    

    def getIdAndPasswordByLogin(self, user_login):
        try:
            conn = self.__connector.getConnection()
            with conn.cursor() as cursor:
                cursor.execute(f'select user_id, password from users where login = \'{user_login}\'')
                res = cursor.fetchone()
                return res

        except Exception as e:
            print(e)
            raise DBConnectionException
        

    # Возвращает список сообщений в диалоге

    '''
        {
            lastMsgInf: {
                'id': ,
                'from': ,
                'msg': ,
                'time': ,
                'status': 
            }
            messages: [
                    {
                        id:
                        user_id:
                        msg: 
                        picture:
                        time:
                        status:
                        from_user_login:
                        from_user_name:
                        from_user_avatar:
                    }, ....
            ]
        }
        
    '''

    def getMessagesByDialogId(self, dialog_id):
        try:
            conn = self.__connector.getConnection()
            with conn.cursor() as cursor:
                #cursor.execute(f'select id, user_id, msg, picture, time, status from messages where dialog_id = {dialog_id}')
                cursor.execute(f'select m.*, u.login, u.name, u.avatar from messages m, users u where m.user_id = u.user_id and m.dialog_id = {dialog_id} order by m.time')
                
                messages = []
                msgs = cursor.fetchall()
                for msg in msgs:
                    message = {
                        'id': msg[0],
                        'user_id': msg[2],
                        'msg': msg[3],
                        'picture': msg[4],
                        'time': msg[5].isoformat(),
                        'status': msg[6],
                        'from_user_login': msg[7],
                        'from_user_name': msg[8],
                        'from_user_avatar': msg[9]
                    }
                    messages.append(message)
                
                lastMsgInf = self.getLastMsgInDialog(dialog_id)

                result = {
                    'messages': messages,
                    'lastMsgInf': lastMsgInf
                }

                return result
                
        except Exception as e:
            print(e)
            raise DBConnectionException
        
        
    # Возвращает информацию о диалогах, в которых состоит пользователь user_id
    def getDialogsByUserId(self, user_id):
        try:
            conn = self.__connector.getConnection()
            with conn.cursor() as cursor:
                cursor.execute(f'SELECT dialog_id from dialogs_info where user_id={user_id}')

                dialogs = []
                for dialog_id in cursor.fetchall():
                    dialogs.append(dialog_id[0])
                result = {'dialogs': []}
                


                for dialog in dialogs:
                    result["dialogs"].append(self.getDialogInformation(dialog, user_id))


            return result

        except Exception as e:
            print(e)
            raise DBConnectionException

        


    # Возвращает информацию про диалог по его id. Если такого диалога нету, то возвращается None
    '''
        {
            dialog_id:
            dialog_name:
            avatar: 
            lastMsg = {
                'id': ,
                'from': ,
                'msg': ,
                'time': ,
                'status': 
            }
        }
    '''
    def getDialogInformation(self, dialog_id, user_id):
        try:

            conn = self.__connector.getConnection()
            with conn.cursor() as cursor:
                cursor.execute(f'SELECT type, avatar from dialogs where dialog_id={dialog_id}')
                dialog = cursor.fetchone()       
    
                if dialog is None: return None
                dialog_res = self.getDialogNameAndAvatar(dialog_id, user_id)

                if dialog_res is None:
                    print('ИМЯ ДИАЛОГА NONE. ЭТО ОЧЕНЬ СТРАННО!!!!')
                    dialog_name = 'undefined'
                    dialog_avatar = ''
                else:
                    dialog_name, dialog_avatar = dialog_res
                
                cursor.execute(f'select id, user_id, msg, time, status from messages where dialog_id = {dialog_id} order by time desc limit 1;')
                lstmsg = cursor.fetchone()


        except Exception as e:
            print(e)
            raise DBConnectionException

        
        if lstmsg is None:
            lastMsg = {}
        else:
            lastMsg = {
                'id': lstmsg[0],
                'from': lstmsg[1],
                'msg': lstmsg[2],
                'time': lstmsg[3].isoformat(),
                'status':lstmsg[4] 
            }

        result = {
            'dialog_id': dialog_id,
            'dialog_name': dialog_name,
            'type': dialog[0],
            'avatar': dialog_avatar,
            'lastMsg': lastMsg
            }

        return result


    def getDialogNameAndAvatar(self, dialog_id, user_id):
        try:
            conn = self.__connector.getConnection()
            with conn.cursor() as cursor:
                cursor.execute(f'SELECT type, dialog_name, avatar from dialogs where dialog_id={dialog_id}')

                res = cursor.fetchone()
                if res is None: return None
                dialog_type, dialog_name, dialog_avatar = res[0], res[1], res[2]
                if dialog_type == 'dialog': return (dialog_name, dialog_avatar)

                cursor.execute(f'select user_id from dialogs_info where dialog_id = {dialog_id} and user_id != {user_id}')
                another_user = cursor.fetchone()
                if another_user is None: return None
                another_user_id = another_user[0]
                return (self.getUserNameById(another_user_id), self.getUserAvatarById(another_user_id))

        except Exception as e:
            print(e)
            raise DBConnectionException


    def getUserNameAndAvatarById(self, user_id):
        try:
            conn = self.__connector.getConnection()
            with conn.cursor() as cursor:
                cursor.execute(f'SELECT name, avatar from users where user_id={user_id}')
                res = cursor.fetchone()
                if res is None: None
                return res[0], res[1]
        except Exception as e:
            print(e)
            raise DBConnectionException


    # Возвращает login, name, avatar, time, online по user_id
    def getUserInformationById(self, user_id):
        try:
            conn = self.__connector.getConnection()
            with conn.cursor() as cursor:
                cursor.execute(f'SELECT login, name, avatar, last_visit_time, online from users where user_id={user_id}')
                res = cursor.fetchone()
                if res is None: None
                return res

        except Exception as e:
            print(e)
            raise DBConnectionException


    def getUserAvatarById(self, user_id):
        try:
            conn = self.__connector.getConnection()
            with conn.cursor() as cursor:
                cursor.execute(f'SELECT avatar from users where user_id={user_id}')
                res = cursor.fetchone()
                if res is None: return ''
                return res[0]

        except Exception as e:
            print(e)
            raise DBConnectionException


    def getUserNameById(self, user_id):
        try:
            conn = self.__connector.getConnection()
            with conn.cursor() as cursor:
                cursor.execute(f'SELECT name from users where user_id={user_id}')
                res = cursor.fetchone()
                if res is None: return None
                return res[0]

        except Exception as e:
            print(e)
            raise DBConnectionException


    def getLastMsgInDialog(self, dialog_id):
        try:
            conn = self.__connector.getConnection()
            with conn.cursor() as cursor:
                cursor.execute(f'select id, user_id, msg, time, status from messages where dialog_id = {dialog_id} order by time desc limit 1;')
                lstmsg = cursor.fetchone()
                if lstmsg is None: return {}
                else:
                    lstmsg = {
                    'id': lstmsg[0],
                    'from': lstmsg[1],
                    'msg': lstmsg[2],
                    'time': lstmsg[3].isoformat(),
                    'status':lstmsg[4] 
                    }
                    return lstmsg

        except Exception as e:
            print(e)
            raise DBConnectionException


    def getCoordinatesNow(self, user_id):
        try:
            print('getCoordinatesNow 1')
            conn = self.__connector.getConnection()
            with conn.cursor() as cursor:
                print('getCoordinatesNow 2')
                cursor.execute(f'select latitude, longitude, time from coordinates where user_id = {user_id} order by time desc limit 1;')
                print('getCoordinatesNow 3')
                res = cursor.fetchone()
                print('getCoordinatesNow 4')
                if res is None: return None
                print('getCoordinatesNow 5')
                return {'latitude': res[0], 'longitude': res[1], 'time': res[2].isoformat()}

        except Exception as e:
            print('getCoordinatesNow err 1')
            print(e)
            raise DBConnectionException

    
    def getCoordinates(self, user_id, type_):
        try:
            conn = self.__connector.getConnection()
            with conn.cursor() as cursor:
                cursor.execute(f'select latitude, longitude, time from coordinates where now() - time <= interval \'1 {type_} \' and user_id = {user_id} order by time;')
                results = cursor.fetchall()
                if results is None: return None
                return [{'latitude': res[0], 'longitude': res[1], 'time': res[2].isoformat()} for res in results]

        except Exception as e:
            print(e)
            raise DBConnectionException