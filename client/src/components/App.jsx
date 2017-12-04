import React from 'react';
import ReactDOM from 'react-dom';

import exampleExerciseData from '../exampleExerciseData.js';

import Header from './Header.jsx';
import Dashboard from './Dashboard.jsx';
import Workout from './Workout.jsx';
import Login from './LogIn.jsx';
import SignUp from './SignUp.jsx';
import Summary from './Summary.jsx';
import Countdown from './Countdown.jsx';


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentState: 'Dashboard',
      currentWorkout: exampleExerciseData.warmup,
      currentExercise: 0,
      workoutDate: null,
      workoutHistory: [],
      username: null,
      loggedIn: false,
      countdown: 3,
      time: null,
      showButtons: true,
      workoutLengthInMins: 15,
      warmupLowerLimitInMins: 10,
      workoutLowerLimitInMins: 5,
      completedExercises: [],
      workedoutTimeInSec: 0
    };

    this.goToWorkout = this.goToWorkout.bind(this);
    this.goToSummary = this.goToSummary.bind(this);
    this.goToDashboard = this.goToDashboard.bind(this);
    this.goToCountdown = this.goToCountdown.bind(this);
    this.goToLogin = this.goToLogin.bind(this);
    this.goToSignUp = this.goToSignUp.bind(this);
    this.getWorkoutHistory = this.getWorkoutHistory.bind(this);
    this.sendWorkoutData = this.sendWorkoutData.bind(this);
    this.logOut = this.logOut.bind(this);
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.updateWorkoutLength = this.updateWorkoutLength.bind(this);
  }

/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  The following functions change the view on the app
* * * * * * * * * * * * * * * * * * * * * * * * * * */

  goToDashboard() {
    this.setState({currentState: 'Dashboard'});
    this.setState({showButtons: true});
    if (this.state.loggedIn) {
      this.getWorkoutHistory();
    }
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
  }

  goToLogin() {
    this.setState({currentState: 'Login'})
  }

  goToSignUp() {
    this.setState({currentState: 'SignUp'})
  }

  goToCountdown() {
    this.setState({currentState: 'Countdown'});
    this.setState({showButtons: false});
    this.setState({currentExercise: 0});

    // this.getExercises(); //uncomment to fetch from db

    var totalWorkoutTime = this.state.workoutLengthInMins;
    var limit = Math.ceil(totalWorkoutTime/3);
    var warmupLimit = totalWorkoutTime - limit;
    var workoutLimit = totalWorkoutTime - (2*limit);
    this.setState({ warmupLowerLimitInMins: warmupLimit });
    this.setState({ workoutLowerLimitInMins: workoutLimit });
    this.startCountdown();
  }

  goToWorkout() {
    this.setState({currentState: 'Workout'});
    this.startTimer();
  }

  goToSummary() {
    this.setState({currentState: 'Summary'});
    this.setState({showButtons: true});
    var currentDate = Date();
    this.setState({workoutDate: currentDate});
    this.setState({workedoutTimeInSec: this.state.time});
    clearInterval(this.state.interval);
    if (this.state.loggedIn) {
      this.sendWorkoutData();
    }
  }


