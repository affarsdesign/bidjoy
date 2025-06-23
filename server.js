// INSTANT_1750696669994
// IMMEDIATE_ACTIVATION_2025-06-23T16:37:49.994Z
/**
 * BidJoy Immediate Activation - No caching possible
 * Forces Render to serve fresh content immediately
 * Activation ID: INSTANT_1750696669994
 */

const express = require('express');
const app = express();

// Extreme anti-cache middleware
app.use((req, res, next) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36);
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
    'Pragma': 'no-cache',
    'Expires': '-1',
    'Last-Modified': new Date().toUTCString(),
    'ETag': `"${timestamp}-${random}"`,
    'Vary': '*',
    'X-Accel-Expires': '0',
    'X-Immediate-Activation': 'INSTANT_1750696669994',
    'X-Force-Fresh': timestamp,
    'X-No-Cache': 'true'
  });
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ultra-modern landing page with forced refresh
function getActivatedLandingPage() {
  const pageId = Date.now();
  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="immediate-activation" content="INSTANT_1750696669994">
  <meta name="page-id" content="${pageId}">
  <title>BidJoy - Sveriges Modernaste Auktionsplattform</title>
  <style>
    * { 
      margin: 0; 
      padding: 0; 
      box-sizing: border-box; 
    }
    
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
    }
    
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      z-index: -1;
    }
    
    .main-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
      z-index: 1;
    }
    
    .hero-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 4rem;
      box-shadow: 
        0 32px 64px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.2);
      text-align: center;
      max-width: 700px;
      width: 100%;
      position: relative;
      transform: translateY(0);
      animation: fadeInUp 0.8s ease-out;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .logo {
      font-size: 4rem;
      font-weight: 900;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 1.5rem;
      letter-spacing: -0.02em;
    }
    
    .tagline {
      font-size: 1.5rem;
      color: #64748b;
      margin-bottom: 3rem;
      line-height: 1.6;
      font-weight: 500;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      margin: 3rem 0;
    }
    
    .feature-card {
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      padding: 2rem;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
      position: relative;
    }
    
    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }
    
    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }
    
    .feature-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }
    
    .feature-desc {
      color: #64748b;
      font-size: 0.95rem;
      line-height: 1.5;
    }
    
    .cta-button {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      padding: 1.25rem 3rem;
      border: none;
      border-radius: 16px;
      font-size: 1.2rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
      box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
      margin-top: 2rem;
      position: relative;
      overflow: hidden;
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(59, 130, 246, 0.4);
    }
    
    .activation-indicator {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      background: rgba(16, 185, 129, 0.9);
      color: white;
      padding: 1rem;
      border-radius: 12px;
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      border: 2px solid #10b981;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      z-index: 1000;
    }
    
    @media (max-width: 768px) {
      .hero-card {
        padding: 2rem;
        margin: 1rem;
      }
      
      .logo {
        font-size: 3rem;
      }
      
      .tagline {
        font-size: 1.25rem;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }
  </style>
</head>
<body>
  <div class="main-container">
    <div class="hero-card">
      <h1 class="logo">BidJoy</h1>
      <p class="tagline">Sveriges modernaste auktionsplattform med SMS-budgivning och skandinavisk elegans</p>
      
      <div class="features-grid">
        <div class="feature-card">
          <span class="feature-icon">📱</span>
          <h3 class="feature-title">SMS Budgivning</h3>
          <p class="feature-desc">Buda enkelt via SMS med vårt avancerade system</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🎨</span>
          <h3 class="feature-title">Modern Design</h3>
          <p class="feature-desc">Skandinavisk elegans med professionell finish</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🔒</span>
          <h3 class="feature-title">Säker Betalning</h3>
          <p class="feature-desc">Trygg e-handel med Stripe integration</p>
        </div>
      </div>
      
      <a href="/login" class="cta-button">Kom igång med BidJoy</a>
    </div>
  </div>
  
  <div class="activation-indicator">
    ✅ IMMEDIATE ACTIVATION<br>
    ID: INSTANT_1750696669994<br>
    Time: 2025-06-23 16:37:49<br>
    Status: LIVE
  </div>
  
  <script>
    // Force immediate activation
    const activationId = 'INSTANT_1750696669994';
    const pageId = '${pageId}';
    
    // Clear all possible caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    // Force reload if old version
    const lastActivation = localStorage.getItem('bidjoy_activation');
    if (lastActivation !== activationId) {
      localStorage.setItem('bidjoy_activation', activationId);
      console.log('Immediate activation detected:', activationId);
    }
    
    // Disable service worker caching
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
      });
    }
    
    // Add timestamp to title for verification
    document.title += ' - Live: ' + new Date().toLocaleTimeString('sv-SE');
  </script>
</body>
</html>`;
}

app.get('/', (req, res) => {
  res.send(getActivatedLandingPage());
});

app.get('/login', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="immediate-activation" content="INSTANT_1750696669994">
  <title>Logga in - BidJoy</title>
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .login-container {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      padding: 3rem;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }
    .logo {
      text-align: center;
      font-size: 2.5rem;
      font-weight: 900;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 2rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
    }
    input[type="tel"] {
      width: 100%;
      padding: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }
    input[type="tel"]:focus {
      outline: none;
      border-color: #3b82f6;
    }
    .btn {
      width: 100%;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      padding: 1rem;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.3s;
    }
    .btn:hover {
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  <div class="login-container">
    <h1 class="logo">BidJoy</h1>
    <form action="/api/auth/send-code" method="POST">
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

app.post('/api/auth/send-code', (req, res) => {
  res.json({ success: true, message: 'Verifieringskod skickad' });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    activation: 'INSTANT_1750696669994',
    timestamp: new Date().toISOString(),
    swedishTime: new Date().toLocaleString('sv-SE'),
    forced: true
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`BidJoy Immediate Activation running on port ${PORT}`);
  console.log(`Activation ID: INSTANT_1750696669994`);
  console.log(`No caching possible - fresh content guaranteed`);
});