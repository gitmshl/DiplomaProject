
window.onload = () => {
    
    /// set Profile Image
    let src = document.getElementById('profile_image_name').innerHTML;
    document.getElementsByClassName('profile_image')[0].src = Consts.IMAGE_LOADER_URL + src;

    let tmpMap = document.getElementById('showMap');
    let showMap = tmpMap == null ? false : tmpMap.innerHTML == 1;
    
    var sio = io.connect(location.protocol + '//' + document.domain + ':' + location.port, {'forceNew': false});

    sio.on('init', (data) => {
        SST.init();
        SST.setUserId(data.user_id);
        SST.setUserName(data.user_name)
        SST.setUserAvatar(data.user_avatar)

        SST.store['page_id'] = document.getElementById('span_page_id').innerHTML;
        SST.store['new_messages'] = 0;
        
        Painter.init(showMap);
        Timer.init();
        Sender.setSio(sio);
        Sender.send_20(); /// чтобы добавили в комнаты диалогов
        Geo.init();
        Geo.GetInit(showMap);
    });


    sio.on('err', err => {
        alert('Возникла ошибка на сервере!');
        document.cookie = "user_id=; expires = " + new Date().toUTCString() + ";";
        document.cookie = "session=; expires = " + new Date().toUTCString() + ";";
        location.href = '/login1';
    });

    sio.on('disconnect', () => {
        document.cookie = "user_id=; expires = " + new Date().toUTCString() + ";";
        document.cookie = "session=; expires = " + new Date().toUTCString() + ";";
        location.href = '/login';
    });

    sio.on('proto10', data => {
        console.log('proto10 Page');
        PH.handle(data);
    });

    sio.on('proto122', data => {
        console.log('proto122');
        console.log(data);
        PH.handle(data);
    });



}