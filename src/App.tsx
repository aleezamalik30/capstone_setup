import { useState, type FormEvent } from 'react';
import './App.css';

type Settings = {
  name: string;
  email: string;
  timezone: string;
  productUpdates: boolean;
  weeklyDigest: boolean;
};

type FieldErrors = Partial<Record<'name' | 'email', string>>;

const storageKey = 'northstar-settings';
const defaultSettings: Settings = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  timezone: 'America/Los_Angeles',
  productUpdates: true,
  weeklyDigest: false,
};

function readSavedSettings(): Settings {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return defaultSettings;

    const parsed: unknown = JSON.parse(stored);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'name' in parsed && typeof parsed.name === 'string' &&
      'email' in parsed && typeof parsed.email === 'string' &&
      'timezone' in parsed && typeof parsed.timezone === 'string' &&
      'productUpdates' in parsed && typeof parsed.productUpdates === 'boolean' &&
      'weeklyDigest' in parsed && typeof parsed.weeklyDigest === 'boolean'
    ) {
      return parsed as Settings;
    }
  } catch {
    return defaultSettings;
  }

  return defaultSettings;
}

function validateSettings(settings: Settings): FieldErrors {
  const errors: FieldErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedName = settings.name.trim();

  if (trimmedName.length < 2) {
    errors.name = 'Enter a name with at least 2 characters.';
  } else if (trimmedName.length > 60) {
    errors.name = 'Name must be 60 characters or fewer.';
  }

  if (!settings.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!emailPattern.test(settings.email.trim())) {
    errors.email = 'Enter a valid email address, like name@example.com.';
  }

  return errors;
}

