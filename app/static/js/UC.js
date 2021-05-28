class UC{
    
    /**
     * Отправка сообщения (нажатие на кнопку enter в диалоге, в поле отправки сообщения)
     */
     static req_10(){
        console.log("UC.req_10");
        /// если мы не в диалоге, то ничего не делаем (эта часть, впринципе, не должна сработать)
        if (SST.getCurrentDialog() < 0) return;
        Painter.blockSending();
        Painter.startLoadAnimation();
        Sender.send_10(Painter.getMsg());
        SST.setRequest(10);
        Timer.setTimer_10();
    }

    static req_20(){
        console.log("UC.rec_20()");
        Sender.send_20();
        SST.setRequest(20);
        Timer.setTimer_20();
    }

    static friend_button(){
        console.log("friend_button handle");
               
        let frnd = document.getElementById("friend").innerHTML;
        let status = 0; /// добавить в друзья
        if (frnd == "Удалить из друзей") status = 1;
        else if (frnd == "Отклонить запрос") status = 2;
        else if (frnd == "Принять запрос") status = 3;
        

        let user_id = parseInt(document.getElementById("span_page_id").innerHTML);

        Sender.send_2(status, user_id);
        
        if (status == 0) document.getElementById("friend").innerHTML = "Отклонить запрос";
        else if (status == 1) document.getElementById("friend").innerHTML = "Добавить в друзья";
        else if (status == 2) document.getElementById("friend").innerHTML = "Добавить в друзья";
        else if (status == 3) document.getElementById("friend").innerHTML = "Удалить из друзей";
    }

    static goToDialog(dialog_id){
        console.log("UC.goToDialog");
        if (!SST.handshake) return;
        Painter.clearDialog();
        Painter.FromDialogListToDialog(dialog_id);
        SST.setCurrentDialog(dialog_id);
        Painter.startLoadAnimation();
        Sender.send_21(dialog_id);
        SST.setRequest(21);
        Timer.setTimer_21();
    }

    static goToDialogList(){
        if (SST.getCurrentDialog() == Consts.DIALOG_LIST_ID) return;
        console.log("goToDialogList");
        Painter.saveToBuffer(SST.getCurrentDialog(), Painter.getMsg());
        Painter.hideDialog();
        SST.setCurrentDialog(Consts.DIALOG_LIST_ID);
        Painter.showDialogList();
    }

    static myPage(){
        location.href = '/page' + SST.getId();
    }

    static myDialogs(){
        location.href = '/messenger';
    }

    static logout(){
        console.log("logout");
        Sender.close();
    }

    static option(){
        console.log("option");
        location.href = '/options';
    }

    static err_150(){
        console.log("UC.err_150()");
    }

    static err_161(){
        console.log("UC.err_161()");
    }

    static err_timer_10(){
        console.log("err_timer_10");
    }

    static err_timer_11(){
        console.log("err_timer_11");
    }

    static err_timer_20(){
        console.log("err_timer_20");
    }

    static err_timer_21(){
        console.log("err_timer_21");
    }

    static err_timer_30(){
        console.log("err_timer_30");
    }
}