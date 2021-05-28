class Geo{

    static init(){

        if(!navigator.geolocation) {
            alert('Ваш браузер не поддерживает функции Гео-Локации!!!');
            Painter.GeoDoesntSupportErr();
        } else {
            Geo._interval_send_my_pos = setInterval(Geo.sendLocation, Consts.DEFAULT_LOCATION_SENDING_INTERVAL);
        }
    }

    static GetInit(showMap){
        if (!showMap) return;
        Geo._interval_get_pos = setInterval(Geo.getLocationOnPage, Consts.DEFAULT_GET_LOCATION_ON_PAGE_INTERVAL);
    }


    static getLocationOnPage(){
        let period = Painter.getMapPeriod();
        Sender.send_22(SST.store['page_id'], period);
    }


    static sendLocation(){
        Geo.getLocation();
        console.log('sending get data to the server');
        if (Geo.flag){
            Geo.flag = false;
            Sender.send_11(Geo.mylatitude, Geo.mylongitude);
        }
    }


    static getLocation(){
        if (SST.getId() == 10) { Geo.__getISS(); return; }
        navigator.geolocation.getCurrentPosition(Geo.success, Geo.error);
    }

    
    static success(position){
        console.log('geo success');
        Geo.mylatitude  = position.coords.latitude;
        Geo.mylongitude = position.coords.longitude;
        Geo.flag = true;
    }

    static error(){
        console.log('geo error');
    }


    static stopGettingOnPage(){
        clearInterval(Geo._interval_get_pos);
        Geo._interval_get_pos = -1;
    }

    static async __getISS() {
        const api_url = 'https://api.wheretheiss.at/v1/satellites/25544';
        const response = await fetch(api_url);
        const data = await response.json();
        Geo.mylatitude = data.latitude;
        Geo.mylongitude  = data.longitude;
        console.log(Geo.mylatitude + ' ' + Geo.mylongitude); 
        Geo.flag = true;
      }

    static _interval_send_my_pos = -1;
    static _interval_get_pos = -1;

    static mylatitude = 0;
    static mylongitude = 0;
    static flag = false;
}