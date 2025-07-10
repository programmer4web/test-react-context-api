import { render, screen } from '@testing-library/react';
import App from './App';

test('renders React context API examples heading', () => {
  render(<App />);
  const linkElement = screen.getByText(/React Context API examples/i);
  expect(linkElement).toBeInTheDocument();
});
