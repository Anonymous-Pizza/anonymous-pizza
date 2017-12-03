import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

class App extends React.Component{
        
    constructor(props) {
        super(props);
    }

    render() {
        var reminder_time = undefined;
        console.log(this.props.current_state);
        if (this.props.current_state.reminder) {
            var reminder_time = this.props.current_state.reminder.current_reminder
        }
        return (<div> Reminder Set: {reminder_time} min
                    <form onSubmit={(e) => {this.props.dispatch({type: 'SET_REMINDER'})}}>
                        <label> Enter Reminder time in minutes </label>
                        <input type="number" onChange={(e) => {this.props.dispatch({type: 'CHANGE_REMINDER_INPUT', payload: e.target.value})}}/>
                        <input type="submit" value="Submit"/>
                    </form> 
                </div>);
    }
}

const mapStateToProps = (state) => {
   return {
    current_state: state
   };
};
export default connect(mapStateToProps)(App);