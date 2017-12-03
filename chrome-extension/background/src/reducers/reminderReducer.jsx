const initialState = {current_reminder: undefined, current_reminder_input: undefined, time_till_alert: -1};

var reminder = function(state= initialState, action) {
    switch (action.type) {
        case 'CHANGE_REMINDER_INPUT':
            return Object.assign({}, state, {current_reminder_input: action.payload});
        case 'SET_REMINDER':
            return Object.assign({}, state, {current_reminder: state.current_reminder_input});
        default:
            return state;
    }
}

export default reminder;
