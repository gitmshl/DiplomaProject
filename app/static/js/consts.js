class Consts{

    static IMAGE_LOADER_URL = 'https://geomessengermshl.herokuapp.com/image/';

    static MIN_LOGIN_LENGTH = 1;
    static MIN_PASSWORD_LENGTH = 1;

    static DIALOG_LIST_ID = -1;

    static TIMER_10_TIME = 10000;
    static TIMER_20_TIME = 10000;
    static TIMER_21_TIME = 10000;

    static MAX_TIMER_10_COUNT = 1;
    static MAX_TIMER_20_COUNT = 1;
    static MAX_TIMER_21_COUNT = 1;


    static DEFAULT_LOCATION_SENDING_INTERVAL = 5333;
    static DEFAULT_GET_LOCATION_ON_PAGE_INTERVAL = 6000;


    static setCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

}