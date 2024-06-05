import React from 'react';

// Suggested initial states
const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
};

export default class AppClass extends React.Component {
  state = initialState;

  getXY = () => {
    const { index } = this.state;
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  };

  getXYMessage = () => {
    const { x, y } = this.getXY();
    return `Coordinates (${x}, ${y})`;
  };

  reset = () => {
    this.setState(initialState);
  };

  getNextIndex = (direction) => {
    const { index } = this.state;
    let newIndex = index;

    if (direction === 'left' && index % 3 !== 0) newIndex -= 1;
    if (direction === 'right' && index % 3 !== 2) newIndex += 1;
    if (direction === 'up' && index > 2) newIndex -= 3;
    if (direction === 'down' && index < 6) newIndex += 3;

    return newIndex;
  };

  move = (evt) => {
    const direction = evt.target.id;
    const nextIndex = this.getNextIndex(direction);

    if (nextIndex !== this.state.index) {
      this.setState((prevState) => ({
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
      this.setState({ message: errorMessage });
    }
  };

  onChange = (evt) => {
    this.setState({ email: evt.target.value });
  };

  onSubmit = (evt) => {
    evt.preventDefault();
    const { x, y } = this.getXY();
    const { steps, email } = this.state;

    fetch(`http://localhost:9000/api/result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ x, y, steps, email }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ message: data.message || 'Error submitting email' });
      })
      .catch(() => {
        this.setState({ message: 'Error submitting email' });
      });
  };

  render() {
    const { className } = this.props;
    const { index, steps, message, email } = this.state;

    return (
      <div id="wrapper" className={className}>
        <p>(This component is not required to pass the sprint)</p>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
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
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            type="email"
            placeholder="type email"
            value={email}
            onChange={this.onChange}
          />
          <input id="submit" type="submit" />
        </form>
      </div>
    );
  }
}
