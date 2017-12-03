import React from 'react';
import PastWorkout from './PastWorkout.jsx';

var History = (props) => (
  <div className="history">
    <h1> History </h1>
    {props.loggedIn && props.workoutHistory.map(indivWorkout => <PastWorkout date={indivWorkout.date} lengthOfWorkout={indivWorkout.lengthOfWorkout} key={indivWorkout._id}/>)}
    {!props.loggedIn && (<span className='historyNotLoggedIn'>You are not currently logged in. Please Log In or Sign Up to view Workout History.</span>)}
  </div>
);

export default History;

