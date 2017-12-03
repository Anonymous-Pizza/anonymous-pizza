const initialState = {
    current_reminder: undefined, 
    current_reminder_input: undefined, 
    time_until_alert: undefined,
    time_on_alert: undefined,
    alert_on: 0
};

var reminder = function(state= initialState, action) {
    switch (action.type) {
        case 'CHANGE_REMINDER_INPUT':
            return Object.assign({}, state, {current_reminder_input: action.payload});


        case 'SET_REMINDER':
            // set time on alert as new reminder set
            var d = new Date();
            d.setMinutes(d.getMinutes() + parseInt(state.current_reminder_input));

            // set time until alert as new reminder set
            var e = new Date();
            e.setHours(0, 0, 0, 0);
            e.setMilliseconds(state.current_reminder_input * 60 * 1000);

            return Object.assign({}, state, {current_reminder: state.current_reminder_input, 
                                            time_on_alert: d, time_until_alert: e});
        
        
        case 'RESET_TIMER':
            // reset time on alert to start
            var d = new Date();
            console.log(d.getMinutes());
            d.setMinutes(d.getMinutes() + parseInt(state.current_reminder));

            // reset time until alert to start
            var e = new Date(0);
            e.setHours(0, 0, 0, 0);
            e.setMilliseconds(state.current_reminder * 60 * 1000);

            return Object.assign({}, state, {time_on_alert: d, time_until_alert: e});


        case 'UPDATE_TIMER':
            var d = undefined;
            if (state.time_until_alert) {
                d = state.time_until_alert;
                d.setSeconds(d.getSeconds() - 1);
            } else {
                if (state.current_reminder) {
                    d = new Date(0);
                    d.setHours(0, 0, 0, 0);
                    d.setMilliseconds(state.current_reminder * 60 * 1000);
                }
            }

            return Object.assign({}, state, {time_until_alert: d});
            

            

        default:
            return state;
    }
}

export default reminder;
