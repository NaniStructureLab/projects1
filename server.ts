/**
 * AffiniProt DL - Full-Stack Express Server with Vite Dev Middlewares
 * Runs on Port 3000 with scientific REST API routes.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { apiRouter } from './src/server/apiRoutes.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProduction = process.env.NODE_ENV === 'production';

  // Body parser with size limits
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API router
  app.use('/api', apiRouter);

  if (!isProduction) {
    // Development mode: mount Vite dev server middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log(`[AffiniProt-DL] Vite dev middleware mounted`);
  } else {
    // Production mode: serve built assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log(`[AffiniProt-DL] Serving production dist from ${distPath}`);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AffiniProt-DL] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[AffiniProt-DL] Fatal server boot failure:', err);
  process.exit(1);
});
