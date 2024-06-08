import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AppFunctional from './AppFunctional';
import axios from 'axios';

jest.mock('axios');

test('displays error message for invalid moves', () => {
  render(<AppFunctional />);

  // Move to an invalid direction
  fireEvent.click(screen.getByText(/left/i));

  // Error message should be displayed
  expect(screen.getByTestId('message')).toHaveTextContent("You can't go that way");
});

test('displays error message on form submission with no email', () => {
  render(<AppFunctional />);

  // Submit the form without entering email
  fireEvent.click(screen.getByText(/submit/i));

  // Error message should be displayed
  expect(screen.getByTestId('message')).toHaveTextContent('Ouch: email is required');
});

test('displays error message on form submission with invalid email', async () => {
  render(<AppFunctional />);
  axios.post.mockRejectedValueOnce({ response: { status: 422 } });

  // Type invalid email
  fireEvent.change(screen.getByPlaceholderText(/type email/i), { target: { value: 'invalidemail' } });

  // Submit the form
  fireEvent.click(screen.getByText(/submit/i));

  // Wait for the error message to appear
  await waitFor(() => {
    expect(screen.getByTestId('message')).toHaveTextContent('Ouch: email must be a valid email');
  });
});

// Test for success message on valid email submission is already covered in the previous response.
