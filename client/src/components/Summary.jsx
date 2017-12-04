import React from 'react';

class Summary extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    };

    this.renderWarmupList = this.renderWarmupList.bind(this);
    this.renderWorkoutList = this.renderWorkoutList.bind(this);
    this.renderCooldownList = this.renderCooldownList.bind(this);
    this.renderWorkedOutTime = this.renderWorkedOutTime.bind(this);
  }

  renderWarmupList(){
    var warmupExercises = this.props.completedExercises.filter((exercise)=>{ return exercise.type === 'warmup'});
    return warmupExercises.map((exe, ind)=> <li key={ind}>{exe.name}</li>);
  }
  renderWorkoutList(){
    var workoutExercises = this.props.completedExercises.filter((exercise)=>{ return exercise.type === 'workout'});
    return workoutExercises.map((exe, ind)=> <li key={ind}>{exe.name}</li>);
  }
  renderCooldownList(){
    var cooldownExercises = this.props.completedExercises.filter((exercise)=>{ return exercise.type === 'cooldown'});
    return cooldownExercises.map((exe, ind)=> <li key={ind}>{exe.name}</li>);
  }
  renderWorkedOutTime(){
    if(this.props.workedoutTimeInSec <= 0){
      return this.props.workoutLengthInMins + ' Minutes';
    } else {
      var timeInMin = this.props.workoutLengthInMins - (Math.ceil(this.props.workedoutTimeInSec / 60 ));
      var timeInSec = 60 - (this.props.workedoutTimeInSec%60);
      if(timeInSec){
        return `${timeInMin} min ${timeInSec} sec`;
      }
    }

  }

  render() {
    return (
      <div className="summary">
        <h1>Workout Summary</h1>
        <span className="summaryCongrats congratulations">All Done! Congratulations! 🎉</span> <br />
        {!this.props.loggedIn && (<span className="alert">⚠️  You are currently not logged in. Workout Summary data will not be saved.</span>)}
        <div className="summaryStats">
          <h3 className="summaryTitle"> Date: </h3> {this.props.workoutDate}
          <h3 className="summaryTitle"> Length of Workout: </h3>
            {this.renderWorkedOutTime()}
          <h3 className="summaryTitle"> Warmup: </h3>
            <ul>{this.renderWarmupList()}</ul>
          <h3 className="summaryTitle"> Workout: </h3>
            <ul>{this.renderWorkoutList()}</ul>
          <h3 className="summaryTitle"> Cooldown: </h3>
            <ul>{this.renderCooldownList()}</ul>
        </div>
        <span className="summaryQuote">"Good things come to those who sweat."</span>
        <button onClick={this.props.goToDashboard} className="blackButton">Back To Dashboard</button>
      </div>
    );
  }
};

export default Summary;

