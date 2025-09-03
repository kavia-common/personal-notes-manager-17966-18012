import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';
import type { NewNote, Note } from '../../lib/api';

type Props = {
  open: boolean;
  note?: Note | null;
  onClose$: PropFunction<() => void>;
  onSave$: PropFunction<(payload: NewNote, id?: string) => Promise<void>>;
};

// PUBLIC_INTERFACE
export default component$<Props>(({ open, note, onClose$, onSave$ }) => {
  const title = useSignal(note?.title || '');
  const content = useSignal(note?.content || '');
  const tags = useSignal((note?.tags || []).join(', '));

  useTask$(({ track }) => {
    track(() => note?.id);
    title.value = note?.title || '';
    content.value = note?.content || '';
    tags.value = (note?.tags || []).join(', ');
  });

  if (!open) return null as any;

  return (
    <div role="dialog" aria-modal="true" class="modal-backdrop" onClick$={(e) => {
      if (e.target === e.currentTarget) onClose$();
    }}>
      <div class="card" style={{ width: 'min(720px, 96vw)', padding: '1rem' }}>
        <h3 style={{ marginTop: 0 }}>{note ? 'Edit note' : 'New note'}</h3>
        <div style={{ display: 'grid', gap: '.75rem' }}>
          <input value={title.value} onInput$={(e, el) => (title.value = (el as HTMLInputElement).value)} placeholder="Title" />
          <textarea rows={8} value={content.value} onInput$={(e, el) => (content.value = (el as HTMLTextAreaElement).value)} placeholder="Write your note..." />
          <input value={tags.value} onInput$={(e, el) => (tags.value = (el as HTMLInputElement).value)} placeholder="Tags (comma separated)" />
        </div>
        <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'end', marginTop: '1rem' }}>
          <button class="ghost" onClick$={onClose$}>Cancel</button>
          <button class="primary" onClick$={async () => {
            const payload: NewNote = {
              title: title.value.trim(),
              content: content.value.trim(),
              tags: tags.value.split(',').map((s) => s.trim()).filter(Boolean),
            };
            await onSave$(payload, note?.id);
            onClose$();
          }}>
            Save
          </button>
        </div>
      </div>
      <style>
        {`.modal-backdrop{
            position: fixed; inset: 0; background: rgba(0,0,0,.3);
            display:flex; align-items:center; justify-content:center; padding:1rem; z-index:50;
          }`}
      </style>
    </div>
  );
});
