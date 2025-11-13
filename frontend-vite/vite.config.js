import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ Configurazione aggiornata per supportare React Router
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    // 👇 Questa opzione è fondamentale: riscrive tutte le rotte verso index.html
    historyApiFallback: true,
  },
});
