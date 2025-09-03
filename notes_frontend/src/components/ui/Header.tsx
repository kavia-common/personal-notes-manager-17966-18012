import { component$, $, useSignal } from '@builder.io/qwik';
import { useAuth, logoutAction } from '../../lib/auth';

// PUBLIC_INTERFACE
export default component$(() => {
  /** Top navigation header with app title and auth controls */
  const auth = useAuth();
  const menuOpen = useSignal(false);

  const onLogout = $(async () => {
    await logoutAction();
  });

  return (
    <header style={{ height: 'var(--header-h)' }} class="card"
      aria-label="Header"
    >
      <div class="container" style={{ display: 'flex', alignItems: 'center', height: '100%', gap: '1rem' }}>
        <button class="ghost" aria-label="Toggle sidebar" onClick$={() => (menuOpen.value = !menuOpen.value)}>
          ☰
        </button>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <span style={{
            width: '28px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '8px', background: 'var(--color-primary)', color: '#fff'
          }}>N</span>
          <span>Notes</span>
        </a>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {auth.user ? (
            <>
              <span class="badge" aria-label="current-user">{auth.user.email}</span>
              <button class="ghost" onClick$={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <a href="/login"><button class="ghost">Login</button></a>
              <a href="/register"><button class="primary">Register</button></a>
            </>
          )}
        </div>
      </div>
    </header>
  );
});
