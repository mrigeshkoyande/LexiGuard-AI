import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[LexiGuard AI] Server running on http://localhost:${PORT}`);
  console.log(`[LexiGuard AI] Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[LexiGuard AI] AI Provider: ${process.env.AI_PROVIDER || 'mock'}`);
});
