from geopy import distance

from DBHandler import DBHandler
from sender import Sender
from custom_exceptions import *

class PH:
    __dbhandler = None
    __sender = None
    __codes = {}


    def __init__(self):
        self.__dbhandler = DBHandler()
        self.__sender = Sender()
        self.__codes = {
            '2': self.handle2,
            '10': self.handle10,
            '11': self.handle_11,
            '20': self.handle20,
            '21': self.handle21,
            '22': self.handle22
        }


    def handle(self, mproto_query, user_id):
        if 'code' not in mproto_query:
            return self.__sender.send_150('Отстуствует поле "code"')

        code = mproto_query["code"]
        if self.__codes.get(f'{code}') is None:
            return self.__sender.send_150(f'Не существует кода {code} в протоколе MProto')
    
        try:
            return self.__codes[f'{code}'](mproto_query, user_id)
        except DBConnectionException:
            return self.__sender.send_151()
            

    def handle2(self, mproto_query, user_id1):
        status = mproto_query['status']
        user_id2 = mproto_query['user_id']

        if   status == 0: self.__dbhandler.addFriendRequest(user_id1, user_id2)
        elif status == 1: self.__dbhandler.deleteFriend(user_id1, user_id2)
        elif status == 2: self.__dbhandler.deleteFriendRequest(user_id1, user_id2)
        elif status == 3: self.__dbhandler.addFriend(user_id2, user_id1)
        


    def handle10(self, mproto_query, user_id):
        self.__dbhandler.insertMessageIntoMessages(user_id, mproto_query['dialog_id'], mproto_query['msg'])
        return self.__sender.send_110()


    def handle_11(self, mproto_query, user_id):
        self.__dbhandler.insertCoordinates(user_id, mproto_query['latitude'], mproto_query['longitude'])


    def handle20(self, mproto_query, user_id_):
        user_id = user_id_
        return self.__sender.send_120(self.__dbhandler.getDialogsByUserId(user_id))


    def handle21(self, mproto_query, user_id_):
        dialog_id = mproto_query['dialog_id']
        return self.__sender.send_121(self.__dbhandler.getMessagesByDialogId(dialog_id))

    
    def handle22(self, mproto_query, user_id):
        page_id = mproto_query['page_id']
        type_ = mproto_query['type']

        need_filter = int(page_id) != user_id    # в случае чего произвести фильтрацию геоданных
        print(f'need_filter = {need_filter}')
        if need_filter:
            filters = self._getZones(page_id)
            print(f'filters={filters}')

        if type_ == 'now':
            point = self.__dbhandler.getCoordinatesNow(page_id)
            if need_filter and not self.__GeoFilterPoint(point, filters): point = None
            return self.__sender.send_122_now(point)
        else:
            points = self.__dbhandler.getCoordinates(page_id, type_)
            if need_filter:
                points =  self.__GeoFilter(points, filters)
            
            return self.__sender.send_122_period(points)


    def _getZones(self, user_id):
        try:
            return self.__dbhandler.getZones(user_id)
        except DBConnectionException:
            return []


    def _deleteConstraint(self, user_id, c_id):
        try:
            self.__dbhandler.deleteConstraint(user_id, c_id)
            return True
        except DBConnectionException:
            return False


    def _addConstraint(self, user_id, lat, long, rad):
        try:
            self.__dbhandler.addConstraint(user_id, lat, long, rad)
            return True
        except DBConnectionException:
            return False


    def _getFriendStatus(self, user_id1, user_id2):
        return self.__dbhandler.getFriendStatus(user_id1, user_id2)


    def _getIdAndPasswordByLogin(self, user_login):
        return self.__dbhandler.getIdAndPasswordByLogin(user_login)


    def _getDialogsIdByUserId(self, user_id):
        return self.__dbhandler.getDialogIdsByUserId(user_id)


    def _getUserNameAndAvatarById(self, user_id):
        res = self.__dbhandler.getUserNameAndAvatarById(user_id)
        if res is None: return None
        return {'name': res[0], 'avatar': res[1]}


    def _getUsersInformationById(self, user_id):
        res = self.__dbhandler.getUserInformationById(user_id)
        if res is None: return None
        return {'login': res[0], 'name': res[1], 'avatar': res[2], 'time': res[3], 'online': res[4]}


    def __GeoFilterPoint(self, point, filters):
        if not filters: return True

        for filter in filters:
            me = (point['latitude'], point['longitude'])
            you = (filter['lat'], filter['long'])
            radius = filter['radius']
            if distance.distance(me, you).m <= radius: return False
            print(distance.distance(me, you).m)

        return True


    def __GeoFilter(self, points, filters):
        return [point for point in points if self.__GeoFilterPoint(point, filters)]
