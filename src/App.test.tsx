import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('Settings form', () => {
  it('shows required field errors when submitted empty', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /save settings/i }));

    expect(screen.getByText('Full name is required.')).toBeInTheDocument();
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows an error for invalid email input', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/^email$/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /save settings/i }));

    expect(
      screen.getByText('Please enter a valid email address.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows a success message and keeps values after valid submission', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/^email$/i), 'jane@example.com');
    await user.selectOptions(
      screen.getByLabelText(/time zone/i),
      'America/New_York',
    );
    await user.click(screen.getByLabelText(/email notifications/i));
    await user.click(screen.getByRole('button', { name: /save settings/i }));

    expect(screen.getByRole('status')).toHaveTextContent(
      'Settings saved successfully.',
    );
    expect(screen.getByLabelText(/full name/i)).toHaveValue('Jane Doe');
    expect(screen.getByLabelText(/^email$/i)).toHaveValue('jane@example.com');
    expect(screen.getByLabelText(/time zone/i)).toHaveValue('America/New_York');
    expect(screen.getByLabelText(/email notifications/i)).toBeChecked();
  });
});
