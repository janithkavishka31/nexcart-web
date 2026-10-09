import { render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders accessible button text', () => {
    render(<Button>Checkout</Button>);
    expect(screen.getByRole('button', { name: /checkout/i })).toBeInTheDocument();
  });
});
