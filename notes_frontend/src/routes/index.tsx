import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { api, type Note, type NewNote } from "../lib/api";
import NoteCard from "../components/notes/NoteCard";
import NoteModal from "../components/notes/NoteModal";
import Sidebar from "../components/ui/Sidebar";

// PUBLIC_INTERFACE
export default component$(() => {
  const notes = useSignal<Note[]>([]);
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const query = useSignal('');
  const activeTag = useSignal<string | undefined>(undefined);
  const tags = useSignal<string[]>([]);
  const modalOpen = useSignal(false);
  const editing = useSignal<Note | null>(null);

  const runRefresh = $(async () => {
    loading.value = true;
    error.value = null;
    const res = await api.listNotes(query.value || undefined, activeTag.value || undefined);
    if (res.ok && res.data) {
      notes.value = res.data;
      const tagSet = new Set<string>();
      res.data.forEach(n => (n.tags || []).forEach(t => tagSet.add(t)));
      tags.value = Array.from(tagSet).sort();
    } else {
      error.value = res.error || 'Failed to load notes';
    }
    loading.value = false;
  });

  // Run initial fetch on mount
  useVisibleTask$(async () => {
    await runRefresh();
  });

  const onSearch = $(async () => {
    await runRefresh();
  });

  const onSelectTag = $(async (t?: string) => {
    activeTag.value = t;
    await runRefresh();
  });

  const onCreate = $(() => {
    editing.value = null;
    modalOpen.value = true;
  });

  const onEdit = $((n: Note) => {
    editing.value = n;
    modalOpen.value = true;
  });

  const onDelete = $(async (n: Note) => {
    if (confirm(`Delete note "${n.title}"?`)) {
      await api.deleteNote(n.id);
      await runRefresh();
    }
  });

  const onSave = $(async (payload: NewNote, id?: string) => {
    if (id) {
      await api.updateNote(id, payload);
    } else {
      await api.createNote(payload);
    }
    await runRefresh();
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'var(--sidebar-w) 1fr', gap: '1rem' }}>
      <div class="sidebar-col" style={{ display: 'none' }}>
        {/* Hidden on very small screens by default styling; could add a toggle */}
      </div>
      <Sidebar tags={tags.value} activeTag={activeTag.value} onSelectTag$={onSelectTag} />
      <section style={{ display: 'grid', gap: '1rem' }}>
        <div class="card" style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <input
            placeholder="Search notes..."
            value={query.value}
            onInput$={(e, el) => (query.value = (el as HTMLInputElement).value)}
          />
          <button class="ghost" onClick$={onSearch}>Search</button>
          <div style={{ marginLeft: 'auto' }}>
            <button class="primary" onClick$={onCreate}>+ New note</button>
          </div>
        </div>

        {error.value && (
          <div class="card" style={{ padding: '1rem', borderColor: '#f44336' }}>
            <strong style={{ color: '#f44336' }}>Error:</strong> {error.value}
          </div>
        )}

        {loading.value ? (
          <div class="card" style={{ padding: '1rem' }}>Loading…</div>
        ) : (
          <div class="grid notes">
            {notes.value.map((n) => (
              <NoteCard key={n.id} note={n} onEdit$={onEdit} onDelete$={onDelete} />
            ))}
            {notes.value.length === 0 && (
              <div class="card" style={{ padding: '1rem' }}>No notes yet. Create your first note!</div>
            )}
          </div>
        )}
      </section>

      <NoteModal open={modalOpen.value} note={editing.value} onClose$={() => (modalOpen.value = false)} onSave$={onSave} />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Notes",
  meta: [
    {
      name: "description",
      content: "Personal notes manager",
    },
  ],
};
