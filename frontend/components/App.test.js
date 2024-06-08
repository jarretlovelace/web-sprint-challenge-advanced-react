import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AppClass from './AppClass';
import axios from 'axios'
import AppFunctional from './AppFunctional'

jest.mock('axios');

test('displays error message for invalid moves', () => {
  render(<AppFunctional />);

  fireEvent.click(scree.getByTxt(/left/i));

  expect(screen.getByTestId('message')).toHaveTextContent("You can't go that way");
});

test('displays error message on the form submission with no email', () => {
  render(<AppFunctional />);

  fireEvent.click(screen.getByText(/submit/i));

  expect(screen.getByText('message')).toHaveTextContent('Ouch: email is required');
});

test('displays error message on form submission with invalid email', async () => {
  render(<AppFunctional />);
  axios.post.mockRejectedValueOnce({ response: {status: 422 } });

  fireEvent.click(screengetByText(/submit/i));

  await waitFor(() => {
    expect(screen.getByTestId('message')).toHaveTextContent('Ouch: email must be a valid email');
  })
})
test('renders the initial state correctly', () => {
  const { getByText, getByPlaceholderText } = render(<AppClass />);

  expect(getByText(/coordinates/i)).toHaveTextContent('Coordinates (2, 2)');
  expect(getByText(/you moved/i)).toHaveTextContent('You moved 0 times');
  expect(getByPlaceholderText(/type email/i)).toBeInTheDocument();
});

test('updates coordinates and steps correctly when moving', () => {
  const { getByText } = render(<AppClass />);

  fireEvent.click(getByText(/right/i));
  expect(getByText(/coordinates/i)).toHaveTextContent('Coordinates (3, 2)');
  expect(getByText(/you moved/i)).toHaveTextContent('You moved 1 time');

  fireEvent.click(getByText(/left/i));
  expect(getByText(/coordinates/i)).toHaveTextContent('Coordinates (2, 2)');
  expect(getByText(/you moved/i)).toHaveTextContent('You moved 2 times');

  fireEvent.click(getByText(/up/i));
  expect(getByText(/coordinates/i)).toHaveTextContent('Coordinates (2, 1)');
  expect(getByText(/you moved/i)).toHaveTextContent('You moved 3 times');

  fireEvent.click(getByText(/down/i));
  expect(getByText(/coordinates/i)).toHaveTextContent('Coordinates (2, 2)');
  expect(getByText(/you moved/i)).toHaveTextContent('You moved 4 times');
});

test('displays error messages for invalid moves', () => {
  const { getByText } = render(<AppClass />);

  fireEvent.click(getByText(/left/i));
  fireEvent.click(getByText(/left/i));
  expect(getByText(/coordinates/i)).toHaveTextContent('Coordinates (1, 2)');
  expect(getByText(/you moved/i)).toHaveTextContent('You moved 1 time');
  expect(getByText(/you can't go left/i)).toBeInTheDocument();

  fireEvent.click(getByText(/up/i));
  fireEvent.click(getByText(/up/i));
  expect(getByText(/coordinates/i)).toHaveTextContent('Coordinates (1, 1)');
  expect(getByText(/you moved/i)).toHaveTextContent('You moved 2 times');
  expect(getByText(/you can't go up/i)).toBeInTheDocument();

  fireEvent.click(getByText(/right/i));
  fireEvent.click(getByText(/right/i));
  fireEvent.click(getByText(/right/i));
  expect(getByText(/coordinates/i)).toHaveTextContent('Coordinates (3, 1)');
  expect(getByText(/you moved/i)).toHaveTextContent('You moved 3 times');
  expect(getByText(/you can't go right/i)).toBeInTheDocument();

  fireEvent.click(getByText(/down/i));
  fireEvent.click(getByText(/down/i));
  fireEvent.click(getByText(/down/i));
  expect(getByText(/coordinates/i)).toHaveTextContent('Coordinates (3, 3)');
  expect(getByText(/you moved/i)).toHaveTextContent('You moved 4 times');
  expect(getByText(/you can't go down/i)).toBeInTheDocument();
});

test('resets the state correctly', () => {
  const { getByText, getByPlaceholderText } = render(<AppClass />);

  fireEvent.click(getByText(/right/i));
  fireEvent.click(getByText(/reset/i));

  expect(getByText(/coordinates/i)).toHaveTextContent('Coordinates (2, 2)');
  expect(getByText(/you moved/i)).toHaveTextContent('You moved 0 times');
  expect(getByPlaceholderText(/type email/i)).toHaveValue('');
});

test('updates email input value', () => {
  const { getByPlaceholderText } = render(<AppClass />);
  const input = getByPlaceholderText(/type email/i);

  fireEvent.change(input, { target: { value: 'test@example.com' } });
  expect(input).toHaveValue('test@example.com');
});

test('displays success message on valid email submission', async () => {
  const { getByText, getByPlaceholderText } = render(<AppClass />);
  const input = getByPlaceholderText(/type email/i);
  const submitButton = getByText(/submit/i);

  fireEvent.change(input, { target: { value: 'valid@example.com' } });

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ message: 'Success' }),
    })
  );

  fireEvent.click(submitButton);

  expect(await getByText(/success/i)).toBeInTheDocument();
});
