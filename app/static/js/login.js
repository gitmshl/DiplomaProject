$(document).ready(function(){

    function startLoadAnimation(){
        document.getElementById('floatingCirclesG').style.display = 'block';
    }

    function stopLoadAnimation(){
        document.getElementById('floatingCirclesG').style.display = 'none';
    }

    function wrongLoginOrPassword(){
        var login = $("#login");
        var password = $("#password");
        login.css({"backgroundColor": "#57273d"});
        password.css("backgroundColor", "#57273d");
        setTimeout(function(){
            var login = $("#login");
            var password = $("#password");
            login.css({"background": "none"});
            password.css("background", "none");
        }, 1000);
    }
    
    function dbErr() {
        console.log("Ошибка в БД");
    }
    
    function check(){
        var login = $("#login").val();
        var password = $("#password").val();
        if (login.length < Consts.MIN_LOGIN_LENGTH || password.length < Consts.MIN_PASSWORD_LENGTH) return false;
        return true;
    }
    
    function submit(){
        if (!check())
        {
            alert('Введите логин и пароль');
            return;
        }
        var login = $("#login").val();
        var password = $("#password").val();
        $.ajax({
            url: '/aut?login='+login+'&password='+password,
            type: 'POST',
            success: function (response) {
                stopLoadAnimation();
                status = response['status']
                if (status == 'incorrect'){
                    wrongLoginOrPassword();
                    return;
                }
                if (status == 'fail'){
                    dbErr();
                    return;
                }
                if (status == 'success'){
                    user_id = response['id'];
                    Consts.setCookie('user_id', user_id, 7);
                    location.href = "/messenger";
                    return;
                }
            }
        });

        startLoadAnimation();

    }
    
    $("#submit").click(function(){
        submit();
        });
    });