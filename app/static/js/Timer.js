class Timer{

    static init(){
        console.log("Timer.init()");
        this.Timers[10] = {handl: -1, code: 10, count: 1};
        this.Timers[20] = {handl: -1, code: 20, count: 1};
        this.Timers[21] = {handl: -1, code: 21, count: 1};
    }

    static clearAllTimers(){
        console.log("Timer.clearAllTimers()");
        Timer.Timers.forEach(function(t){
            clearTimeout(t.handl);
        });
        /// после создания timers_0 нужно будет и их уничтожить !!!
    }

    
    static setTimer_10(){
        console.log("Timer.setTimer_10()");
        let t = Timer.Timers[10];
        if (t.handl != -1) clearTimeout(t.handl);
        t.handl = setTimeout(Timer.timeout_10, Consts.TIMER_10_TIME);
    }

    static clearTimer_10(){
        console.log("Timer.clearTimer_10()");
        let t = Timer.Timers[10];
        clearTimeout(t.handl);
        t.handl = -1;
    }

    static timeout_10(){
        console.log("Timer.timeout_10()");
        if (!SST.checkWaitingForResponse(110)) return;
        let t = Timer.Timers[10];
        t.count = t.count + 1;
        if (t.count > Consts.MAX_TIMER_10_COUNT){
            UC.err_timer_10();
            return;
        }
        UC.req_10();
    }


    static setTimer_20(){
        console.log("Timer.setTimer_20()");
        let t = Timer.Timers[20];
        if (t.handl != -1) clearTimeout(t.handl);
        t.handl = setTimeout(Timer.timeout_20, Consts.TIMER_20_TIME);
    }

    static clearTimer_20(){
        console.log("Timer.clearTimer_20()");
        let t = Timer.Timers[20];
        clearTimeout(t.handl);
        t.handl = -1;
    }

    static timeout_20(){
        console.log("Timer.timeout_20()");
        if (!SST.checkWaitingForResponse(120)) return;
        let t = Timer.Timers[20];
        t.count = t.count + 1;
        if (t.count > Consts.MAX_TIMER_20_COUNT){
            UC.err_timer_20();
            return;
        }
        UC.req_20();
    }

    static setTimer_21(){
        console.log("Timer.setTimer_21()");
        let t = Timer.Timers[21];
        if (t.handl != -1) clearTimeout(t.handl);
        t.handl = setTimeout(Timer.timeout_21, Consts.TIMER_21_TIME);
    }

    static clearTimer_21(){
        console.log("Timer.clearTimer_21()");
        let t = Timer.Timers[21];
        clearTimeout(t.handl);
        t.handl = -1;
    }

    static timeout_21(){
        console.log("Timer.timeout_21()");
        if (!SST.checkWaitingForResponse(121)) return;
        let t = Timer.Timers[21];
        t.count = t.count + 1;
        if (t.count > Consts.MAX_TIMER_21_COUNT){
            UC.err_timer_21();
            return;
        }
        UC.goToDialog(SST.getCurrentDialog());
    }

   
    static Timers = [];
}