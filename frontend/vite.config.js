import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // for to port speed up frontend , run in terminal - npm run build , npx vite preview --host --port 5173
  // optimizeDeps: {
  //   include: ['react-icons', 'motion_react', 'axios'] // Force bundles these immediately
  // },
  // server: {
  //   host: '0.0.0.0',       // Tells Vite to listen to the tunnel proxy
  //   port: 5173,
  //   strictPort: true,
  //   allowedHosts: true,    // Fixes the 504 proxy timeout block
  //   cors: true,
  //   hmr:  process.env.VSCODE_TUNNEL_NAME || process.env.CODESPACES 
  //     ? {
  //         // ☁️ TUNNEL MODE: Active only when using VS Code tunnels
  //         protocol: 'wss',
  //         host: 'd19fhgxx-5173.inc1.devtunnels.ms',
  //         clientPort: 443,
  //       }
  //     : {
  //         // ⚡ LOCAL LIGHTNING MODE: Active for regular localhost coding
  //         protocol: 'ws',
  //         host: 'localhost',
  //       }
  // }
})
