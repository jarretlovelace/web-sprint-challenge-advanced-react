import React, { useState } from 'react';
import axios from 'axios';

// Suggested initial states
const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  const coordinates = [
    [1, 1], [2, 1], [3, 1],
    [1, 2], [2, 2], [3, 2],
    [1, 3], [2, 3], [3, 3],
  ];

  function getXY() {
    return coordinates[index];
  }

  function getXYMessage() {
    const [x, y] = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  function getNextIndex(direction) {
    const nextIndexMap = {
      left: index % 3 !== 0 ? index - 1 : index,
      right: index % 3 !== 2 ? index + 1 : index,
      up: index >= 3 ? index - 3 : index,
      down: index <= 5 ? index + 3 : index,
    };
    return nextIndexMap[direction];
  }

  function move(evt) {
    const direction = evt.target.id;
    const nextIndex = getNextIndex(direction);

    // Check if the move is valid
    if (nextIndex !== index) {
      setIndex(nextIndex);
      setSteps(prevSteps => prevSteps + 1);
      setMessage(initialMessage); // Clear any previous error messages
    } else {
      setMessage("You can't go that way");
    }
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    evt.preventDefault();
    if (email.trim() === '') {
      setMessage('Ouch: email is required');
      return;
    }
    const [x, y] = getXY();
    const payload = { x, y, steps, email };
    axios.post('http://localhost:9000/api/result', payload)
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        // Handle different types of errors (like invalid email)
        if (error.response && error.response.status === 422) {
          setMessage('Ouch: email must be a valid email');
        } else {
          setMessage(error.response.data.message);
        }
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {coordinates.map((_, idx) => (
          <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
            {idx === index ? 'B' : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message" data-testid="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="type email"
          value={email}
          onChange={onChange}
        />
        <input id="submit" type="submit" />
      </form>
    </div>
  );
}
