import React from 'react';
import History from './History.jsx';

class Dashboard extends React.Component {
  constructor(props){
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e) {
    this.props.updateWorkoutLength(e.target.value);
  }

  render(){
    return (
      <div className="dashboard">
        <h3>How many minutes you want to work out? <input placeholder="15" onChange={this.handleInputChange}></input></h3>

        <h1>Start Workout</h1>
        <div className="startButton">
          <img onClick= {this.props.goToCountdown} src="public/images/pizzablue.png" alt="Start"/>
        </div>
        <History workoutHistory={this.props.workoutHistory} workoutDate={this.props.workoutDate} workoutLength={this.props.workoutLength} loggedIn={this.props.loggedIn}/>
      </div>
    )
  }
};

export default Dashboard;

