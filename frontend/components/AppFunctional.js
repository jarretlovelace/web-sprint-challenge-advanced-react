import React, { useState } from 'react';
import axios from 'axios';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
};

const AppFunctional = (props) => {
  const [state, setState] = useState(initialState);

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

  const reset = () => {
    setState(initialState);
  };

  const getNextIndex = (direction) => {
    const { index } = state;
    let newIndex = index;

    if (direction === 'left' && index % 3 !== 0) newIndex -= 1;
    if (direction === 'right' && index % 3 !== 2) newIndex += 1;
    if (direction === 'up' && index > 2) newIndex -= 3;
    if (direction === 'down' && index < 6) newIndex += 3;

    return newIndex;
  };

  const move = (evt) => {
    const direction = evt.target.id;
    const nextIndex = getNextIndex(direction);

    if (nextIndex !== state.index) {
      setState((prevState) => ({
        ...prevState,
        index: nextIndex,
        steps: prevState.steps + 1,
        message: '',
      }));
    } else {
      let errorMessage = '';
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
      setState((prevState) => ({ ...prevState, message: errorMessage }));
    }
  };

  const onChange = (evt) => {
    setState({ ...state, email: evt.target.value });
  };

  const onSubmit = async (evt) => {
    evt.preventDefault();
    const { x, y } = getXY();
    const { steps, email } = state;

    try {
      const response = await axios.post('http://localhost:9000/api/result', {
        x,
        y,
        steps,
        email,
      });
      setState({ ...state, message: response.data.message || 'Success' });
    } catch (error) {
      setState({ ...state, message: 'Error submitting email' });
    }
  };

  const { className } = props;
  const { index, steps, message, email } = state;

  return (
    <div id="wrapper" className={className}>
      <p>(This component is not required to pass the sprint)</p>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
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
};

export default AppFunctional;
