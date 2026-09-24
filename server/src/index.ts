import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[LexiGuard AI] Server running on http://localhost:${PORT}`);
  console.log(`[LexiGuard AI] Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[LexiGuard AI] AI Provider: ${process.env.AI_PROVIDER || 'mock'}`);

  // Automated 45-second keep-alive for Render Free Tier
  if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    const RENDER_URL = 'https://lexiguard-z6d5.onrender.com';
    console.log(`[LexiGuard AI] Starting 45-second keep-alive bot for ${RENDER_URL}...`);
    
    setInterval(() => {
      fetch(`${RENDER_URL}/api/health`)
        .then(res => console.log(`[Keep-Alive Bot] Pinged Render successfully at ${new Date().toISOString()} (Status: ${res.status})`))
        .catch(err => console.error(`[Keep-Alive Bot] Ping failed:`, err.message));
    }, 45000); // 45 seconds
  }
});
