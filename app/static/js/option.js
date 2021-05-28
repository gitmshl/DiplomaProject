$(document).ready(function(){

    var sio = io.connect(location.protocol + '//' + document.domain + ':' + location.port, {'forceNew': false});

    sio.on('init', (data) => {
        SST.init();
        SST.setUserId(data.user_id);
        SST.setUserName(data.user_name);
        SST.setUserAvatar(data.user_avatar);
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

    function check(lat, long, rad){
        
        if (lat.length == 0 || long.length == 0 || rad.length == 0){
            alert('Заполните все поля!');
            return false;
        }
        
        lat = parseFloat(lat);
        long = parseFloat(long);
        rad = parseFloat(rad);
          
        if (Number.isNaN(lat) || lat < -90 || lat > 90){
            alert('Широта должна быть числом от -90° до 90°!');
            return false;
        }

        if (Number.isNaN(long) || long < -180 || long > 180){
            alert('Долгота должна быть числом от -180° до 180°!');
            return false;
        }

        if (Number.isNaN(rad) || rad <= 0){
            alert('Радиус слепой зоны должен быть положительным числом!');
            return false;
        }

        return true;
    }
    
    function submit(){
        var lat = $("#lat").val();
        var long = $("#long").val();
        var rad = $("#radius").val();

        if (!check(lat, long, rad)) return;

        $.ajax({
            url: '/addconstraint?lat='+lat+'&long='+long+'&rad='+rad,
            type: 'POST',
            success: function (response) {
                if (response == "ok"){
                    location.href = '/options';
                }
                else{
                    alert('Возникла ошибка на сервере!');
                    return false;
                }
            }
        });

    }
    
    $("#ok").click(function(){
        submit();
        return false;
        });

        
    });