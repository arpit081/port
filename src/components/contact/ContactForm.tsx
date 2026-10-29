import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMagnetic } from '@/lib/useMagnetic';
import RollText from '../RollText';
import { burst } from '@/lib/burst';

const TO_EMAIL = 'arpitmishra1805@gmail.com';

/*
 * Delivery: with VITE_WEB3FORMS_KEY set (free key from web3forms.com, emailed
 * to you when you enter your address there; put it in .env.local), messages
 * post straight to your inbox and replying goes to the sender. Without a key
 * (or if the service is down) nothing is sent silently: the visitor gets a
 * hand-off screen with a pre-filled Gmail compose, their mail app, or copy.
 * The key is public by design; it can only mail you.
 */
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EASE = [0.25, 0.1, 0.25, 1] as const;

type Status = 'idle' | 'sending' | 'sent' | 'handoff';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const sendMagnet = useMagnetic<HTMLButtonElement>();
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);

  const subject = `Hello from ${name.trim()}`;
  const body = `${message.trim()}\n\n— ${name.trim()} (${email.trim()})`;
  const mailtoHref = `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${TO_EMAIL}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${TO_EMAIL}\nSubject: ${subject}\n\n${body}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard blocked: the other two options still work
    }
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    // Hidden field only bots fill in
    if ((form.elements.namedItem('botcheck') as HTMLInputElement | null)?.checked) return;

    if (!name.trim()) return setNote('Tell me your name first.');
    if (!EMAIL_RE.test(email.trim())) return setNote('That email looks off, so I won’t be able to reply.');
    if (!message.trim()) return setNote('You forgot the actual message.');
    setNote('');

    if (!WEB3FORMS_KEY) {
      setStatus('handoff');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New message from ${name.trim()} via your portfolio`,
          from_name: 'Portfolio · Say Hello',
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || 'Send failed');
      // Celebrate from the Send button before the form swaps to the thank-you
      const btn = form.querySelector('.hello-send')?.getBoundingClientRect();
      if (btn) burst(btn.left + btn.width / 2, btn.top + btn.height / 2);
      setStatus('sent');
    } catch {
      // Don't lose what they wrote: offer the manual routes instead
      setStatus('handoff');
    }
  };

  const reset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setNote('');
    setStatus('idle');
  };

  const edit = () => setStatus('idle');

  const firstName = name.trim().split(/\s+/)[0];

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === 'sent' ? (
        <motion.div
          key="sent"
          className="hello-sent"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <p className="hello-sent-title">Got it, {firstName} ✦</p>
          <p className="hello-sent-body">
            Your message just landed in my inbox. I’ll reply to {email.trim()} soon,
            usually faster than my code compiles.
          </p>
          <button type="button" className="hello-link-btn" onClick={reset}>
            Send another
          </button>
        </motion.div>
      ) : status === 'handoff' ? (
        <motion.div
          key="handoff"
          className="hello-sent"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <p className="hello-sent-title">One last step, {firstName}</p>
          <p className="hello-sent-body">
            {WEB3FORMS_KEY
              ? 'My inbox didn’t pick up just now. Your message is ready to go, pick how to send it:'
              : 'Your message is written and addressed to me. Pick how to send it:'}
          </p>
          <div className="hello-handoff">
            <a className="hello-send" href={gmailHref} target="_blank" rel="noopener noreferrer">
              <span>Open in Gmail</span>
              <span className="hello-send-arrow" aria-hidden="true">↗</span>
            </a>
            <a className="hello-chip" href={mailtoHref}>Open mail app</a>
            <button type="button" className={`hello-chip ${copied ? 'is-copied' : ''}`} onClick={copyMessage}>
              {copied ? 'Copied' : 'Copy message'}
            </button>
          </div>
          <button type="button" className="hello-link-btn" onClick={edit}>
            Edit message
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          className="hello-form"
          onSubmit={submit}
          noValidate
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <p className="hello-sentence">
            Hey Arpit, my name is{' '}
            <input
              aria-label="Your name"
              className="hello-input"
              style={{ width: `${Math.max(9, name.length + 2)}ch` }}
              placeholder="your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              maxLength={60}
            />{' '}
            and you can reach me at{' '}
            <input
              aria-label="Your email"
              type="email"
              className="hello-input"
              style={{ width: `${Math.max(14, email.length + 2)}ch` }}
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              maxLength={120}
            />
            . I wanted to say…
          </p>

          <textarea
            aria-label="Your message"
            className="hello-textarea"
            rows={4}
            placeholder="something nice, a job offer, a wild idea, or a song I should add to the player"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={4000}
          />

          <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="hello-actions">
            <button ref={sendMagnet} data-cursor-snap type="submit" className="hello-send magnetic" disabled={status === 'sending'}>
              <RollText>{status === 'sending' ? 'Sending…' : WEB3FORMS_KEY ? 'Send it' : 'Continue'}</RollText>
              <span className="hello-send-arrow" aria-hidden="true">↗</span>
            </button>
            <p className={`hello-note ${note ? 'is-error' : ''}`} role="status">
              {note || (WEB3FORMS_KEY ? 'Lands straight in my inbox.' : 'Next: pick Gmail, your mail app, or copy it.')}
            </p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
