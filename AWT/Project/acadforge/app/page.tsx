'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [inputStep, setInputStep] = useState<'email' | 'password'>('email');
  const [logs, setLogs] = useState<string[]>([]);
  const [postPasswordLogs, setPostPasswordLogs] = useState<string[]>([]); // New state for logs below password
  const router = useRouter();

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Boot sequence simulation
    const lines = [
      'ACADFORGE OS [Version 2.0.1]',
      '(c) AcadForge Corporation. All rights reserved.',
      '',
      'Initializing secure connection...',
      'Loading modules............ DONE',
      'Verifying integrity........ DONE',
      'Establishing link.......... DONE',
      '',
      'Welcome to AcadForge System.',
      'Please verify your credentials to continue.',
      ''
    ];

    let delay = 0;
    const timeouts: NodeJS.Timeout[] = [];

    lines.forEach((line, index) => {
      delay += Math.random() * 300 + 100;
      const timeoutId = setTimeout(() => {
        setBootLines(prev => [...prev, line]);
        window.scrollTo(0, document.body.scrollHeight);

        if (index === lines.length - 1) {
          const formTimeoutId = setTimeout(() => {
            setShowForm(true);
            setTimeout(() => emailInputRef.current?.focus(), 100);
          }, 500);
          timeouts.push(formTimeoutId);
        }
      }, delay);
      timeouts.push(timeoutId);
    });

    return () => {
      timeouts.forEach(clearTimeout);
      setBootLines([]);
    };
  }, []);

  const showError = (message: string, resetFull = false) => {
    setError(message);
    setTimeout(() => {
      setError(null);
      if (resetFull) {
        setInputStep('email');
        setEmail('');
        setPassword('');
        setLogs([]);
        setPostPasswordLogs([]);
        setTimeout(() => emailInputRef.current?.focus(), 50);
      } else {
        // For minor errors (like user not found), keep email, just refocus
        if (inputStep === 'email') {
          // Do nothing, let them edit email, but preserve cursor at end
          setTimeout(() => {
            if (emailInputRef.current) {
              const len = emailInputRef.current.value.length;
              emailInputRef.current.focus();
              emailInputRef.current.setSelectionRange(len, len);
            }
          }, 50);
        } else {
          // Password error -> clear password field
          setPassword('');
          setTimeout(() => passwordInputRef.current?.focus(), 50);
        }
      }
    }, 2000);
  };

  const handleEmailSubmit = async () => {
    if (!email.trim()) return;

    // Check for commands
    const command = email.trim().toLowerCase();
    if (command === 'register' || command === 'r') {
      setLogs(['> EXEC: REGISTER']);
      setTimeout(() => router.push('/register'), 500);
      return;
    }

    // Verify email exists
    setLoading(true);
    try {
      const res = await fetch('/api/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.exists) {
        // Email found, proceed to password
        setInputStep('password');
        // Simulated command line echo
        const commandLine = `$ acadforge@user: sudo su ${email}`;
        setLogs([commandLine]);
        setTimeout(() => passwordInputRef.current?.focus(), 50);
      } else {
        showError('User not found.'); // No resetFull, allows editing
      }
    } catch (err) {
      setLoading(false);
      showError('System error verifying user.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        await new Promise(r => setTimeout(r, 800));
        throw new Error(data.message || 'Access Denied');
      }

      // SUCCESS: Write to POST-password logs so it appears BELOW the input
      setPostPasswordLogs(['', 'Credentials verified.', 'ACCESS GRANTED.', 'Redirecting to dashboard...']);

      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      setLoading(false);
      showError(`Sorry, try again.`); // Standard cleanup
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: 'email' | 'password') => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (field === 'email') {
        handleEmailSubmit();
      } else if (field === 'password') {
        if (password.trim()) {
          handleSubmit(e);
        }
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-8 text-lg overflow-x-hidden w-full"
      onClick={() => {
        if (!loading) {
          if (inputStep === 'email') emailInputRef.current?.focus();
          else passwordInputRef.current?.focus();
        }
      }}
    >
      <style jsx global>{`
                ::selection {
                    background: #22c55e;
                    color: black;
                }
                .caret {
                    display: inline-block;
                    width: 10px;
                    height: 1.2em;
                    background-color: #22c55e;
                    animation: blink 1s step-end infinite;
                    vertical-align: text-bottom;
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                input {
                    caret-color: transparent;
                }
            `}</style>

      <div className="w-full max-w-none space-y-1">
        {bootLines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-words">{line}</div>
        ))}

        {showForm && (
          <div className="mt-4 space-y-2">
            {/* 
                            LOGIC CHANGE:
                            When inputStep is 'email': Show the email input field.
                            When inputStep is 'password': HIDE the email input field (replace it with the log) 
                            and show the password input field.
                         */}

            {/* Logs Display (Previous commands + Sudo Text) */}
            <div className="space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="whitespace-pre-wrap break-words">{log}</div>
              ))}
            </div>

            {/* Email Input Step */}
            {inputStep === 'email' && (
              <div className="flex flex-wrap items-center">
                <span className="mr-2 whitespace-nowrap text-blue-400">$ acadforge@user:</span>
                <div className="flex-1 relative min-w-[200px]">
                  <input
                    ref={emailInputRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'email')}
                    className="w-full bg-transparent border-none outline-none text-green-500 font-mono p-0"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    disabled={loading}
                    autoFocus
                  />
                  {!loading && (
                    <span
                      className="caret absolute pointer-events-none"
                      style={{ left: `${email.length}ch` }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Password Input Step */}
            {inputStep === 'password' && (
              <div className="flex flex-wrap items-center animate-in fade-in duration-300 mt-2">
                <span className="mr-2 whitespace-nowrap text-white">password for {email}:</span>
                <div className="flex-1 relative min-w-[200px]">
                  <input
                    ref={passwordInputRef}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'password')}
                    className="w-full bg-transparent border-none outline-none text-transparent font-mono p-0"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    disabled={loading}
                    autoFocus
                  />
                  {!loading && (
                    <span
                      className="caret absolute pointer-events-none"
                      style={{ left: `0ch` }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* POST-PASSWORD LOGS (Access Granted) - BOTTOM */}
            <div className="space-y-1 mt-2">
              {postPasswordLogs.map((log, i) => (
                <div key={i} className="whitespace-pre-wrap break-words text-green-500 animate-pulse">{log}</div>
              ))}
            </div>

            {error && (
              <div className="text-white mt-1">
                {error}
              </div>
            )}

            {!loading && inputStep === 'email' && (
              <div className="mt-16 text-sm opacity-50">
                <p className="mb-2 text-zinc-500">
                  [SYSTEM TIP]: Commands: <span className="text-green-400">register</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}