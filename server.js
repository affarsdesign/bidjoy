// CACHE_BUSTER_1750694908203
// FORCE_DEPLOY_d6lui7sxeq5
/**
 * BidJoy Production Server - Cache Busting Deploy 2025-06-23T16:08:28.203Z
 * Forced rebuild to bypass Render caching issues
 * Build: d6lui7sxeq5 | Timestamp: 1750694908203
 */

const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();

// Aggressive cache prevention
app.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
    'X-Cache-Buster': '1750694908203',
    'X-Force-Deploy': 'd6lui7sxeq5',
    'X-Timestamp': new Date().toISOString()
  });
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Modern landing page with cache busting
function getLandingPageHTML() {
  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="cache-buster" content="1750694908203">
  <meta name="build-id" content="d6lui7sxeq5">
  <title>BidJoy - Sveriges Moderna Auktionsplattform</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      color: #333;
    }
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
    }
    .hero-content {
      background: rgba(255, 255, 255, 0.95);
      padding: 3rem;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      backdrop-filter: blur(10px);
    }
    .logo {
      font-size: 3rem;
      font-weight: 800;
      color: #2563eb;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }
    .tagline {
      font-size: 1.25rem;
      color: #64748b;
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    .cta-button {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      padding: 1rem 2rem;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 3rem;
    }
    .feature {
      text-align: center;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 12px;
      backdrop-filter: blur(5px);
    }
    .feature-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    .cache-info {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 0.5rem;
      border-radius: 8px;
      font-size: 0.8rem;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="hero">
    <div class="hero-content">
      <h1 class="logo">BidJoy</h1>
      <p class="tagline">Sveriges modernaste auktionsplattform med SMS-budgivning och professionell design</p>
      <a href="/login" class="cta-button">Kom igång med BidJoy</a>
      
      <div class="features">
        <div class="feature">
          <div class="feature-icon">📱</div>
          <h3>SMS Budgivning</h3>
          <p>Buda enkelt via SMS</p>
        </div>
        <div class="feature">
          <div class="feature-icon">🎨</div>
          <h3>Modern Design</h3>
          <p>Skandinavisk elegans</p>
        </div>
        <div class="feature">
          <div class="feature-icon">🔒</div>
          <h3>Säker Betalning</h3>
          <p>Trygg e-handel</p>
        </div>
      </div>
    </div>
  </div>
  
  <div class="cache-info">
    Build: d6lui7sxeq5 | 2025-06-23 16:08:28
  </div>
  
  <script>
    // Force page reload if old version detected
    const currentBuild = 'd6lui7sxeq5';
    const lastBuild = localStorage.getItem('bidjoy_build');
    if (lastBuild && lastBuild !== currentBuild) {
      localStorage.setItem('bidjoy_build', currentBuild);
      window.location.reload(true);
    } else {
      localStorage.setItem('bidjoy_build', currentBuild);
    }
  </script>
</body>
</html>`;
}

// Routes
app.get('/', (req, res) => {
  res.send(getLandingPageHTML());
});

app.get('/login', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="cache-buster" content="1750694908203">
  <title>Logga in - BidJoy</title>
  <style>
    body { font-family: 'Inter', sans-serif; background: #f8fafc; margin: 0; }
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .login-form {
      background: white;
      padding: 3rem;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }
    .logo { text-align: center; font-size: 2rem; color: #2563eb; margin-bottom: 2rem; }
    .form-group { margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    input[type="tel"] {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
    }
    .btn {
      width: 100%;
      background: #3b82f6;
      color: white;
      padding: 0.75rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s;
    }
    .btn:hover { background: #2563eb; }
  </style>
</head>
<body>
  <div class="login-container">
    <form class="login-form" action="/api/auth/send-code" method="POST">
      <h1 class="logo">BidJoy</h1>
      <div class="form-group">
        <label for="phone">Telefonnummer:</label>
        <input type="tel" id="phone" name="phone" placeholder="+46 70 123 45 67" required>
      </div>
      <button type="submit" class="btn">Skicka verifieringskod</button>
    </form>
  </div>
</body>
</html>`);
});

// API endpoints
app.post('/api/auth/send-code', async (req, res) => {
  const { phone } = req.body;
  // SMS sending logic would go here
  res.json({ success: true, message: 'Verifieringskod skickad' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    build: 'd6lui7sxeq5',
    cacheBuster: '1750694908203'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`BidJoy server running on port ${PORT}`);
  console.log(`Build ID: d6lui7sxeq5`);
  console.log(`Cache Buster: 1750694908203`);
});