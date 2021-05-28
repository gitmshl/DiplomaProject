class PH{

    static handle(obj){
        let code = obj.code;
        switch (code) {
            case 10: this.handle_10(obj); break;
            case 110: this.handle_110(obj); break;
            case 120: this.handle_120(obj.dialogs); break;
            case 121: this.handle_121(obj); break;
            default:
                console.log(obj)
                alert('Пришел запрос с неизвестным кодом!!!');
        }
    }

    static handle_10(pquery){
        console.log("handl_10");
        if (!SST.checkHandshake()) return;
        let from_user_id = pquery.from;
        let from_dialog_id = pquery.dialog_id;
        let from_user_name = pquery.user_name;
        let from_user_avatar = pquery.user_avatar;
        let msg = pquery.msg;
        switch (SST.getWaitingResponse()){
            case -1: PH.h10_0(from_user_id, from_dialog_id, from_user_name, from_user_avatar, msg); break;
            case 10: PH.h10_1(from_user_id, from_dialog_id, from_user_name, from_user_avatar, msg); break;
            case 21: PH.h10_2(from_user_id, from_dialog_id, from_user_name, from_user_avatar, msg); break;
            default:
                alert('PH.js, handle_10. Мы ожидаем что-то другое!!!');
        }

        Painter.scrollDown();
    }

    static handle_110(mproto_query){
        if (!SST.checkWaitingForResponse(110)) return;
        SST.setResponse(110);
        Timer.clearTimer_10();
        //Painter.AddMyMessage();
    }

    static handle_120(dialogs){
        console.log('handle 120');
        if (!SST.checkWaitingForResponse(120)) return;
        SST.setResponse(120);
        Timer.clearTimer_20();
        Painter.AddInDialogList(dialogs);
        Painter.showDialogList();
        SST.setHandshake(true);
    }

    static handle_121(obj){
        if (!SST.checkWaitingForResponse(121)) return;
        SST.setResponse(121);
        Timer.clearTimer_21();
        console.log('handle 121');
        let messages = obj.messages;
        let lastMsgInf = obj.lastMsgInf;
        console.log('handle 121');
        console.log(messages);
        console.log(lastMsgInf);
        
        Painter.AddInDialog(lastMsgInf, messages);

        /* Производим проверку того, нужно ли отправлять запрос 1 на сервер */
        /*
        let my_id = SST.getId();
        let from_user_id = data.lastMsgInf.from_user_id;
        if (my_id != from_user_id){
            let last_msg_time = new Date(data.lastMsgInf.last_msg_time);
            let my_last_reading_time = new Date(data.lastMsgInf.my_last_reading_time);
            if (last_msg_time >= my_last_reading_time)
                Sender.send_1();
        }*/

    }


    static h10_0(from_user_id, from_dialog_id, from_user_name, from_user_avatar, msg){
        let current_dialog_id = SST.getCurrentDialog();
        let fromMe = from_user_id == SST.getId();
        Painter.AddMessageInDialogList(from_user_id, from_dialog_id, from_user_name, from_user_avatar, msg, fromMe);
        if (current_dialog_id != from_dialog_id) return;
        if (fromMe) {
            Painter.AddMyMessage(msg);
            return;
        }
        Painter.AddMessageInDialog(from_dialog_id, from_user_id, from_user_name, from_user_avatar, msg);
        //Sender.send_1();
    }

    static h10_1(from_user_id, from_dialog_id, from_user_name, from_user_avatar, msg){
        this.h10_0(from_user_id, from_dialog_id, from_user_name, from_user_avatar, msg);
    }

    static h10_2(from_user_id, from_dialog_id, from_user_name, from_user_avatar, msg){
        let fromMe = from_user_id == SST.getId();
        Painter.AddMessageInDialogList(from_user_id, from_dialog_id, from_user_name, from_user_avatar, msg, fromMe);
    }


}