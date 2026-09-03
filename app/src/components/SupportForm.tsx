import { useState } from 'react';
import { SHEETS } from '../config/content';
import { color, radius } from '../styles/tokens';
import { haptic } from '../lib/telegram';
import { PrimaryCTA } from './PrimaryCTA';

const S = SHEETS.support;
const MIN_LENGTH = 5;

interface SupportFormProps {
  onDone: () => void;
}

/**
 * Support request form.
 *
 * There is no backend yet, so submitting only shows the success state —
 * the message is not delivered anywhere. Replace `submit` with a real
 * API call before relying on this in production.
 */
export function SupportForm({ onDone }: SupportFormProps) {
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = () => {
    if (text.trim().length < MIN_LENGTH) {
      setError(S.tooShort);
      return;
    }
    setError('');
    haptic('medium');
    // TODO: POST to the support endpoint once a backend exists.
    setSent(true);
  };

  if (sent) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          paddingBottom: 4,
          flex: '1 1 auto',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            background: color.burgundy,
            color: color.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
          }}
        >
          ✓
        </div>
        <div style={{ fontSize: 17, fontWeight: 700 }}>{S.sentTitle}</div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, color: color.inkSoft }}>
          {S.sentBody}
        </p>
        <div style={{ flex: '1 1 auto', minHeight: 8 }} />
        <PrimaryCTA label={S.sentCta} onClick={onDone} variant="burgundy" height={50} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        paddingBottom: 4,
        flex: '1 1 auto',
      }}
    >
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, color: color.inkSoft }}>{S.body}</p>

      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (error) setError('');
        }}
        placeholder={S.placeholder}
        rows={5}
        style={{
          width: '100%',
          flex: '1 1 auto',
          minHeight: 120,
          resize: 'none',
          font: 'inherit',
          fontSize: 15,
          lineHeight: 1.45,
          color: color.ink,
          background: color.surface,
          border: `1px solid ${error ? color.burgundy : 'rgba(12,11,13,0.08)'}`,
          borderRadius: radius.md,
          padding: 14,
          outline: 'none',
        }}
      />

      {error && (
        <span style={{ fontSize: 13, fontWeight: 600, color: color.burgundy }}>{error}</span>
      )}

      <PrimaryCTA label={S.submit} onClick={submit} variant="burgundy" height={50} />
    </div>
  );
}
