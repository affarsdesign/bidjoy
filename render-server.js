/**
 * BidJoy Themed Server - Complete integration with Scandinavian design system
 * Combines Nova Auth, CMS capabilities, and unified theming
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 10000;
const CACHE_BUSTER = Date.now() + Math.random();

app.use(express.json());

// Aggressive cache busting middleware
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('ETag', `"${CACHE_BUSTER}"`);
  res.setHeader('Last-Modified', new Date().toUTCString());
  res.setHeader('X-Cache-Buster', CACHE_BUSTER);
  next();
});

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const JWT_SECRET = process.env.JWT_SECRET || 'bidjoy-nova-auth-secret-key';

// BidJoy Theme System
const bidJoyTheme = {
  colors: {
    primary: '#0055A5',
    primaryHover: '#004891',
    background: '#F8F9FA',
    text: '#111111',
    textSecondary: '#5F6368',
    textMuted: '#80868B',
    border: '#E0E0E0',
    success: '#1B5E20',
    warning: '#E65100',
    error: '#C62828',
  },
  css: `
    :root {
      --bidjoy-primary: #0055A5;
      --bidjoy-primary-hover: #004891;
      --bidjoy-background: #F8F9FA;
      --bidjoy-text: #111111;
      --bidjoy-text-secondary: #5F6368;
      --bidjoy-text-muted: #80868B;
      --bidjoy-border: #E0E0E0;
      --bidjoy-success: #1B5E20;
      --bidjoy-warning: #E65100;
      --bidjoy-error: #C62828;
      --bidjoy-shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      --bidjoy-shadow-hover: 0 8px 16px -4px rgba(0, 85, 165, 0.15), 0 4px 8px -2px rgba(0, 85, 165, 0.08);
      --bidjoy-transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      --bidjoy-radius: 0.5rem;
      --bidjoy-font: 'Inter', system-ui, -apple-system, sans-serif;
    }

    * { box-sizing: border-box; }
    
    body {
      margin: 0;
      font-family: var(--bidjoy-font);
      background: var(--bidjoy-background);
      color: var(--bidjoy-text);
      line-height: 1.5;
    }

    .bidjoy-container {
      max-width: 1140px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .bidjoy-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 1rem;
    }

    .bidjoy-card {
      background: #FFFFFF;
      border: 1px solid var(--bidjoy-border);
      border-radius: var(--bidjoy-radius);
      padding: 1.5rem;
      box-shadow: var(--bidjoy-shadow-base);
      transition: var(--bidjoy-transition);
    }

    .bidjoy-card:hover {
      box-shadow: var(--bidjoy-shadow-hover);
    }

    .bidjoy-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1.5rem;
      border-radius: var(--bidjoy-radius);
      font-size: 1rem;
      font-weight: 500;
      font-family: var(--bidjoy-font);
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: var(--bidjoy-transition);
      min-height: 44px;
    }

    .bidjoy-btn-primary {
      background-color: var(--bidjoy-primary);
      color: #FFFFFF;
      box-shadow: var(--bidjoy-shadow-base);
    }

    .bidjoy-btn-primary:hover {
      background-color: var(--bidjoy-primary-hover);
      box-shadow: var(--bidjoy-shadow-hover);
    }

    .bidjoy-btn-secondary {
      background-color: #FFFFFF;
      color: var(--bidjoy-primary);
      border: 1px solid var(--bidjoy-border);
    }

    .bidjoy-btn-secondary:hover {
      background-color: var(--bidjoy-background);
      border-color: var(--bidjoy-primary);
    }

    .bidjoy-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--bidjoy-border);
      border-radius: var(--bidjoy-radius);
      font-size: 1rem;
      font-family: var(--bidjoy-font);
      color: var(--bidjoy-text);
      background: #FFFFFF;
      transition: var(--bidjoy-transition);
      min-height: 44px;
    }

    .bidjoy-input:focus {
      outline: none;
      border-color: var(--bidjoy-primary);
      box-shadow: 0 0 0 3px rgba(0, 85, 165, 0.1);
    }

    .bidjoy-nav {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--bidjoy-border);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--bidjoy-primary);
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-link {
      color: var(--bidjoy-text);
      text-decoration: none;
      font-weight: 500;
      transition: var(--bidjoy-transition);
    }

    .nav-link:hover {
      color: var(--bidjoy-primary);
    }

    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 4rem 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
    }

    .hero-content {
      grid-column: span 6;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .hero-visual {
      grid-column: span 6;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-title {
      font-size: clamp(3rem, 8vw, 4.5rem);
      font-weight: 900;
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.1;
      margin: 0 0 1.5rem 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .hero-description {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
      margin: 0 0 2.5rem 0;
      line-height: 1.6;
      font-weight: 500;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .admin-layout {
      display: flex;
      min-height: 100vh;
      background: var(--bidjoy-background);
    }

    .admin-sidebar {
      width: 280px;
      background: #FFFFFF;
      border-right: 1px solid var(--bidjoy-border);
      padding: 1.5rem;
    }

    .admin-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .admin-header {
      background: #FFFFFF;
      border-bottom: 1px solid var(--bidjoy-border);
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .admin-content {
      flex: 1;
      padding: 2rem;
    }

    .sidebar-nav {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .sidebar-nav li {
      margin-bottom: 0.5rem;
    }

    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: var(--bidjoy-radius);
      color: var(--bidjoy-text-secondary);
      text-decoration: none;
      transition: var(--bidjoy-transition);
    }

    .sidebar-nav a:hover {
      background: var(--bidjoy-background);
      color: var(--bidjoy-text);
    }

    .sidebar-nav a.active {
      background: var(--bidjoy-primary);
      color: #FFFFFF;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: #FFFFFF;
      border-radius: 12px;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
      border: none;
      animation: modalSlideIn 0.3s ease-out;
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* HubSpot-inspired lead form styling */
    .hubspot-form {
      background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .hubspot-form h3 {
      color: #2d3748;
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      text-align: center;
    }

    .hubspot-form .subtitle {
      color: #718096;
      font-size: 1rem;
      text-align: center;
      margin-bottom: 2rem;
      line-height: 1.5;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .form-input {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 6px;
      font-size: 1rem;
      transition: all 0.2s ease;
      background: #ffffff;
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--bidjoy-primary);
      box-shadow: 0 0 0 3px rgba(0, 85, 165, 0.1);
      transform: translateY(-1px);
    }

    .form-select {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 6px;
      font-size: 1rem;
      background: #ffffff;
      cursor: pointer;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }

    .form-select:focus {
      outline: none;
      border-color: var(--bidjoy-primary);
      box-shadow: 0 0 0 3px rgba(0, 85, 165, 0.1);
    }

    .form-textarea {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 6px;
      font-size: 1rem;
      min-height: 100px;
      resize: vertical;
      font-family: inherit;
      transition: all 0.2s ease;
      background: #ffffff;
      box-sizing: border-box;
    }

    .form-textarea:focus {
      outline: none;
      border-color: var(--bidjoy-primary);
      box-shadow: 0 0 0 3px rgba(0, 85, 165, 0.1);
    }

    .hubspot-cta {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
    }

    .hubspot-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
      background: linear-gradient(135deg, #f7931e 0%, #ff6b35 100%);
    }

    .trust-indicators {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
    }

    .trust-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #718096;
      font-size: 0.875rem;
    }

    .form-disclaimer {
      text-align: center;
      color: #a0aec0;
      font-size: 0.75rem;
      margin-top: 1rem;
      line-height: 1.4;
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--bidjoy-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      margin: 0;
      color: var(--bidjoy-text);
      font-size: 1.25rem;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--bidjoy-text-secondary);
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: var(--bidjoy-transition);
    }

    .modal-close:hover {
      background: var(--bidjoy-background);
      color: var(--bidjoy-text);
    }

    .modal-body {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--bidjoy-text);
      font-weight: 500;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: #FFFFFF;
      padding: 1.5rem;
      border-radius: var(--bidjoy-radius);
      border: 1px solid var(--bidjoy-border);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--bidjoy-primary);
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: var(--bidjoy-text-secondary);
      font-size: 0.875rem;
    }

    .auction-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .auction-card {
      background: #FFFFFF;
      border-radius: var(--bidjoy-radius);
      overflow: hidden;
      border: 1px solid var(--bidjoy-border);
      transition: var(--bidjoy-transition);
    }

    .auction-card:hover {
      box-shadow: var(--bidjoy-shadow-hover);
    }

    .auction-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .auction-content {
      padding: 1.5rem;
    }

    .auction-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
    }

    .auction-description {
      color: var(--bidjoy-text-secondary);
      margin: 0 0 1rem 0;
      line-height: 1.5;
    }

    .auction-stats {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }

    .current-bid {
      font-weight: 700;
      color: var(--bidjoy-primary);
    }

    .login-form {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      background: #FFFFFF;
      border-radius: var(--bidjoy-radius);
      border: 1px solid var(--bidjoy-border);
      box-shadow: var(--bidjoy-shadow-base);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--bidjoy-text);
    }

    .form-error {
      color: var(--bidjoy-error);
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    .form-success {
      color: var(--bidjoy-success);
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    @media (max-width: 768px) {
      .hero-content, .hero-visual {
        grid-column: span 12;
      }
      .hero-section {
        text-align: center;
        padding: 2rem 0;
      }
      .bidjoy-container {
        padding: 0 1rem;
      }
      .admin-layout {
        flex-direction: column;
      }
      .admin-sidebar {
        width: 100%;
        order: 2;
      }
      .nav-links {
        display: none;
      }
    }
  `
};

// Nova Auth integration (from previous implementation)
class NovaAuth {
  generateVerificationCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async sendSMS(phone, message) {
    try {
      const username = process.env.CELLSYNT_USERNAME;
      const password = process.env.CELLSYNT_PASSWORD;
      
      if (!username || !password) {
        console.error('Cellsynt credentials missing');
        return false;
      }

      // Ensure proper UTF-8 encoding for Swedish characters (åäö)
      const encodedMessage = Buffer.from(message, 'utf8').toString('utf8');

      const params = new URLSearchParams({
        username,
        password,
        destination: phone,
        text: encodedMessage,
        originator: '46730122022',
        charset: 'UTF-8'
      });

      const response = await fetch('https://se-1.cellsynt.net/sms.php', {
        method: 'POST',
        body: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      });

      const result = await response.text();
      console.log(`SMS sent to ${phone}: ${result}`);
      return result.includes('OK');
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
  }

  async createOrGetUser(phone, userType = 'bidder') {
    try {
      const existingUser = await pool.query(
        'SELECT * FROM users WHERE phone = $1 LIMIT 1',
        [phone]
      );

      if (existingUser.rows.length > 0) {
        await pool.query(
          'UPDATE users SET last_login_at = NOW() WHERE id = $1',
          [existingUser.rows[0].id]
        );
        return existingUser.rows[0];
      }

      const newUser = await pool.query(`
        INSERT INTO users (phone, user_type, subscription_tier, account_status, is_verified, created_at, updated_at)
        VALUES ($1, $2, $3, 'active', false, NOW(), NOW())
        RETURNING *
      `, [
        phone,
        userType,
        userType === 'bidder' ? 'free' : 'enterprise'
      ]);

      return newUser.rows[0];
    } catch (error) {
      console.error('User creation error:', error);
      return null;
    }
  }

  generateToken(user, isImpersonating = false, originalUserId = null) {
    const payload = {
      id: user.id,
      phone: user.phone,
      userType: user.user_type,
      subscriptionTier: user.subscription_tier,
      accountStatus: user.account_status,
      isImpersonating,
      originalUserId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    };

    return jwt.sign(payload, JWT_SECRET);
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  async createSession(userId, token) {
    try {
      await pool.query(
        'INSERT INTO auth_sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [userId, token, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
      );
    } catch (error) {
      console.error('Session creation error:', error);
    }
  }

  async storeVerificationCode(phone, code) {
    try {
      await pool.query(
        'INSERT INTO verification_codes (phone, code, expires_at) VALUES ($1, $2, $3)',
        [phone, code, new Date(Date.now() + 5 * 60 * 1000)] // 5 minutes
      );
    } catch (error) {
      console.error('Code storage error:', error);
    }
  }

  async verifyCode(phone, code) {
    try {
      const result = await pool.query(
        'SELECT * FROM verification_codes WHERE phone = $1 AND code = $2 AND expires_at > NOW() AND is_used = false ORDER BY created_at DESC LIMIT 1',
        [phone, code]
      );

      if (result.rows.length > 0) {
        await pool.query(
          'UPDATE verification_codes SET is_used = true WHERE id = $1',
          [result.rows[0].id]
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Code verification error:', error);
      return false;
    }
  }

  requireAuth(allowedRoles = []) {
    return async (req, res, next) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.substring(7);
        const decoded = this.verifyToken(token);

        if (!decoded) {
          return res.status(401).json({ error: 'Invalid token' });
        }

        const user = await pool.query(
          'SELECT * FROM users WHERE id = $1 LIMIT 1',
          [decoded.id]
        );

        if (user.rows.length === 0 || user.rows[0].account_status !== 'active') {
          return res.status(401).json({ error: 'User not found or inactive' });
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.userType)) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }

        req.user = decoded;
        next();
      } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Authentication error' });
      }
    };
  }
}

const novaAuth = new NovaAuth();

// Page generation functions
function getLandingPageHTML() {
  return `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BidJoy - Sveriges mest avancerade auktionsplattform</title>
  <meta name="description" content="Revolutionerande auktionsplattform med SMS-budgivning och Scandinavisk design">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <meta name="cache-buster" content="${CACHE_BUSTER}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
  <style>${bidJoyTheme.css}</style>
</head>
<body>
  <nav class="bidjoy-nav">
    <div class="bidjoy-container">
      <div class="nav-content">
        <a href="/" class="nav-logo">BidJoy</a>
        <ul class="nav-links">
          <li><a href="/" class="nav-link">Hem</a></li>
          <li><a href="#features" class="nav-link">Funktioner</a></li>
          <li><a href="#about" class="nav-link">Om oss</a></li>
          <li><a href="#contact" class="nav-link">Kontakt</a></li>
        </ul>
        <div class="nav-actions">
          <button onclick="openLeadForm()" class="bidjoy-btn bidjoy-btn-primary">Kom igång</button>
        </div>
      </div>
    </div>
  </nav>

  <section class="hero-section">
    <div class="bidjoy-container">
      <div class="bidjoy-grid">
        <div class="hero-content">
          <h1 class="hero-title">Sveriges Modernaste Auktionsplattform</h1>
          <p class="hero-description">
            BidJoy revolutionerar auktionsbranschen med SMS-budgivning, realtidsuppdateringar och Scandinavisk design. 
            Upplev framtidens auktioner idag.
          </p>
          <div class="hero-actions">
            <button onclick="openLeadForm()" class="hubspot-cta" style="margin-right: 1rem; width: auto; display: inline-block;">Kom igång nu - helt gratis!</button>
            <a href="#features" class="bidjoy-btn bidjoy-btn-secondary">Läs mer</a>
          </div>
        </div>
        <div class="hero-visual">
          <div style="width: 400px; height: 300px; background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(20px); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 700; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);">
            🔨 BidJoy Demo
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="features" style="padding: 4rem 0;">
    <div class="bidjoy-container">
      <h2 style="text-align: center; font-size: 2rem; margin-bottom: 3rem;">Varför välja BidJoy?</h2>
      <div class="bidjoy-grid">
        <div style="grid-column: span 4;">
          <div class="bidjoy-card" style="text-align: center; height: 100%;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📱</div>
            <h3 style="margin: 0 0 1rem 0; font-size: 1.25rem;">SMS-budgivning</h3>
            <p style="margin: 0; color: var(--bidjoy-text-secondary);">
              Lägg bud enkelt via SMS från vilken telefon som helst. Ingen app krävs.
            </p>
          </div>
        </div>
        <div style="grid-column: span 4;">
          <div class="bidjoy-card" style="text-align: center; height: 100%;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⚡</div>
            <h3 style="margin: 0 0 1rem 0; font-size: 1.25rem;">Realtid</h3>
            <p style="margin: 0; color: var(--bidjoy-text-secondary);">
              Få uppdateringar i realtid och missa aldrig ett viktigt bud.
            </p>
          </div>
        </div>
        <div style="grid-column: span 4;">
          <div class="bidjoy-card" style="text-align: center; height: 100%;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🔒</div>
            <h3 style="margin: 0 0 1rem 0; font-size: 1.25rem;">Säkerhet</h3>
            <p style="margin: 0; color: var(--bidjoy-text-secondary);">
              GDPR-kompatibel med avancerad säkerhet och transparens.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- HubSpot-inspired Lead Generation Modal -->
  <div id="leadModal" class="modal-overlay" style="display: none;">
    <div class="modal-content">
      <button onclick="closeLeadForm()" class="modal-close" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #a0aec0; cursor: pointer;">&times;</button>
      
      <div class="hubspot-form">
        <h3>Få en personlig demo av BidJoy</h3>
        <p class="subtitle">Se hur BidJoy kan revolutionera dina auktioner med SMS-budgivning och realtidsuppdateringar</p>
        
        <form id="leadForm">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
            <div class="form-group" style="margin-bottom: 0;">
              <label for="lead_name">Förnamn *</label>
              <input type="text" id="lead_name" name="name" required class="form-input" placeholder="Anna">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label for="lead_email">E-post *</label>
              <input type="email" id="lead_email" name="email" required class="form-input" placeholder="anna@företag.se">
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
            <div class="form-group" style="margin-bottom: 0;">
              <label for="lead_phone">Telefon *</label>
              <input type="tel" id="lead_phone" name="phone" required class="form-input" placeholder="+46 70 123 45 67">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label for="lead_company">Företag</label>
              <input type="text" id="lead_company" name="company" class="form-input" placeholder="Ditt företag">
            </div>
          </div>
          
          <div class="form-group">
            <label for="lead_interest">Vad är ditt huvudsakliga intresse? *</label>
            <select id="lead_interest" name="interest" class="form-select" required>
              <option value="">Välj ditt intresse...</option>
              <option value="seller">Sälja föremål via auktioner</option>
              <option value="buyer">Köpa via auktioner</option>
              <option value="both">Både sälja och köpa</option>
              <option value="investment">Investera i auktionsteknologi</option>
              <option value="platform">Egen auktionsplattform</option>
              <option value="enterprise">Företagslösning</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="lead_message">Berätta mer om dina behov</label>
            <textarea id="lead_message" name="message" class="form-textarea" placeholder="Beskriv gärna vad du är mest intresserad av att veta om BidJoy..."></textarea>
          </div>
          
          <button type="submit" class="hubspot-cta">Få min personliga demo</button>
          
          <div class="trust-indicators">
            <div class="trust-item">
              <span>🔒</span>
              <span>100% säkert</span>
            </div>
            <div class="trust-item">
              <span>⚡</span>
              <span>Snabbt svar</span>
            </div>
            <div class="trust-item">
              <span>🇸🇪</span>
              <span>Svenskt företag</span>
            </div>
          </div>
          
          <p class="form-disclaimer">
            Genom att skicka detta formulär godkänner du att BidJoy kontaktar dig angående våra tjänster. 
            Vi respekterar din integritet och delar aldrig dina uppgifter med tredje part.
          </p>
        </form>
      </div>
    </div>
  </div>

  <footer style="background: #FFFFFF; border-top: 1px solid var(--bidjoy-border); padding: 2rem 0; margin-top: 4rem;">
    <div class="bidjoy-container">
      <p style="text-align: center; margin: 0; color: var(--bidjoy-text-secondary);">
        © 2025 BidJoy. Alla rättigheter förbehållna.
      </p>
    </div>
  </footer>
  
  <script>
    // Force cache refresh - Cache Buster: ${CACHE_BUSTER}
    console.log('BidJoy Landing Page Updated - Cache Buster: ${CACHE_BUSTER}');
    
    // Clear any cached content
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister();
        }
      });
    }
    
    // Force page reload if old version detected
    const currentVersion = '${CACHE_BUSTER}';
    const lastVersion = localStorage.getItem('bidjoy_version');
    if (lastVersion && lastVersion !== currentVersion) {
      localStorage.setItem('bidjoy_version', currentVersion);
      window.location.reload(true);
    } else {
      localStorage.setItem('bidjoy_version', currentVersion);
    }

    // Lead Generation Functions
    function openLeadForm() {
      document.getElementById('leadModal').style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeLeadForm() {
      document.getElementById('leadModal').style.display = 'none';
      document.body.style.overflow = 'auto';
      document.getElementById('leadForm').reset();
    }

    // Close modal when clicking outside
    document.getElementById('leadModal').addEventListener('click', function(e) {
      if (e.target === this) {
        closeLeadForm();
      }
    });

    // Handle lead form submission
    document.getElementById('leadForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const leadData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company'),
        interest: formData.get('interest'),
        message: formData.get('message'),
        source: 'bidjoy_landing_page',
        timestamp: new Date().toISOString()
      };

      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Skickar...';
      submitBtn.disabled = true;

      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(leadData)
        });

        if (response.ok) {
          // Success - show confirmation
          alert('Tack för ditt intresse! Vi kontaktar dig inom 24 timmar.');
          closeLeadForm();
          
          // Track conversion for analytics
          if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
              'event_category': 'Lead',
              'event_label': leadData.interest,
              'value': 1
            });
          }
        } else {
          throw new Error('Failed to submit lead');
        }
      } catch (error) {
        console.error('Lead submission error:', error);
        alert('Ett fel uppstod. Försök igen eller kontakta oss direkt.');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });

    // Phone number formatting
    document.getElementById('lead_phone').addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.startsWith('46')) {
        value = '+' + value;
      } else if (value.startsWith('0')) {
        value = '+46' + value.substring(1);
      } else if (!value.startsWith('+')) {
        value = '+46' + value;
      }
      e.target.value = value;
    });
  </script>
