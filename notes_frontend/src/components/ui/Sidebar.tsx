import { component$ } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

type Props = {
  tags: string[];
  activeTag?: string;
  onSelectTag$: PropFunction<(tag?: string) => void>;
};

// PUBLIC_INTERFACE
export default component$<Props>(({ tags, activeTag, onSelectTag$ }) => {
  return (
    <aside class="card" style={{ width: 'var(--sidebar-w)', padding: '1rem', height: 'calc(100dvh - var(--header-h) - 2rem)', position: 'sticky', top: 'calc(var(--header-h) + 1rem)' }}>
      <h3 style={{ marginTop: 0, color: 'var(--text-secondary)', fontWeight: 600 }}>Tags</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button class={`ghost ${!activeTag ? 'active' : ''}`} onClick$={() => onSelectTag$(undefined)}>
          All notes
        </button>
        {tags.map((t) => (
          <button
            key={t}
            class={`ghost ${activeTag === t ? 'active' : ''}`}
            onClick$={() => onSelectTag$(t)}
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <span>#{t}</span>
          </button>
        ))}
      </div>
      <style>
        {`.ghost.active{color:var(--color-primary);font-weight:600;background:var(--focus);border-color:transparent;}`}
      </style>
    </aside>
  );
});
