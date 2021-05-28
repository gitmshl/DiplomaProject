class Sender{

    static sio = null;

    static setSio(sio){
        this.sio = sio;
    }

    static send_2(status, user_id){
        console.log("Sender.send_2(" + status + ", " + user_id);
        this.sio.emit('proto2', {'code': 2, 'status': status, 'user_id': user_id});
    }

    
    static send_10(msg){
        console.log("Sender.send_10(" + msg + ")");
        let user_id = SST.getId();
        let dialog_id = SST.getCurrentDialog();
        this.sio.emit('proto10', {'code': 10, 'dialog_id': dialog_id, 'msg': msg});
    }


    static send_11(latitude, longitude){
        console.log('send_11');
        this.sio.emit('proto11', {'code': 11, 'latitude': latitude, 'longitude': longitude});
    }
    

    static send_20(){
        console.log("Sender.send_20()");
        this.sio.emit('proto20', {'code': 20});
    }

    static send_21(dialog_id){
        console.log("Sender.send_21");
        this.sio.emit('proto21', {'code': 21, 'dialog_id': dialog_id});
    }

    /// period = [now, day, week, month]
    static send_22(page_id, period){
        console.log('send_22');
        this.sio.emit('proto22', {'code': 22, 'page_id': page_id, 'type': period});
    }   


    static close(){
        this.sio.disconnect(true);
    }

}