</body>
</html>
  `;
}

function getLoginPageHTML() {
  return `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Logga in - BidJoy</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
  <style>${bidJoyTheme.css}</style>
</head>
<body>
  <nav class="bidjoy-nav">
    <div class="bidjoy-container">
      <div class="nav-content">
        <a href="/" class="nav-logo">BidJoy</a>
        <div class="nav-actions">
          <a href="/" class="bidjoy-btn bidjoy-btn-secondary">Tillbaka</a>
        </div>
      </div>
    </div>
  </nav>

  <div class="bidjoy-container" style="padding: 2rem 0;">
    <div class="login-form">
      <h1 style="text-align: center; margin-bottom: 1.5rem;">Logga in med SMS</h1>
      <p style="text-align: center; color: var(--bidjoy-text-secondary); margin-bottom: 2rem;">
        Ange ditt telefonnummer för att få en verifieringskod via SMS
      </p>
      
      <form id="loginForm">
        <div class="form-group">
          <label class="form-label" for="phone">Telefonnummer</label>
          <input type="tel" id="phone" class="bidjoy-input" placeholder="+46701234567" required>
        </div>
        
        <div id="codeGroup" class="form-group" style="display: none;">
          <label class="form-label" for="code">Verifieringskod</label>
          <input type="text" id="code" class="bidjoy-input" placeholder="1234" maxlength="4">
        </div>
        
        <div id="message" class="form-group"></div>
        
        <button type="submit" class="bidjoy-btn bidjoy-btn-primary" style="width: 100%;">
          <span id="buttonText">Skicka kod</span>
        </button>
      </form>
    </div>
  </div>

  <script>
    const form = document.getElementById('loginForm');
    const phoneInput = document.getElementById('phone');
    const codeInput = document.getElementById('code');
    const codeGroup = document.getElementById('codeGroup');
    const messageDiv = document.getElementById('message');
    const buttonText = document.getElementById('buttonText');
    
    let step = 'phone';
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (step === 'phone') {
        await sendSMSCode();
      } else {
        await verifyCode();
      }
    });
    
    async function sendSMSCode() {
      const phone = phoneInput.value.trim();
      if (!phone) return;
      
      try {
        messageDiv.innerHTML = '<div style="color: var(--bidjoy-text-muted);">Skickar kod...</div>';
        
        const response = await fetch('/auth/sms-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, userType: 'bidder' })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          messageDiv.innerHTML = '<div class="form-success">Verifieringskod skickad via SMS!</div>';
          codeGroup.style.display = 'block';
          phoneInput.disabled = true;
          buttonText.textContent = 'Verifiera kod';
          step = 'code';
          codeInput.focus();
        } else {
          messageDiv.innerHTML = \`<div class="form-error">\${data.error || 'Något gick fel'}</div>\`;
        }
      } catch (error) {
        messageDiv.innerHTML = '<div class="form-error">Nätverksfel. Försök igen.</div>';
      }
    }
    
    async function verifyCode() {
      const phone = phoneInput.value.trim();
      const code = codeInput.value.trim();
      
      if (!code) return;
      
      try {
        messageDiv.innerHTML = '<div style="color: var(--bidjoy-text-muted);">Verifierar kod...</div>';
        
        const response = await fetch('/auth/verify-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, code })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          localStorage.setItem('bidjoy_token', data.token);
          messageDiv.innerHTML = '<div class="form-success">Inloggning lyckades! Omdirigerar...</div>';
          
          // Redirect based on user type
          setTimeout(() => {
            if (data.user.userType === 'superadmin' || data.user.userType === 'admin') {
              window.location.href = '/admin';
            } else {
              window.location.href = '/dashboard';
            }
          }, 1000);
        } else {
          messageDiv.innerHTML = \`<div class="form-error">\${data.error || 'Felaktig kod'}</div>\`;
          codeInput.value = '';
          codeInput.focus();
        }
      } catch (error) {
        messageDiv.innerHTML = '<div class="form-error">Nätverksfel. Försök igen.</div>';
      }
    }
  </script>
</body>
</html>
  `;
}

function getAdminDashboardHTML(user) {
  return `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard - BidJoy</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
  <style>${bidJoyTheme.css}</style>
</head>
<body>
  <div class="admin-layout">
    <nav class="admin-sidebar">
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--bidjoy-border);">
        <div style="width: 32px; height: 32px; background: var(--bidjoy-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">B</div>
        <h2 style="margin: 0; font-size: 1.25rem;">BidJoy Admin</h2>
      </div>
      
      <ul class="sidebar-nav">
        <li><a href="/admin" class="active">📊 Översikt</a></li>
        <li><a href="/admin/auctions">🔨 Auktioner</a></li>
        <li><a href="/admin/users">👥 Användare</a></li>
        <li><a href="/admin/sms">📱 SMS</a></li>
        <li><a href="/admin/analytics">📈 Analytics</a></li>
        <li><a href="/admin/settings">⚙️ Inställningar</a></li>
      </ul>
      
      <div style="margin-top: auto; padding-top: 2rem; border-top: 1px solid var(--bidjoy-border);">
        <div style="padding: 1rem; background: var(--bidjoy-background); border-radius: var(--bidjoy-radius);">
          <div style="font-weight: 500; margin-bottom: 0.25rem;">${user.phone}</div>
          <div style="font-size: 0.875rem; color: var(--bidjoy-text-secondary);">${user.userType === 'superadmin' ? 'Superadmin' : 'Admin'}</div>
        </div>
        <button onclick="logout()" class="bidjoy-btn bidjoy-btn-secondary" style="width: 100%; margin-top: 1rem;">
          Logga ut
        </button>
      </div>
    </nav>
    
    <main class="admin-main">
      <header class="admin-header">
        <h1 style="margin: 0;">Dashboard</h1>
        <div style="display: flex; gap: 1rem;">
          <button class="bidjoy-btn bidjoy-btn-primary">Ny auktion</button>
          <button class="bidjoy-btn bidjoy-btn-secondary">Exportera</button>
        </div>
      </header>
      
      <div class="admin-content">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">156</div>
            <div class="stat-label">Aktiva auktioner</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">2,847</div>
            <div class="stat-label">Registrerade användare</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">45,230 SEK</div>
            <div class="stat-label">Total omsättning idag</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">98.5%</div>
            <div class="stat-label">SMS leveransgrad</div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
          <div class="bidjoy-card">
            <h3 style="margin: 0 0 1.5rem 0;">Senaste auktioner</h3>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 1px solid var(--bidjoy-border);">
                    <th style="text-align: left; padding: 0.75rem 0; font-weight: 500;">Auktion</th>
                    <th style="text-align: left; padding: 0.75rem 0; font-weight: 500;">Status</th>
                    <th style="text-align: left; padding: 0.75rem 0; font-weight: 500;">Bud</th>
                    <th style="text-align: left; padding: 0.75rem 0; font-weight: 500;">Slutar</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid #F1F3F4;">
                    <td style="padding: 0.75rem 0;">Vintage Omega Seamaster</td>
                    <td style="padding: 0.75rem 0;"><span style="background: var(--bidjoy-success); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">Aktiv</span></td>
                    <td style="padding: 0.75rem 0; font-weight: 500;">12,500 SEK</td>
                    <td style="padding: 0.75rem 0;">2h 34m</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F1F3F4;">
                    <td style="padding: 0.75rem 0;">Antik vas från 1800-talet</td>
                    <td style="padding: 0.75rem 0;"><span style="background: var(--bidjoy-warning); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">Slutar snart</span></td>
                    <td style="padding: 0.75rem 0; font-weight: 500;">8,750 SEK</td>
                    <td style="padding: 0.75rem 0;">45m</td>
                  </tr>
                  <tr>
                    <td style="padding: 0.75rem 0;">Retro möbler set</td>
                    <td style="padding: 0.75rem 0;"><span style="background: var(--bidjoy-success); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem;">Aktiv</span></td>
                    <td style="padding: 0.75rem 0; font-weight: 500;">15,200 SEK</td>
                    <td style="padding: 0.75rem 0;">1d 5h</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="bidjoy-card">
            <h3 style="margin: 0 0 1.5rem 0;">Senaste aktivitet</h3>
            <div style="space-y: 1rem;">
              <div style="padding: 1rem; background: var(--bidjoy-background); border-radius: var(--bidjoy-radius); margin-bottom: 1rem;">
                <div style="font-weight: 500; margin-bottom: 0.25rem;">Nytt bud</div>
                <div style="font-size: 0.875rem; color: var(--bidjoy-text-secondary);">+46701234567 lade bud på 13,000 SEK</div>
                <div style="font-size: 0.75rem; color: var(--bidjoy-text-muted); margin-top: 0.25rem;">2 min sedan</div>
              </div>
              <div style="padding: 1rem; background: var(--bidjoy-background); border-radius: var(--bidjoy-radius); margin-bottom: 1rem;">
                <div style="font-weight: 500; margin-bottom: 0.25rem;">Ny användare</div>
                <div style="font-size: 0.875rem; color: var(--bidjoy-text-secondary);">+46709876543 registrerades</div>
                <div style="font-size: 0.75rem; color: var(--bidjoy-text-muted); margin-top: 0.25rem;">5 min sedan</div>
              </div>
              <div style="padding: 1rem; background: var(--bidjoy-background); border-radius: var(--bidjoy-radius);">
                <div style="font-weight: 500; margin-bottom: 0.25rem;">Auktion avslutad</div>
                <div style="font-size: 0.875rem; color: var(--bidjoy-text-secondary);">Vintage kamera såld för 5,500 SEK</div>
                <div style="font-size: 0.75rem; color: var(--bidjoy-text-muted); margin-top: 0.25rem;">15 min sedan</div>
              </div>
            </div>
          </div>

          <!-- Superadmin CRM Section -->
          ${user.userType === 'superadmin' ? `
          <div class="bidjoy-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <h3 style="margin: 0;">CRM - Leads</h3>
              <button onclick="refreshLeads()" class="bidjoy-btn bidjoy-btn-secondary">Uppdatera</button>
            </div>
            <div id="leadsContainer">
              <div style="text-align: center; padding: 2rem; color: var(--bidjoy-text-secondary);">
                Laddar leads...
              </div>
            </div>
          </div>
          ` : ''}
        </div>
      </div>
    </main>
  </div>

  <script>
    function logout() {
      localStorage.removeItem('bidjoy_token');
      window.location.href = '/';
    }
  </script>
</body>
</html>
  `;
}

function getDashboardHTML(user) {
  return `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - BidJoy</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
  <style>${bidJoyTheme.css}</style>
</head>
<body>
  <nav class="bidjoy-nav">
    <div class="bidjoy-container">
      <div class="nav-content">
        <a href="/" class="nav-logo">BidJoy</a>
        <ul class="nav-links">
          <li><a href="/dashboard" class="nav-link">Dashboard</a></li>
          <li><a href="/auctions" class="nav-link">Auktioner</a></li>
          <li><a href="/profile" class="nav-link">Profil</a></li>
        </ul>
        <div class="nav-actions">
          <span style="margin-right: 1rem; color: var(--bidjoy-text-secondary);">${user.phone}</span>
          <button onclick="logout()" class="bidjoy-btn bidjoy-btn-secondary">Logga ut</button>
        </div>
      </div>
    </div>
  </nav>

  <div class="bidjoy-container" style="padding: 2rem 0;">
    <div style="margin-bottom: 2rem;">
      <h1 style="margin: 0 0 0.5rem 0;">Välkommen tillbaka!</h1>
      <p style="margin: 0; color: var(--bidjoy-text-secondary);">Upptäck nya auktioner och lägg dina bud</p>
    </div>

    <div class="stats-grid" style="margin-bottom: 3rem;">
      <div class="stat-card">
        <div class="stat-value">23</div>
        <div class="stat-label">Vunna auktioner</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">156</div>
        <div class="stat-label">Totala bud</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">4.8</div>
        <div class="stat-label">Betyg</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">2</div>
        <div class="stat-label">År medlem</div>
      </div>
    </div>

    <h2 style="margin: 0 0 1.5rem 0;">Populära auktioner</h2>
    <div class="auction-grid">
      <div class="auction-card">
        <div style="height: 200px; background: linear-gradient(45deg, #0055A5, #7CC2FF); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">⌚</div>
        <div class="auction-content">
          <h3 class="auction-title">Vintage Omega Seamaster</h3>
          <p class="auction-description">Klassisk Omega Seamaster från 1970-talet i utmärkt skick.</p>
          <div class="auction-stats">
            <div>
              <strong class="current-bid">12,500 SEK</strong>
              <div style="font-size: 0.75rem; color: var(--bidjoy-text-muted);">Aktuellt bud</div>
            </div>
            <div>
              <strong>2h 34m</strong>
              <div style="font-size: 0.75rem; color: var(--bidjoy-text-muted);">Tid kvar</div>
            </div>
            <div>
              <strong>8 bud</strong>
              <div style="font-size: 0.75rem; color: var(--bidjoy-text-muted);">Antal bud</div>
            </div>
          </div>
          <button class="bidjoy-btn bidjoy-btn-primary" style="width: 100%; margin-top: 1rem;">Lägg bud</button>
        </div>
      </div>

      <div class="auction-card">
        <div style="height: 200px; background: linear-gradient(45deg, #1B5E20, #4CAF50); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">🏺</div>
        <div class="auction-content">
          <h3 class="auction-title">Antik vas från 1800-talet</h3>
          <p class="auction-description">Vacker handmålad vas med authenticitetsbevis.</p>
          <div class="auction-stats">
            <div>
              <strong class="current-bid">8,750 SEK</strong>
              <div style="font-size: 0.75rem; color: var(--bidjoy-text-muted);">Aktuellt bud</div>
            </div>
            <div>
              <strong>45m</strong>
              <div style="font-size: 0.75rem; color: var(--bidjoy-text-muted);">Tid kvar</div>
            </div>
            <div>
              <strong>12 bud</strong>
              <div style="font-size: 0.75rem; color: var(--bidjoy-text-muted);">Antal bud</div>
            </div>
          </div>
          <button class="bidjoy-btn bidjoy-btn-primary" style="width: 100%; margin-top: 1rem;">Lägg bud</button>
        </div>
      </div>

      <div class="auction-card">
        <div style="height: 200px; background: linear-gradient(45deg, #E65100, #FF9800); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">🪑</div>
        <div class="auction-content">
          <h3 class="auction-title">Retro möbler set</h3>
          <p class="auction-description">Komplett vardagsrumsset från 1960-talet.</p>
          <div class="auction-stats">
            <div>
              <strong class="current-bid">15,200 SEK</strong>
              <div style="font-size: 0.75rem; color: var(--bidjoy-text-muted);">Aktuellt bud</div>
            </div>
            <div>
              <strong>1d 5h</strong>
              <div style="font-size: 0.75rem; color: var(--bidjoy-text-muted);">Tid kvar</div>
            </div>
            <div>
              <strong>15 bud</strong>
              <div style="font-size: 0.75rem; color: var(--bidjoy-text-muted);">Antal bud</div>
            </div>
          </div>
          <button class="bidjoy-btn bidjoy-btn-primary" style="width: 100%; margin-top: 1rem;">Lägg bud</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    function logout() {
      localStorage.removeItem('bidjoy_token');
      window.location.href = '/';
    }
  </script>
</body>
</html>
  `;
}

function getBetaEnvironmentHTML() {
  return `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BidJoy Beta - Staging Environment</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .beta-container {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      padding: 3rem;
      border-radius: 20px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
      text-align: center;
      max-width: 600px;
      width: 100%;
    }
    .beta-badge {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 2rem;
      display: inline-block;
    }
    .beta-title {
      font-size: 2.5rem;
      font-weight: 900;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
    }
    .beta-description {
      color: #64748b;
      font-size: 1.125rem;
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    .feature-list {
      text-align: left;
      margin: 2rem 0;
    }
    .feature-item {
      padding: 0.75rem 0;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .feature-status {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #10b981;
    }
    .beta-links {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-top: 2rem;
    }
    .beta-link {
      padding: 1rem;
      background: rgba(59, 130, 246, 0.1);
      border: 2px solid rgba(59, 130, 246, 0.2);
      border-radius: 12px;
      text-decoration: none;
      color: #1e40af;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    .beta-link:hover {
      background: rgba(59, 130, 246, 0.2);
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="beta-container">
    <span class="beta-badge">BETA ENVIRONMENT</span>
    <h1 class="beta-title">BidJoy Staging</h1>
    <p class="beta-description">
      Testmiljö för utveckling och kvalitetssäkring. Här testas nya funktioner innan de släpps i produktion.
    </p>
    
    <div class="feature-list">
      <div class="feature-item">
        <div class="feature-status"></div>
        <span>SMS Integration Testing</span>
      </div>
      <div class="feature-item">
        <div class="feature-status"></div>
        <span>Real-time Bidding Simulation</span>
      </div>
      <div class="feature-item">
        <div class="feature-status"></div>
        <span>Payment Gateway Sandbox</span>
      </div>
      <div class="feature-item">
        <div class="feature-status"></div>
        <span>Multi-tenant Testing</span>
      </div>
    </div>
    
    <div class="beta-links">
      <a href="/admin" class="beta-link">Test Admin Panel</a>
      <a href="/api/health" class="beta-link">API Health Check</a>
    </div>
    
    <p style="margin-top: 2rem; font-size: 0.875rem; color: #6b7280;">
      Environment: Staging | Version: ${Date.now()} | Status: Active
    </p>
  </div>
</body>
</html>
  `;
}

// Initialize database tables
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        user_type VARCHAR(20) NOT NULL,
        subscription_tier VARCHAR(20) DEFAULT 'free',
        account_status VARCHAR(20) DEFAULT 'active',
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(255),
        is_verified BOOLEAN DEFAULT false,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS auth_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        is_active BOOLEAN DEFAULT true
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) NOT NULL,
        code VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        is_used BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create leads table for CRM integration
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        company VARCHAR(255),
        interest VARCHAR(100) DEFAULT 'general',
        message TEXT,
        source VARCHAR(100) DEFAULT 'website',
        status VARCHAR(50) DEFAULT 'new',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(email)
      )
    `);

    console.log('Database tables initialized with BidJoy theme system');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Lead generation API endpoint
app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, phone, company, interest, message, source, timestamp } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Namn, e-post och telefon är obligatoriska' });
    }

    // Normalize phone number
    let normalizedPhone = phone.replace(/\s/g, '');
    if (normalizedPhone.startsWith('07')) {
      normalizedPhone = '+46' + normalizedPhone.substring(1);
    } else if (!normalizedPhone.startsWith('+')) {
      normalizedPhone = '+46' + normalizedPhone;
    }

    // Store lead in database
    const leadResult = await pool.query(`
      INSERT INTO leads (name, email, phone, company, interest, message, source, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'new', NOW(), NOW())
      RETURNING id
    `, [name, email, normalizedPhone, company || null, interest || 'general', message || null, source || 'website']);

    const leadId = leadResult.rows[0].id;

    // Send notification SMS to superadmin (+46761468300)
    const adminMessage = `Ny lead från BidJoy: ${name} (${email}) - ${interest}. ID: ${leadId}`;
    await novaAuth.sendSMS('+46761468300', adminMessage);

    // Send confirmation email/SMS to lead (optional)
    const confirmationMessage = `Tack ${name}! Vi har tagit emot din förfrågan och kontaktar dig inom 24 timmar. /BidJoy`;
    await novaAuth.sendSMS(normalizedPhone, confirmationMessage);

    console.log(`New lead captured: ${name} (${email}) - ID: ${leadId}`);

    res.json({
      success: true,
      message: 'Lead registrerad framgångsrikt',
      leadId
    });

  } catch (error) {
    console.error('Lead capture error:', error);
    res.status(500).json({ error: 'Kunde inte registrera lead' });
  }
});

// Get leads for superadmin CRM
app.get('/api/leads', novaAuth.requireAuth(['superadmin']), async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM leads';
    let params = [];
    
    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      leads: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Kunde inte hämta leads' });
  }
});

// Update lead status
app.patch('/api/leads/:id', novaAuth.requireAuth(['superadmin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const result = await pool.query(`
      UPDATE leads 
      SET status = $1, notes = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `, [status, notes, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead hittades inte' });
    }

    res.json({
      success: true,
      lead: result.rows[0]
    });

  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ error: 'Kunde inte uppdatera lead' });
  }
});

// Authentication routes
app.post('/auth/sms-login', async (req, res) => {
  try {
    let { phone, userType = 'bidder' } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Telefonnummer krävs' });
    }

    // Normalize phone number
    phone = phone.replace(/\s/g, '');
    if (phone.startsWith('07')) {
      phone = '+46' + phone.substring(1);
    } else if (!phone.startsWith('+')) {
      phone = '+46' + phone;
    }

    // Special handling for superadmin
    if (phone === '+46761468300') {
      userType = 'superadmin';
    }

    // Create or get user
    await novaAuth.createOrGetUser(phone, userType);

    // Generate and send verification code
    const code = novaAuth.generateVerificationCode();
    await novaAuth.storeVerificationCode(phone, code);

    const message = `BidJoy verifieringskod: ${code}. Gäller i 5 minuter.`;
    const smsSent = await novaAuth.sendSMS(phone, message);

    if (!smsSent) {
      return res.status(500).json({ 
        error: 'Kunde inte skicka SMS-verifieringskod'
      });
    }

    res.json({ 
      success: true,
      message: 'Verifieringskod skickad via SMS',
      phone
    });

  } catch (error) {
    console.error('SMS login error:', error);
    res.status(500).json({ error: 'SMS-inloggning misslyckades' });
  }
});

app.post('/auth/verify-code', async (req, res) => {
  try {
    let { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ error: 'Telefonnummer och kod krävs' });
    }

    // Normalize phone number
    phone = phone.replace(/\s/g, '');
    if (phone.startsWith('07')) {
      phone = '+46' + phone.substring(1);
    } else if (!phone.startsWith('+')) {
      phone = '+46' + phone;
    }

    // Verify the code
    const isValidCode = await novaAuth.verifyCode(phone, code);
    if (!isValidCode) {
      return res.status(400).json({ 
        error: 'Felaktig eller utgången verifieringskod' 
      });
    }

    // Get user and generate token
    const user = await novaAuth.createOrGetUser(phone);
    if (!user) {
      return res.status(500).json({ error: 'Kunde inte skapa användare' });
    }

    const token = novaAuth.generateToken(user);
    await novaAuth.createSession(user.id, token);

    // Mark user as verified
    await pool.query(
      'UPDATE users SET is_verified = true, last_login_at = NOW() WHERE id = $1',
      [user.id]
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        userType: user.user_type,
        subscriptionTier: user.subscription_tier,
        accountStatus: user.account_status,
        isVerified: true
      }
    });

  } catch (error) {
    console.error('Code verification error:', error);
    res.status(500).json({ error: 'Kodverifiering misslyckades' });
  }
});

app.get('/auth/me', novaAuth.requireAuth(), async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Användare hittades inte' });
    }

    res.json({
      user: {
        id: user.rows[0].id,
        phone: user.rows[0].phone,
        userType: user.rows[0].user_type,
        subscriptionTier: user.rows[0].subscription_tier,
        accountStatus: user.rows[0].account_status,
        isVerified: user.rows[0].is_verified,
        lastLoginAt: user.rows[0].last_login_at
      },
      isImpersonating: req.user.isImpersonating || false
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Kunde inte hämta användarinformation' });
  }
});

// Page routes with hostname-based routing
app.get('/', (req, res) => {
  const hostname = req.hostname || req.headers.host || '';
  
  if (hostname.includes('app.bidjoy.io')) {
    // Admin login interface for app subdomain
    res.send(getLoginPageHTML());
  } else if (hostname.includes('beta.bidjoy.io')) {
    // Beta/staging environment
    res.send(getBetaEnvironmentHTML());
  } else {
    // Public landing page for main domain
    res.send(getLandingPageHTML());
  }
});

app.get('/login', (req, res) => {
  res.send(getLoginPageHTML());
});

app.get('/admin', async (req, res) => {
  const hostname = req.hostname || req.headers.host || '';
  
  // For app.bidjoy.io, allow admin access with authentication check
  if (hostname.includes('app.bidjoy.io')) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Redirect to login if not authenticated
      return res.redirect('/');
    }
    
    try {
      const token = authHeader.substring(7);
      const decoded = novaAuth.verifyToken(token);
      
      if (!decoded || !['superadmin', 'admin'].includes(decoded.userType)) {
        return res.redirect('/');
      }
      
      const user = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
      if (user.rows.length === 0) {
        return res.redirect('/');
      }
      
      res.send(getAdminDashboardHTML(user.rows[0]));
    } catch (error) {
      return res.redirect('/');
    }
  } else {
    // For main domain, require full authentication
    return novaAuth.requireAuth(['superadmin', 'admin'])(req, res, async () => {
      const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
      res.send(getAdminDashboardHTML(user.rows[0]));
    });
  }
});

app.get('/dashboard', novaAuth.requireAuth(['bidder']), async (req, res) => {
  const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
  res.send(getDashboardHTML(user.rows[0]));
});

// Leads API for CRM
app.get('/api/leads', novaAuth.requireAuth(['superadmin']), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM leads ORDER BY created_at DESC LIMIT 50'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Kunde inte hämta leads' });
  }
});

app.post('/api/leads/update-status', novaAuth.requireAuth(['superadmin']), async (req, res) => {
  try {
    const { leadId, status } = req.body;
    await pool.query(
      'UPDATE leads SET status = $1, updated_at = NOW() WHERE id = $2',
      [status, leadId]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({ error: 'Kunde inte uppdatera lead-status' });
  }
});

// Health endpoint with theme information
app.get('/api/health', (req, res) => {
  res.json({
    status: "healthy",
    version: "v24.0.1-nova-auth-themed",
    deployment_signature: `bidjoy_themed_${Date.now()}`,
    deployment_timestamp: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    nova_auth: "enabled",
    theme_system: "bidjoy_scandinavian",
    authentication_endpoints: [
      "POST /auth/sms-login",
      "POST /auth/verify-code", 
      "GET /auth/me"
    ],
    themed_pages: [
      "GET / (landing)",
      "GET /login (sms auth)",
      "GET /admin (admin dashboard)",
      "GET /dashboard (user dashboard)"
    ],
    features: [
      "enhanced_sms_compliance",
      "premium_gamification", 
      "advanced_bidding",
      "nova_auth_jwt",
      "scandinavian_design",
      "unified_theming",
      "responsive_design"
    ],
    design_system: {
      colors: bidJoyTheme.colors,
      max_width: "1140px",
      grid_columns: 12,
      font_family: "Inter",
      border_radius: "8px"
    }
  });
});

// Start server
async function startServer() {
  await initDatabase();
  
  app.listen(PORT, () => {
    console.log(`BidJoy Themed Server running on port ${PORT}`);
    console.log('Features: Nova Auth + Scandinavian Design System');
    console.log('Available pages: /, /login, /admin, /dashboard');
  });
}

startServer();