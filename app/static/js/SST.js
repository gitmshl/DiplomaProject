class SST{

    static init(){
        console.log("SST.init()");
        this.Flags[10] = false;
        this.Flags[20] = false;
        this.Flags[21] = false;
        this.handshake = false;
        this.current_dialog = Consts.DIALOG_LIST_ID;
    }


    /**
     * Фиксирует отправку клиентского запроса (например, запроса 10).
     * @param code - код протокола. Т.к. это клиентский протокол, то
     *                                                      code < 100
     */
     static setRequest(code){
        console.log("fixSendingRequest(code = " + code + " )");
        this.Flags[code] = true;
    }


    /**
     * Проверяет, ожидается ли запрос code (ожидание запроса происходит при
     * отправке клиентского запроса на сервер).
     * @param code - т.к. это код ожидания от сервера, то code >= 100
     */
     static checkWaitingForResponse(code){
        return this.Flags[code - 100];
    }


     /**
     * Фиксирует приход ответа от сервера.
     * @param code - код ответа от сервера, значит, code > 100
     */
      static setResponse(code){
        code -= 100;
        this.Flags[code] = false;
    }


    /**
     * Устанавливает рупожожатие
     * @param flag - на него и устаналивается handshake
     */
     static setHandshake(flag = true){
        console.log("SST.setHandshake");
        this.handshake = flag;
    }


    static checkHandshake(){
        return this.handshake;
    }


    static setCurrentDialog(dialog_id){
        SST.current_dialog = dialog_id;
        if (dialog_id == -1) return;
        let dialog_block = document.getElementById(dialog_id);
        let dialog_name = dialog_block.getElementsByClassName("sub1")[0].textContent;
        let dialog_img = dialog_block.getElementsByClassName("avatar_block")[0].getElementsByTagName("img")[0].src;
        SST.DialogInformation.name = dialog_name;
        SST.DialogInformation.img = dialog_img;
    }


    static setCurrentDialogIsDialogList(){
        SST.current_dialog = Consts.DIALOG_LIST_ID;
    }


    static getCurrentDialog(){
        return this.current_dialog;
    }


    static setUserId(user_id){
        this.user_id = user_id;
    }


    static setUserName(user_name){
        this.user_name = user_name;
    }

    static setUserAvatar(user_avatar){
        this.user_avatar = user_avatar;
    }

    static getId(){
        return this.user_id;
    }

    static getName(){
        return this.user_name;
    }

    static getAvatar(){
        return this.user_avatar;
    }


    /**
     * Возвращает код запроса ( < 100), который ожидается. Если ничего не ожидается, возвращается -1
     */
     static getWaitingResponse(){
        SST.Flags.forEach(function(flag, id){
            if (flag) return id;
        });
        return -1;
    }


    static DialogInformation = {
        name: "",
        img: ""
    }


    static Flags = [];
    static handshake;
    static current_dialog;
    static user_id = -1;
    static user_name = ''
    static user_avatar = ''
    
    static store = {} /// хранилище для хранения чего угодно
}