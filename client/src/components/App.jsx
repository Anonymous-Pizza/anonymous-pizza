class App extends React.Component {
  constructor() {
    super();
    //countdown numbers
    //workout timer
  }

  //getExercises

  //start countdown

  //start timer

  //

  render() {
    return (
      <div>
    	<h1>Hi</h1>
      <Workout exercises={['a','b', 'c']} timer={15} count={3} />

      <div className = "App">
    	<Header />
      <Dashboard />
      <Workout />
      </div>
    )
  }

}

window.App = App;