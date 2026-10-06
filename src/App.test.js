import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home page title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Medical Centers of Tunisia/i);
  expect(titleElement).toBeInTheDocument();
});
