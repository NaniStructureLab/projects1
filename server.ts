import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { apiRouter } from './src/server/apiRoutes.ts';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json({ limit: '4mb' }));
app.get('/health', (_req, res) => res.json({ status: 'healthy' }));
app.use('/api', apiRouter);

// Only run our own server/static hosting when NOT on Vercel
if (!process.env.VERCEL) {
  (async () => {
    const PORT = parseInt(process.env.PORT || '3000', 10);
    const distPath = path.resolve(__dirname, 'dist');
    const isProduction =
      process.env.NODE_ENV === 'production' ||
      fs.existsSync(path.join(distPath, 'index.html'));

    if (!isProduction) {
      const { createServer } = await import('vite');
      const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
      app.use(vite.middlewares);
    } else {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
    }
    app.listen(PORT, '0.0.0.0', () => console.log(`Running on ${PORT}`));
  })();
}

export default app;
