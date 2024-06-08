import React, { useState } from 'react';
import axios from 'axios';

const AppFunctional = (props) => {
  const initialState = {
    message: initialMessage,
    email: initialEmail,
    index: initialIndex,
    steps: initialSteps,
  };

  const [state, setState] = useState(initialState);


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

  const reset = () => {
    const { index } = state;
    let newIndex = index;
  
    const getNextIndex = (direction) => {
      const { index } = state;
      let newIndex = index;
  
      if (direction === 'left' && index % 3 !== 0) newIndex -= 1;
      if (direction === 'right' && index % 3 !== 2) newIndex += 1;
      if (direction === 'up' && index > 2) newIndex -= 3;
      if (direction === 'down' && index < 6) newIndex += 3;
  
      return newIndex;
  };

  const getXY = () => {
    const { index } = state;
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  };

  
  const getXYMessage = () => {
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  };


  const move = (evt) => {
    const direction = evt.target.id;
    const nextIndex = getNextIndex(direction);

    if (nextIndex !== state.index) {
      setState((prevState) => ({
        ...prevState,
        index: nextIndex,
        steps: prevState.steps + 1,
        message: '', // Clear the error message on valid move
      }));
    } else {
      let errorMessage = '';
      if (direction === 'up' && state.index < 3) {
        errorMessage = "You can't go up";
      } else if (direction === 'left' && state.index % 3 === 0) {
        errorMessage = "You can't go left";
      } else if (direction === 'right' && state.index % 3 === 2) {
        errorMessage = "You can't go right";
      } else {
        switch (direction) {
          case 'left':
            errorMessage = "You can't go left";
            break;
          case 'right':
            errorMessage = "You can't go right";
            break;
          case 'up':
            errorMessage = "You can't go up";
            break;
          case 'down':
            errorMessage = "You can't go down";
            break;
          default:
            break;
        }
      }
      setState((prevState) => ({ ...prevState, message: errorMessage }));
    }
  };


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
