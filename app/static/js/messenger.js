
$(document).ready( () => {

    let current_room = -1;
    var sio = io.connect(location.protocol + '//' + document.domain + ':' + location.port, {'forceNew': false});
    
    sio.on('err', err => {
        alert('Возникла ошибка на сервере!');
        document.cookie = "user_id=; expires = " + new Date().toUTCString() + ";";
        document.cookie = "session=; expires = " + new Date().toUTCString() + ";";
        location.href = '/login1';
    });


    sio.on('init', (data) => {
        SST.init();
        SST.setUserId(data.user_id);
        SST.setUserName(data.user_name)
        SST.setUserAvatar(data.user_avatar)
        Painter.init();
        Painter.startLoadAnimation();
        Timer.init();
        Sender.setSio(sio);
        UC.req_20();
        Geo.init();
    });

    sio.on('disconnect', () => {
        document.cookie = "user_id=; expires = " + new Date().toUTCString() + ";";
        document.cookie = "session=; expires = " + new Date().toUTCString() + ";";
        location.href = '/login';
    });
    

    sio.on('proto10', data => {
        console.log('proto10');
        PH.handle(data);
        Painter.stopLoadAnimation();
    });

    sio.on('proto110', data => {
        console.log('proto110');
        PH.handle(data);
    }); 

    sio.on('proto20', data => {
        console.log('proto20');
        PH.handle(data);
        Painter.stopLoadAnimation();
    });

    sio.on('proto21', data => {
        console.log('proto21');
        PH.handle(data);
        Painter.stopLoadAnimation();
    });


})
