import {createStore} from 'redux';
import reducers from './reducers/combineReducers.jsx';
import {wrapStore} from 'react-chrome-redux';
const updateTimerInterval = 1000;

const store =  createStore(reducers);

wrapStore(store, {
    portName: 'FS'
});

var startTimer = () => {
    updateBadge();
    var timerId = window.setTimeout(startTimer, updateTimerInterval);
}

function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

var updateBadge = () => {
    var storeState = store.getState();
    store.dispatch({type:'UPDATE_TIMER'});
    console.log(storeState);

    if (storeState.reminder.time_until_alert) {
        var badgeMinutes = storeState.reminder.time_until_alert.getMinutes();
        var badgeSeconds = storeState.reminder.time_until_alert.getSeconds();

        if ((badgeMinutes === 0) && (badgeSeconds === 0)) {
            store.dispatch({type: 'RESET_TIMER'});
            alert("Time to hit FitStop !!!");
            chrome.tabs.create({ url: "https://www.hackreactor.com" });
        }

        var badgeText = badgeMinutes +  ":" + pad(badgeSeconds);
        chrome.browserAction.setBadgeText({text: badgeText});
    }  
    
}

startTimer();

export default startTimer;