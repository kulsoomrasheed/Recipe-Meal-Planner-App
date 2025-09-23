import { render, screen } from '@testing-library/react';

describe('smoke', () => {
  test('test runner works', () => {
    render(<div>hello</div>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
});


