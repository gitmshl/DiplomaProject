class Painter{

    static init(){
        Painter.Block.DialogList.div = document.getElementById("DialogList");
        Painter.Block.DialogList.maindiv = document.getElementById("Dialogs");
        Painter.Block.Dialog.div = document.getElementById("Dialog");
        Painter.Block.Dialog.maindiv = document.getElementById("Messages");
        Painter.Block.Dialog.input_field = document.getElementById("textar");
        Painter.Block.Dialog.submit_button = document.getElementById("send");

        document.getElementsByTagName("body")[0].style.display = "block";
    }


    static startLoadAnimation(){
        document.getElementById('floatingCirclesG').style.display = 'block';
    }


    static stopLoadAnimation(){
        document.getElementById('floatingCirclesG').style.display = 'none';
    }

    
    static GeoDoesntSupportErr(){
        console.log('geo doesn\' support');
    }

    /**
     * Изменяет в DL класс диалога dialog_id на "прочитанный другими"
     * @param dialog_id
     * @constructor
     */
    static ChangeToReadClassInDialogList(dialog_id, fromMe){
        console.log("ChangeToReadClassInDialogList " + dialog_id);
        if (!fromMe){
            let sub2 = document.getElementById(dialog_id).getElementsByClassName("sub2")[0];
            sub2.classList.remove("unread");
            return;
        }
        let dialog_block = document.getElementById(dialog_id);
        dialog_block.classList.remove("unread");
    }

    /**
     * Изменяет класс последних сообщений (отправленных каким-то пользователем) на "прочатанны другими"
     * @constructor
     */
    static ChangeToReadClassInDialog(){
        console.log("ChangeToReadClassInDialog");
        let maindiv = Painter.Block.Dialog.maindiv;
        let lastmsg = maindiv.lastChild;
        let lastid = lastmsg.getElementsByClassName("hiddenUserId_current_dialog")[0].textContent;
        if (SST.getId() != lastid) return;
        if (!lastmsg.firstChild.classList.contains("unread")) return;
        let childs = maindiv.getElementsByClassName("message_current_dialog");
        let length = childs.length;
        for (let i = 0; i < length; i++)
            childs[i].classList.remove("unread");
    }

    /**
     * Эта функция производит установку необходимых классов в необходимых элементах DOM, которые
     * отвечают за сообщение. Суть в том, что производится определение того, является ли сообщение
     * (последнее сообщение в диалоге) прочитанным, либо же нет. В зависимости от возможных вариантов,
     * производится подстановка css класса .unread в DOM
     * @param from_user_id
     * @param last_msg_time
     * @param last_read_time
     * @param my_last_reading_time
     */
    static setCorrectClassOnUnreadMessages(dialog_id, from_user_id, last_msg_time, last_read_time, my_last_reading_time){
        let my_id = SST.getId();
        var dialog_block = document.getElementById(dialog_id);
        if (my_id == from_user_id) {
            if (last_msg_time < last_read_time) return;
            let sub2 = dialog_block.getElementsByClassName("sub2")[0];
            sub2.classList.add("unread");
            return;
        }
        if (my_last_reading_time > last_msg_time) return;
        dialog_block.classList.add("unread");
    }

    static getRightDateTime(last_msg_time){
        let now = new Date();
        if (now.getFullYear() > last_msg_time.getFullYear())
            return last_msg_time.getDay() + " " + Painter.monthNames[last_msg_time.getMonth()] + " " + last_msg_time.getFullYear();
        if (now.getMonth() == last_msg_time.getMonth())
        {
            if (now.getDay() - last_msg_time.getDay() == 1)
                return "Yesterday";
            if (now.getDay() == last_msg_time.getDay())
            {
                let hours = last_msg_time.getHours();
                let minutes = last_msg_time.getMinutes();
                if (hours < 10) hours = "0" + hours;
                if (minutes < 10) minutes = "0" + minutes;
                return hours + ":" + minutes;
            }
        }
        return last_msg_time.getDay() + " " + Painter.monthNames[last_msg_time.getMonth()]
    }

    /**
     * Вставляет в DOM дерево в список диалогов 1 диалог (при этом, с учетом
     * правильных выборов классов)
     * @param dialogInf - содержится вся информация о диалоге, который нужно
     *                      вставить
     * @constructor
     */
    static InsertInDOMOneDialogBlock(dialogInf){
        console.log("InsertINDom");
        let dialog_id = dialogInf["dialog_id"];
        let dialog_img = dialogInf["avatar"];
        let dialog_name = dialogInf["dialog_name"];
        let from_user_id = dialogInf["lastMsg"]["from"];
        let last_msg = dialogInf["lastMsg"]["msg"];
        let last_msg_time = dialogInf["lastMsg"]["time"];
        //let last_read_time = dialogInf["lastMsg"]["last_read_time"];
        //let my_last_reading_time = dialogInf["lastMsg"]["my_last_reading_time"];
        /// Переводим строки Timestamp в объект Date
        last_msg_time = new Date(last_msg_time);
        //last_read_time = new Date(last_read_time);
        //my_last_reading_time = new Date(my_last_reading_time);

        let div = document.createElement("div");
        div.className = "dialog_block";
        div.id = dialog_id;
        let avatar_block = "<div class=\"avatar_block\"><img src=\"" + Consts.IMAGE_LOADER_URL + dialog_img +"\" width=40%></div>"; /// описание блока avatar_block
        let sub1 = "<div class=\"sub1\">" + dialog_name + "</div>"; /// Имя
        let sub2 = "<div class=\"sub2\" style=\"display: block;\">"+last_msg+"</div>"; /// последнее сообщение
        let date = "<div class=\"date\">"+Painter.getRightDateTime(last_msg_time)+"</div>"; /// дата (время) последнего сообщения
        let function_onclick = "UC.goToDialog("+ dialog_id +");";
        div.innerHTML = avatar_block +
            "<div style='cursor: pointer;' class=\"profile_name_link\" onclick=\"" + function_onclick +" return false;\">" +
            "<div class=\"profile_name\">" +
            sub1 +
            sub2 +
            "<div class=\"sub3\" style=\"display: none;\"></div>" +
            date +
            "</div></div>";

        Painter.Block.DialogList.maindiv.appendChild(div);
        //// После вставки в DOM дерево, начинаем настраивать необходимые классы
        //// производим настройку класса .unread
       
        //Painter.setCorrectClassOnUnreadMessages(dialog_id, from_user_id, last_msg_time, last_read_time, my_last_reading_time);

    }

    /**
     * Добавляет сообщение в список диалогов как последнее пришедшее сообщение
     * @param from_user_id
     * @param from_dialog_id
     * @param from_user_name
     * @param from_user_avatar
     * @param msg
     * @param classdop
     * @constructor
     */
    static AddMessageInDialogList(from_user_id, from_dialog_id, from_user_name, from_user_avatar, msg, fromMe){
        console.log("AddMessageInDialogList" + " " + from_dialog_id);
        let dialog = document.getElementById(from_dialog_id);
        let sub2 = dialog.getElementsByClassName("sub2")[0];
        let date = dialog.getElementsByClassName("date")[0];
        //let dialog_block = Painter.Block.DialogList.maindiv.getElementsByClassName("dialog_block")[0];
        let dialog_block = dialog;
        sub2.textContent = msg;
        date.textContent = Painter.getRightDateTime(new Date());
        console.log(sub2.textContent + " msg: " + msg);
        sub2.classList.remove("unread");
        dialog_block.classList.remove("unread");
        if (fromMe) sub2.classList.add("unread");
        else dialog_block.classList.add("unread");

        Painter.Block.DialogList.maindiv.insertBefore(dialog, Painter.Block.DialogList.maindiv.firstChild);

    }

    static AddInDialogList(dialogs){
        dialogs.forEach(function(dialog){
            Painter.InsertInDOMOneDialogBlock(dialog);
        });
    }

    static InsertInDOMMessageWhenLastMsgFromMe(message, lastMsgInf, message_id){
        let last_read_time = new Date(lastMsgInf.last_read_time);
        let last_msg_time = new Date(lastMsgInf.time);
        if (last_read_time > last_msg_time)
        {
            Painter.InsertInDOMMessageWhenLastMsgNotFromMe(message, message_id);
            return;
        }
        let msg_time = new Date(message.time);
        let classdop = msg_time > last_read_time ? "unread" : "";
        Painter.InsertInDOMMessageWhenLastMsgNotFromMe(message, message_id, classdop);
    }

    static InsertInDOMMessageWhenLastMsgNotFromMe(message, message_id, classdop=""){
        let from_user_id = message.user_id;
        console.log('from ' + from_user_id);
        let from_user_name = message.from_user_name;
        let from_user_avatar = message.from_user_avatar;
        let msg = message.msg;
        let msg_time = new Date(message.time);
        let msg_hours = msg_time.getHours() < 10 ? "0" + msg_time.getHours() : msg_time.getHours();
        let msg_minutes = msg_time.getMinutes() < 10 ? "0" + msg_time.getMinutes() : msg_time.getMinutes();

        let div = document.createElement("div");
        div.className = "dialog_history_current_dialog";
        div.id = "message_id_" + message_id;
        div.innerHTML = "<div class=\""+classdop+" message_current_dialog\"><div id=\"photo_space\">" +
            "<img src=\"" + Consts.IMAGE_LOADER_URL + from_user_avatar +"\" alt=\"\" id=\"avat\" height=100%>" +
            "<div class=\"hiddenUserId_current_dialog\" style=\"display: none;\">"+from_user_id+"</div>" +
            "</div>" + "<div class=\"hiddenUserName_current_dialog\" style='margin-left:14%;font-weight:600;'> " + from_user_name + "</div>"
            + "<p class=\"date_current_dialog\">"+msg_hours+":"+msg_minutes+"</p>" +
            "<p class=\"message_text_current_dialog\">"+msg+"</p></div>";

        Painter.Block.Dialog.maindiv.appendChild(div);
    }

    /**
     * Вставляет в диалог список сообщений, полученных от сервера
     * @constructor
     */
    static AddInDialog(lastMsgInf, messageInfList){
        console.log("AddInDialog");
        /* Установим имя и аватарку диалога */
        let dialog_name = SST.DialogInformation.name;
        let dialog_img = SST.DialogInformation.img;
        Painter.Block.Dialog.div.getElementsByClassName("profile_photo_current_dialog")[0].src = dialog_img;
        Painter.Block.Dialog.div.getElementsByClassName("profile_name_link_current_dialog")[0].textContent = dialog_name;
        /* Вставляем сообщения */
        if (SST.getId() != lastMsgInf.from)
            messageInfList.forEach(function(message){
                Painter.InsertInDOMMessageWhenLastMsgNotFromMe(message, message.id);
            });
        else
            messageInfList.forEach(function(message){
                Painter.InsertInDOMMessageWhenLastMsgFromMe(message, lastMsgInf, message.id);
            });
        Painter.unlockSending();
    }

    /**
     * Добавляет сообщение в диалог, при этом, класс сообщения простой (т.е. без подсветок)
     * @param dialog_id
     * @param from_user_id
     * @param from_user_name
     * @param from_user_avatar
     * @param msg
     * @constructor
     */
    static AddMessageInDialog(dialog_id, from_user_id, from_user_name, from_user_avatar, msg){
        let msg_id = Painter.Block.Dialog.maindiv.getElementsByClassName("dialog_history_current_dialog").length;
        let message = {
            from_user_id: from_user_id,
            from_user_name: from_user_name,
            from_user_avatar: from_user_avatar,
            msg: msg,
            time: new Date()
        }
        Painter.InsertInDOMMessageWhenLastMsgNotFromMe(message, msg_id, "");
    }

    /**
     * Функция производит добавление сообщения, которое было отправлено данным пользователем.
     * Вызывается, когда пользователь нажимает на кнопку отправить сообщение и сервер возвращает ответ 110.
     * @param myMsg - сообщение, которое отправил пользователь
     * @constructor
     */
    static AddMyMessage(myMsg){
        console.log("AddMyMessage: " + myMsg);
        Painter.unlockSending();
        Painter.Block.Dialog.input_field.value = "";
        /* еще нужно прописать код по, непосредственно, отрисовке сообщения */
        let msg_id = Painter.Block.Dialog.maindiv.getElementsByClassName("dialog_history_current_dialog").length;
        let message = {
            from_user_id: SST.getId(),
            from_user_name: SST.getName(),
            from_user_avatar: SST.getAvatar(),
            msg: myMsg,
            time: new Date()
        }
        Painter.InsertInDOMMessageWhenLastMsgNotFromMe(message, msg_id, "unread");
        Painter.scrollDown();
    }

    /**
     * Вставляет сообщение, которое пришло от сервера, в диалог
     * @constructor
     */
    static AddMessageFromServer(){

    }

    static showDialogList(){
        console.log("showDialogList");
        let b = Painter.Block.DialogList;
        console.log(b);
        b.div.style.display = "block";
        b.display = true;
    }

    static hideDialogList(){
        let b = Painter.Block.DialogList;
        b.div.style.display = "none";
        b.display = false;
    }

    /**
     * Блокирует ввод данных и их отправку в поле ввода (в Dialog)
     */
    static blockSending(){
        Painter.Block.Dialog.input_field.disabled = "disabled";
    }

    /**
     * Разблокирует возможность отправки сообщений
     */
    static unlockSending(){
        console.log('unlock sending');
        Painter.Block.Dialog.input_field.disabled = "";
        Painter.scrollDown();
    }

    /**
     * Функция, которая переводит интерфейс(и DOM дерево) из Dialog List
     * в Dialog (SST.dialog_id не трогается, этим занимаются модули более
     * высокого порядка)
     * @param dialog_id - id диалога в который переходим
     * @constructor
     */
    static FromDialogListToDialog(dialog_id){
        Painter.hideDialogList();
        Painter.Block.Dialog.input_field.value = Painter.findInBuffer(dialog_id);
        Painter.blockSending();
        Painter.showDialog();
    }

    static clearDialog(){
        document.getElementById("Messages").innerHTML = "";
    }

    static showDialog(){
        let b = Painter.Block.Dialog;
        b.div.style.display = "block";
        b.display = true;
    }

    static hideDialog(){
        let b = Painter.Block.Dialog;
        b.div.style.display = "none";
        b.display = false;
    }

    /**
     * Ищет в Буфере dialog_id.
     * @param dialog_id
     * @return последнее сообщение, которое пользователь не отправил (но написал в поле ввода), если в буфере
     *          есть диалог dialog_id. В противном случае, возвращается пустая строка.
     */
    static findInBuffer(dialog_id){
        let res = "";
        Painter.Buffer.forEach(function(item){
            if (item.dialog_id == dialog_id){
                res = item.text;
                return;
            }
        });
        return res;
    }

    static saveToBuffer(dialog_id, text){
        if (!text || text == "") return;
        Painter.Buffer.push({
            dialog_id: dialog_id,
            text: text
        });
        if (Painter.Buffer.length > Consts.PainterMaxBufferSize)
            Painter.Buffer.shift();
    }

    static scrollDown(){
        console.log("scroll");
        window.scroll(0, 9999);
        Painter.Block.Dialog.input_field.focus();
    }

    /**
     * Получает сообщение из textarea, которое пользователь ввел
     */
    static getMsg(){
        return Painter.Block.Dialog.input_field.value;
    }

    static Block = {
        DialogList: {
            display: false,
            div: null,
            maindiv: null
        },
        Dialog:{
            display: false,
            div: null,
            maindiv: null,
            input_field: null,
            submit_button: null
        }
    }

    static Buffer = []; /// Буфер хранения неотправленных сообщений
    /// Максимальный размер регулируется в Consts.PainterMaxBufferSize

    static monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
}
