
class Sender:
    
    def send_110(self):
        return {'code': 110, 'status': 'success'}


    def send_150(self, text):
        msg = f"Ошибка в протоколе: {text}"
        return {
            'code': 150,
            'msg': msg
        }


    def send_151(self, text=''):
        msg = f"Соединение с базой данных потеряно... {text}"
        return {
            'code': 151,
            'msg': msg
        }


    def send_120(self, dialogs):
        return {
            'code': 120,
            'dialogs': dialogs["dialogs"]
        }


    def send_121(self, messages):
        return {
            'code': 121,
            'lastMsgInf': messages["lastMsgInf"],
            'messages': messages["messages"]
        }


    def send_122_now(self, coordinates):
        if coordinates is None:
            return {'code': 122}
        return {
            'code': 122,
            'latitude': coordinates['latitude'],
            'longitude': coordinates['longitude'],
            'time': coordinates['time']
        }

    def send_122_period(self, coordinates):
        if coordinates is None:
            return {'code': 122}
        return {
            'code': 122,
            'coordinates': coordinates
        }