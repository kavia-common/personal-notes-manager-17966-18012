import { component$ } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';
import type { Note } from '../../lib/api';

type Props = {
  note: Note;
  onEdit$: PropFunction<(note: Note) => void>;
  onDelete$: PropFunction<(note: Note) => void>;
};

// PUBLIC_INTERFACE
export default component$<Props>(({ note, onEdit$, onDelete$ }) => {
  return (
    <article class="card note-tile" style={{ padding: '1rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.5rem' }}>
        <h3 style={{ margin: 0, flex: 1 }}>{note.title || 'Untitled'}</h3>
        <button class="ghost" aria-label="Edit note" onClick$={() => onEdit$(note)}>✏️</button>
        <button class="ghost" aria-label="Delete note" onClick$={() => onDelete$(note)}>🗑️</button>
      </header>
      <p style={{ marginTop: 0, color: 'var(--text-secondary)' }}>
        {(note.content || '').slice(0, 200)}
        {note.content && note.content.length > 200 ? '…' : ''}
      </p>
      <footer style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap' }}>
        {note.tags?.map((t) => (
          <span class="badge" key={t}>#{t}</span>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '.75rem', color: 'var(--text-secondary)' }}>
          {new Date(note.updatedAt || note.createdAt).toLocaleString()}
        </span>
      </footer>
    </article>
  );
});