function App() {
  const [savedSettings, setSavedSettings] = useState(readSavedSettings);
  const [settings, setSettings] = useState(savedSettings);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [messageTone, setMessageTone] = useState<'success' | 'error' | 'info'>('info');
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  function updateField<K extends keyof Settings>(field: K, value: Settings[K]) {
    const updated = { ...settings, [field]: value };
    setSettings(updated);
    setMessage('');
    setMessageTone('info');

    if (hasSubmitted && (field === 'name' || field === 'email')) {
      setErrors(validateSettings(updated));
    }
  }

  function handleFieldBlur(field: 'name' | 'email') {
    const nextErrors = validateSettings(settings);
    setErrors((current) => ({
      ...current,
      [field]: nextErrors[field],
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);
    const nextErrors = validateSettings(settings);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage('Please fix the highlighted fields before saving.');
      setMessageTone('error');
      return;
    }

    const cleanSettings = { ...settings, name: settings.name.trim(), email: settings.email.trim() };
    setSettings(cleanSettings);
    setSavedSettings(cleanSettings);
    try {
      localStorage.setItem(storageKey, JSON.stringify(cleanSettings));
      setMessage('Your settings have been saved.');
      setMessageTone('success');
    } catch {
      setMessage('Settings are updated for this session, but could not be saved on this device.');
      setMessageTone('error');
    }
  }

  function handleDiscard() {
    setSettings(savedSettings);
    setErrors({});
    setHasSubmitted(false);
    setMessage('Unsaved changes have been discarded.');
    setMessageTone('info');
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#settings" aria-label="Northstar home">
          <span className="brand-mark" aria-hidden="true">N</span>
          <span>northstar</span>
        </a>
        <div className="topbar-context"><span>Workspace</span><span className="context-divider">/</span><strong>Settings</strong></div>
        <button className="user-avatar" type="button" aria-label="Signed in as Alex Morgan">AM</button>
      </header>

      <div className="page-content" id="settings">
        <div className="page-heading">
          <div>
            <p className="eyebrow">YOUR SPACE</p>
            <h1>Settings</h1>
            <p className="heading-copy">Make Northstar work the way you do.</p>
          </div>
          <span className="sync-indicator"><span aria-hidden="true" /> Personal account</span>
        </div>

        <form className="settings-form" onSubmit={handleSubmit} noValidate>
          <section className="settings-section" aria-labelledby="profile-heading">
            <div className="section-intro">
              <p className="section-index">01 <span /></p>
              <h2 id="profile-heading">Profile</h2>
              <p>These details help your team know it’s you.</p>
            </div>
            <div className="section-fields">
              <div className="form-field">
                <label htmlFor="name">Full name <span className="required-mark">*</span></label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  maxLength={60}
                  value={settings.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  onBlur={() => handleFieldBlur('name')}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : 'name-hint'}
                />
                {errors.name ? <p className="field-error" id="name-error">{errors.name}</p> : <p className="field-hint" id="name-hint">This is how your name will appear to others.</p>}
              </div>

              <div className="form-field">
                <label htmlFor="email">Email address <span className="required-mark">*</span></label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={settings.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  onBlur={() => handleFieldBlur('email')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : 'email-hint'}
                />
                {errors.email ? <p className="field-error" id="email-error">{errors.email}</p> : <p className="field-hint" id="email-hint">Used for sign-in and important account updates.</p>}
              </div>

              <div className="form-field">
                <label htmlFor="timezone">Time zone</label>
                <select
                  id="timezone"
                  name="timezone"
                  value={settings.timezone}
                  onChange={(event) => updateField('timezone', event.target.value)}
                >
                  <option value="America/Los_Angeles">Pacific Time (US &amp; Canada)</option>
                  <option value="America/Denver">Mountain Time (US &amp; Canada)</option>
                  <option value="America/Chicago">Central Time (US &amp; Canada)</option>
                  <option value="America/New_York">Eastern Time (US &amp; Canada)</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Central European Time</option>
                  <option value="Asia/Kolkata">India Standard Time</option>
                  <option value="Asia/Tokyo">Japan Standard Time</option>
                  <option value="Australia/Sydney">Sydney</option>
                </select>
                <p className="field-hint">Dates and reminders are shown in this time zone.</p>
              </div>
            </div>
          </section>

          <section className="settings-section notifications-section" aria-labelledby="notifications-heading">
            <div className="section-intro">
              <p className="section-index">02 <span /></p>
              <h2 id="notifications-heading">Notifications</h2>
              <p>A little signal, never too much noise.</p>
            </div>
            <div className="section-fields notification-options">
              <label className="toggle-row" htmlFor="product-updates">
                <span className="toggle-copy"><strong>Product updates</strong><small>News about features and improvements.</small></span>
                <input
                  className="toggle-input"
                  id="product-updates"
                  type="checkbox"
                  checked={settings.productUpdates}
                  onChange={(event) => updateField('productUpdates', event.target.checked)}
                />
                <span className="toggle-control" aria-hidden="true" />
              </label>
              <label className="toggle-row" htmlFor="weekly-digest">
                <span className="toggle-copy"><strong>Weekly digest</strong><small>A Friday summary of your workspace activity.</small></span>
                <input
                  className="toggle-input"
                  id="weekly-digest"
                  type="checkbox"
                  checked={settings.weeklyDigest}
                  onChange={(event) => updateField('weeklyDigest', event.target.checked)}
                />
                <span className="toggle-control" aria-hidden="true" />
              </label>
            </div>
          </section>

          <footer className="form-actions">
            <p
              className={`save-message save-message--${messageTone}`}
              role={messageTone === 'error' ? 'alert' : 'status'}
              aria-live="polite"
            >
              {message}
            </p>
            <div className="action-buttons">
              <button className="discard-button" type="button" onClick={handleDiscard} disabled={!hasChanges}>Discard changes</button>
              <button className="save-button" type="submit"><span aria-hidden="true">✓</span> Save changes</button>
            </div>
          </footer>
        </form>
        <p className="page-footnote">Your account details are only visible to you and your workspace admins.</p>
      </div>
    </main>
  );
}

export default App;
