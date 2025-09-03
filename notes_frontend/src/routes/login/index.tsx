import { $, component$, useSignal } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { loginAction } from '../../lib/auth';

// PUBLIC_INTERFACE
export default component$(() => {
  const email = useSignal('');
  const password = useSignal('');
  const message = useSignal<string | null>(null);
  const loading = useSignal(false);

  const onSubmit = $(async () => {
    loading.value = true;
    const ok = await loginAction(email.value, password.value);
    loading.value = false;
    if (ok) {
      window.location.href = '/';
    } else {
      message.value = 'Invalid email or password';
    }
  });

  return (
    <div class="container" style={{ display: 'grid', placeItems: 'center', minHeight: 'calc(100dvh - var(--header-h))' }}>
      <div class="card" style={{ padding: '1rem', width: 'min(420px, 96vw)' }}>
        <h2 style={{ marginTop: 0 }}>Login</h2>
        <div style={{ display: 'grid', gap: '.75rem' }}>
          <input type="email" placeholder="Email" value={email.value} onInput$={(e, el) => (email.value = (el as HTMLInputElement).value)} />
          <input type="password" placeholder="Password" value={password.value} onInput$={(e, el) => (password.value = (el as HTMLInputElement).value)} />
          {message.value && <div class="badge" style={{ borderColor: '#f44336', color: '#f44336' }}>{message.value}</div>}
          <button class="primary" disabled={loading.value} onClick$={onSubmit}>
            {loading.value ? 'Logging in…' : 'Login'}
          </button>
          <a href="/register" style={{ color: 'var(--color-primary)', textAlign: 'center' }}>Create an account</a>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Login - Notes',
  meta: [{ name: 'description', content: 'Login to your notes' }],
};
