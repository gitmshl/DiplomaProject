class Painter{

    static init(showMap){
        console.log('Painter Page init');
        Painter.showMap = showMap;
        if (showMap) Painter.createMap();
    }


    static createMap(){
        document.getElementById('MapButtons').style.display = 'block';
        Painter.zoom = 12;
        Painter.mymap = L.map('MapContent').setView([0, 0], Painter.zoom);
        const attribution =
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

        const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        const tiles = L.tileLayer(tileUrl, { attribution });
        tiles.addTo(Painter.mymap);

        Painter.marker = L.marker([0, 0]).addTo(Painter.mymap);
    }


    static showCountOfNewMessages(){
        let count = SST.store['new_messages'];
        if (count == 0){
            document.getElementById("link_to_dialogs").innerHTML = 'My Dialogs';
            return;
        }
        document.getElementById("link_to_dialogs").innerHTML = 'My Dialogs ' + count;
    }

    
    static changeMapMarker(latitude, longitude, time){
        document.getElementById('lat').innerHTML = latitude.toFixed(2);
        document.getElementById('lon').innerHTML = longitude.toFixed(2);
        Painter.mymap.setView([latitude, longitude], Painter.mymap.getZoom());
        Painter.marker.setLatLng([latitude, longitude]);
    }


    static getMapPeriod(){
        return 'now';
    }


    static showMap;
    static mymap;
    static zoom;
    static marker;
}