import {createStore} from 'redux';
import reducers from './reducers/combineReducers.jsx';
import {wrapStore} from 'react-chrome-redux';

const store =  createStore(reducers);

wrapStore(store, {
    portName: 'FS'
});