/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  The following functions send requests to the server
* * * * * * * * * * * * * * * * * * * * * * * * * * */

  getWorkoutHistory() {
    $.ajax({
      method: 'GET',
      url: '/history',
      dataType: 'json',
      data: {
        username: this.state.username
      },
      complete: (data) => {
        var firstFive = JSON.parse(data.responseText).slice(0, 5);
        this.setState({workoutHistory: firstFive})
      },
      error: function(err) {
        console.error(err);
      }
    });
  }

  getExercises() {
    $.ajax({
      method: 'GET',
      url: '/workout',
      dataType: 'json',
      data: {
        lengthOfWorkout: this.state.workoutLengthInMins
      },
      complete: (data) => {
        console.log('exercise data:', data);
        this.setState({currentWorkout: JSON.parse(data.responseText)})
      },
      error: function(err) {
        console.error(err);
      }
    });
  }

  sendWorkoutData() {
    $.ajax({
      type: 'POST',
      url: '/addWorkout',
      data: JSON.stringify({
        username: this.state.username,
        date: Date(),
        currentWorkout: this.state.currentWorkout,
        lengthOfWorkout: this.state.workoutLengthInMins
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: function (data) {
        console.log('succesfully posted data!');
      }
    });
  };

  login(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    var username = data.get('username');
    var password = data.get('password');

    $.ajax({
      type: "POST",
      url: '/login',
      data: JSON.stringify({
        username: username,
        password: password
      }),
      contentType: 'application/json',
      dataType: 'json',
      complete: data => {
        if (data.responseText === "Log in success") {
          this.setState({username: username});
          this.setState({loggedIn: true});
          this.goToDashboard();
        } else {
          alert("Username and Password Invalid");
          this.goToLogin();
        }
      }
    });
  }

  signup(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    var username = data.get('username');
    var password = data.get('password');

    $.ajax({
      type: "POST",
      url: '/signup',
      data: JSON.stringify({
        username: username,
        password: password
      }),
      contentType: 'application/json',
      dataType: 'json',
      complete: data => {
        if (data.responseText === "User Created") {
          this.setState({username: username});
          this.setState({loggedIn: true});
          this.goToDashboard();
        } else {
          alert("Username and Password Invalid");
          this.goToSignUp();
        }
      }
    });
  }

  logOut() {
    this.setState({loggedIn: false});
    this.setState({username: null});
    this.goToDashboard();
  }


/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  Countdown and Timer Functions
* * * * * * * * * * * * * * * * * * * * * * * * * * */

  startCountdown() {
    this.setState({countdown: 3});
    var interval= setInterval(this.countdown.bind(this), 1000);
    this.setState({interval: interval});
  }

  countdown() {
    var current = this.state.countdown;
    current--;
    this.setState({countdown: current});
    if (this.state.countdown === 0) {
      clearInterval(this.state.interval);
      this.goToWorkout();
    }
  }

  startTimer() {
    var current = this.state.workoutLengthInMins * 60;
    this.setState({time: current});
    var interval = setInterval(this.timer.bind(this), 1000);
    this.setState({interval: interval});
  }

  timer() {
    var current = this.state.time;
    current--;
    this.setState({time: current});
    if (this.state.time <= 0) {
      var completed = this.state.completedExercises;
      completed.push(this.state.currentWorkout[this.state.currentExercise]);
      this.setState({ completedExercises: completed });
      this.goToSummary();
    } else if (this.state.time % 60 === 0) {
      //updating completed exercises list
      var completed = this.state.completedExercises;
      completed.push(this.state.currentWorkout[this.state.currentExercise]);
      this.setState({ completedExercises: completed });

      //logic to move to next type of exercises
      var timeInMins = this.state.time/60;
      if(timeInMins > this.state.warmupLowerLimitInMins) {
        var warmupExercises = this.state.currentWorkout;
        var next = this.state.currentExercise;

        if(next >= warmupExercises.length - 1){
          next = 0;
        } else {
          next++;
        }
        this.setState({currentExercise: next});
      } else if (timeInMins == this.state.warmupLowerLimitInMins) {
        this.setState({currentWorkout: exampleExerciseData.workout});
        this.setState({currentExercise: 0});
      } else if (timeInMins > this.state.workoutLowerLimitInMins && timeInMins < this.state.warmupLowerLimitInMins){
        var workoutExercises = this.state.currentWorkout;
        var next = this.state.currentExercise;
        if(next >= workoutExercises.length - 1){
          next = 0;
        } else {
          next++;
        }
        this.setState({currentExercise: next});
      } else if (timeInMins == this.state.workoutLowerLimitInMins){
        this.setState({currentWorkout: exampleExerciseData.cooldown});
        this.setState({currentExercise: 0});
      } else if (timeInMins < this.state.workoutLowerLimitInMins){
        var cooldownExercises = this.state.currentWorkout;
        var next = this.state.currentExercise;
        if(next >= cooldownExercises.length - 1){
          next = 0;
        } else {
          next++;
        }
        this.setState({currentExercise: next});
      }
      this.refs.workoutPage.highlightActiveTitle();
    }
  }

  formatTime(seconds) {
    var mm = Math.floor(seconds / 60);
    var ss = seconds % 60;
    if (ss < 10) {
      ss = '0' + ss;
    }
    return mm + ':' + ss;
  }

/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  Update the workout length function
* * * * * * * * * * * * * * * * * * * * * * * * * * */

  updateWorkoutLength(workoutLength) {
    this.setState({workoutLengthInMins: workoutLength});
  }


/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  Renders the components based ot the current state
* * * * * * * * * * * * * * * * * * * * * * * * * * */

  render() {
    var toBeRendered = () => {
      if (this.state.currentState === 'Dashboard') {
        return (<Dashboard goToCountdown={this.goToCountdown} workoutHistory={this.state.workoutHistory} loggedIn={this.state.loggedIn} updateWorkoutLength={this.updateWorkoutLength}/>);
      }
      if (this.state.currentState === 'Login') {
          return (<Login login={this.login} />);
      }
      if (this.state.currentState === 'SignUp') {
          return (<SignUp signup={this.signup}  />);
      }
      if (this.state.currentState === 'Countdown') {
          return (<Countdown countdown={this.state.countdown} />);
      }
      if (this.state.currentState === 'Workout') {
        return (<Workout exercise={this.state.currentWorkout[this.state.currentExercise]} timer={this.formatTime(this.state.time)} countdown={this.state.countdown} goToSummary={this.goToSummary} goToDashboard={this.goToDashboard} ref= "workoutPage"/>);
      }
      if (this.state.currentState === 'Summary') {
        return (<Summary goToDashboard={this.goToDashboard} completedExercises= {this.state.completedExercises} currentWorkout={this.state.currentWorkout} workoutDate={this.state.workoutDate} workoutLengthInMins={this.state.workoutLengthInMins} loggedIn={this.state.loggedIn} workedoutTimeInSec={this.state.workedoutTimeInSec}/>);
      }
    }

    return (
      <div className = "App">
        <Header username={this.state.username} goToLogin={this.goToLogin} goToSignUp={this.goToSignUp} loggedIn={this.state.loggedIn} logOut={this.logOut} showButtons={this.state.showButtons}/>
        {toBeRendered()}
      </div>
    )
  }

} // End of Class
export default App;
