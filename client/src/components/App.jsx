class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentState: 'Dashboard',
      currentWorkout: window.exampleExerciseData,
      currentExercise: 0,
      workoutHistory: [],
      countdown: 3,
      time: null,
      workoutLengthInMins: 15

    };
    this.goToWorkout = this.goToWorkout.bind(this);
    this.goToSummary = this.goToSummary.bind(this);
    this.goToDashboard = this.goToDashboard.bind(this);
    this.goToCountdown = this.goToCountdown.bind(this);
    this.goToLogin = this.goToLogin.bind(this);
    this.goToSignUp = this.goToSignUp.bind(this);
    this.getWorkoutHistory = this.getWorkoutHistory.bind(this);
  }

  componentDidMount() {
    this.getWorkoutHistory();
  }

  goToCountdown() {
    this.setState({currentState: 'Countdown'});
    //this.getExercises();
    this.startCountdown();
  }

  goToWorkout() {
    this.setState({currentState: 'Workout'});
    //and start the workout timer
    this.startTimer();
  };

  getWorkoutHistory() {
  var settings = {
    method: 'GET',
    url: '/history',
    dataType: 'json',
    complete: (data) => {
      console.log('workout history data', data);
      this.setState({workoutHistory: JSON.parse(data.responseText)})
    },
    error: function(err) {
      console.error(err);
    }
  }
  $.ajax(settings);
  };

  getExercises() {
    var settings = {
      method: 'GET',
      url: '/workout',
      dataType: 'json',
      complete: (data) => {
        console.log('exercise data:', data);
        this.setState({currentExercises: JSON.parse(data.responseText)})
      },
      error: function(err) {
        console.error(err);
      }
    }
    $.ajax(settings);
  };

  goToSummary() {
    this.setState({currentState: 'Summary'});
  };

  goToDashboard() {
    this.setState({currentState: 'Dashboard'});
  };

  goToLogin() {
    this.setState({currentState: 'Login'})
  };

  goToSignUp() {
    this.setState({currentState: 'SignUp'})
  };

  startCountdown() {
    //reset countdown to 3
    this.setState({countdown: 3});
    //start interval, every 1 second
    var interval= setInterval(this.countdown.bind(this), 1000);
    this.setState({interval: interval});
  }

  countdown() {
    //decrease countdown by 1
    //take the current value of this.state.countdown --
    var current = this.state.countdown;
    current--;
    this.setState({countdown: current});
    //if countdown reaches 0
    if (this.state.countdown === 0) {
      //cancel interval
      clearInterval(this.state.interval);
      //go to workout
      this.goToWorkout();
    }
  }

  startTimer() {
    console.log('start timer');
    //reset timer
    var current = this.state.workoutLengthInMins * 60;
    this.setState({time: current});
    //start interval, every 1 second
    var interval = setInterval(this.timer.bind(this), 1000);
    this.setState({interval: interval});
  }

  timer() {
    //decrease timer by 1
    var current = this.state.time;
    current--;
    this.setState({time: current});
    //every 60 seconds, change the exercise
    if (this.state.time % 60 === 0) {
      var next = this.state.currentExercise;
      next++;
      this.setState({currentExercise: next});
    }

    //if timer reaches 0
    if (this.state.time === 0) {
      //cancel interval
      clearInterval(this.state.interval);
      //go to summary
      this.goToSummary();
    }
  }

  formatTime(seconds) {
    var mm = Math.floor(seconds / 60);
    var ss = seconds % 60;
    if (ss < 10) {
      ss = '0' + ss;
    }
    //return time in mm:ss
    return mm + ':' + ss;
  }


  render() {

    if(this.state.currentState === 'Dashboard') {
      return (
        <div className = "App">
          <Header goToLogin={this.goToLogin} goToSignUp={this.goToSignUp}/>
          <Dashboard goToCountdown={this.goToCountdown} workoutHistory={this.workoutHistory} />
        </div>
      )
    } else if (this.state.currentState === 'Login') {
      return (
        <div className = "App">
          <Header goToLogin={this.goToLogin} goToSignUp={this.goToSignUp}/>
          <Login />
        </div>
      )
    }else if (this.state.currentState === 'SignUp') {
      return (
        <div className = "App">
          <Header goToLogin={this.goToLogin} goToSignUp={this.goToSignUp}/>
          <SignUp />
        </div>
      )
    }else if (this.state.currentState === 'Countdown') {
      return (
        <div className = "App">
          <Header goToLogin={this.goToLogin} goToSignUp={this.goToSignUp}/>
          <Countdown countdown={this.state.countdown} />
        </div>
      )
    } else if (this.state.currentState === 'Workout') {
      return (
        <div className = "App">
          <Header goToLogin={this.goToLogin} goToSignUp={this.goToSignUp}/>
          <Workout exercise={this.state.currentWorkout[this.state.currentExercise]} timer={this.formatTime(this.state.time)} countdown={this.state.countdown} goToSummary={this.goToSummary} />
        </div>
      )
    } else if (this.state.currentState === 'Summary') {
      return (
        <div className = "App">
            <Header goToLogin={this.goToLogin} goToSignUp={this.goToSignUp}/>
            <Summary goToDashboard={this.goToDashboard} />
        </div>
      )
    } else {
      return (
        <p>Error... sad face...</p>
      )
    }
  } //render
} //class

window.App = App;