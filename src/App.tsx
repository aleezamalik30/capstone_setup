import { useState, type FormEvent } from 'react';
import './App.css';

type SettingsForm = {
  fullName: string;
  email: string;
  timeZone: string;
  emailNotifications: boolean;
};

type SettingsFormErrors = {
  fullName?: string;
  email?: string;
};

const TIME_ZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'Australia/Sydney', label: 'Sydney' },
];

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateSettingsForm(
  values: Pick<SettingsForm, 'fullName' | 'email'>,
): SettingsFormErrors {
  const errors: SettingsFormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!validateEmail(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  return errors;
}

function App() {
  const [formData, setFormData] = useState<SettingsForm>({
    fullName: '',
    email: '',
    timeZone: 'UTC',
    emailNotifications: false,
  });
  const [errors, setErrors] = useState<SettingsFormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage('');

    const validationErrors = validateSettingsForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSuccessMessage('Settings saved successfully.');
  };

  return (
    <main className="app">
      <h1>Capstone Setup</h1>
      <p>React + TypeScript application initialized successfully.</p>

      <section className="settings-section" aria-labelledby="settings-heading">
        <h2 id="settings-heading">Settings</h2>

        <form className="settings-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="fullName">Full Name</label>
            <div className="field-row">
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                value={formData.fullName}
                aria-invalid={errors.fullName ? true : undefined}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    fullName: event.target.value,
                  }))
                }
              />
              {errors.fullName ? (
                <span id="fullName-error" className="field-error" role="alert">
                  {errors.fullName}
                </span>
              ) : null}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <div className="field-row">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? 'email-error' : undefined}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />
              {errors.email ? (
                <span id="email-error" className="field-error" role="alert">
                  {errors.email}
                </span>
              ) : null}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="timeZone">Time Zone</label>
            <select
              id="timeZone"
              name="timeZone"
              value={formData.timeZone}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  timeZone: event.target.value,
                }))
              }
            >
              {TIME_ZONES.map((zone) => (
                <option key={zone.value} value={zone.value}>
                  {zone.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field form-field-checkbox">
            <input
              id="emailNotifications"
              name="emailNotifications"
              type="checkbox"
              checked={formData.emailNotifications}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  emailNotifications: event.target.checked,
                }))
              }
            />
            <label htmlFor="emailNotifications">Email Notifications</label>
          </div>

          <button type="submit">Save Settings</button>

          {successMessage ? (
            <p className="success-message" role="status" aria-live="polite">
              {successMessage}
            </p>
          ) : null}
        </form>
      </section>
    </main>
  );
}

export default App;
