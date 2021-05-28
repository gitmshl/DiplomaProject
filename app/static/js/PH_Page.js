class PH{

    static handle(obj){
        let code = obj.code;
        switch (code) {
            case 10: this.handle10(obj); break;
            case 122: this.handle122(obj); break;
            default:
                console.log(obj)
                alert('Пришел запрос с неизвестным кодом!!!');
        }
    }

    static handle10(mproto_query){
        if (SST.getId() == mproto_query.from) return;
        SST.store['new_messages'] += 1;
        Painter.showCountOfNewMessages();
    }

    static handle122(mproto_query){
        if ('latitude' in mproto_query){
            let latitude = mproto_query.latitude;
            let longitude = mproto_query.longitude;
            let time = mproto_query.time;
            Painter.changeMapMarker(latitude, longitude, time);
        }
        else{
            alert('Данных нету!');
            Geo.stopGettingOnPage();
        }
    }

}