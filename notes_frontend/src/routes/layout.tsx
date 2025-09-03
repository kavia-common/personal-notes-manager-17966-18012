import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import styles from "./styles.css?inline";
import Header from "../components/ui/Header";
import { useAuthProvider } from "../lib/auth";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  });
};

// PUBLIC_INTERFACE
export default component$(() => {
  useStyles$(styles);
  // Provide Auth store at layout level
  useAuthProvider();

  return (
    <div>
      <Header />
      <div class="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'var(--sidebar-w) 1fr', gap: '1rem' }}>
          <div class="sidebar-wrap" style={{ display: 'none' }}>
            {/* mobile placeholder, sidebar in index route for data-driven tags */}
          </div>
          <main style={{ paddingBlock: '1rem' }}>
            <Slot />
          </main>
        </div>
      </div>
    </div>
  );
});
