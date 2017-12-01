var Exercise = (props) => {
  var description = props.exercise.description;
  var instructions = description.split('.');
  console.log('instructons', instructions);
  return(
    <div className="exercise">
    <div className="exerciseDescription">
      <img className="exerciseImage" src={props.exercise.picture} />
      <p><span className="exerciseName">{props.exercise.name}</span></p>
      {instructions.map(line => (
          <li>{line}</li>
        ))}
    </div>
  </div>
  )

};


window.Exercise = Exercise;
