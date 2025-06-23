// EMERGENCY_REBUILD_1750695800000
// RENDER_FORCE_SYNC_NOW
/**
 * EMERGENCY DEPLOYMENT: 2025-06-23T18:16:40.000Z
 * BidJoy Modern Design Emergency Deployment
 * This deployment forces Render to sync with GitHub immediately
 * CRITICAL: Cache must be cleared and new content served
 * EMERGENCY BUILD: 2025-06-23 18:16:40 Swedish Time
 * STATUS: CRITICAL DEPLOYMENT REQUIRED
 */

const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/bidjoy',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Aggressive cache invalidation for complete rebuild
app.use((req, res, next) => {
  const timestamp = 1750694693779;
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Last-Modified': new Date().toUTCString(),
    'ETag': `W/"${timestamp}.${Math.random()}"`,
    'X-Cache-Buster': timestamp,
    'X-Force-Rebuild': 'complete',
    'X-Build-ID': '2e2468',
    'X-Deploy-Timestamp': new Date().toISOString()
  });
  next();
});


// SMS Service configuration
const SMS_USERNAME = process.env.CELLSYNT_USERNAME || 'bidjoy';
const SMS_PASSWORD = process.env.CELLSYNT_PASSWORD || 'test123';
const JWT_SECRET = process.env.JWT_SECRET || 'bidjoy-secret-key-2024';
const ADMIN_PHONE = '+46761468300';

// Initialize database tables
async function initDatabase() {
  try {
    // Create leads table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        interest VARCHAR(100),
        message TEXT,
        source VARCHAR(100) DEFAULT 'bidjoy_landing_page',
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// SMS Function
async function sendSMS(to, message) {
  try {
    const { default: fetch } = await import('node-fetch');
    
    const response = await fetch('https://se-sms.cellsynt.net/sms.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        username: SMS_USERNAME,
        password: SMS_PASSWORD,
        destination: to,
        text: message,
        originatortype: 'shortcode',
        originator: '71122'
      })
    });

    const result = await response.text();
    console.log(`SMS sent to ${to}: ${result}`);
    return result.includes('OK:');
  } catch (error) {
    console.error('SMS Error:', error);
    return false;
  }
}

// Modern Scandinavian Landing Page with Inbound Marketing
function getLandingPageHTML() {
  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BidJoy - Sveriges mest avancerade auktionsplattform</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --scandi-blue: #0066CC;
      --scandi-light-blue: #E6F3FF;
      --scandi-dark: #1A1A1A;
      --scandi-gray: #F8F9FA;
      --scandi-text: #2C3E50;
      --scandi-text-light: #6C757D;
      --scandi-white: #FFFFFF;
      --scandi-accent: #FF6B35;
      --scandi-success: #28A745;
      --scandi-radius: 12px;
      --scandi-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      --scandi-transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--scandi-white);
      color: var(--scandi-text);
      line-height: 1.6;
      font-weight: 400;
      overflow-x: hidden;
    }

    .scandi-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .scandi-section {
      padding: 6rem 0;
    }

    .scandi-grid {
      display: grid;
      gap: 4rem;
      align-items: center;
    }

    .scandi-grid-2 {
      grid-template-columns: 1fr 1fr;
    }

    .scandi-card {
      background: var(--scandi-white);
      border-radius: var(--scandi-radius);
      box-shadow: var(--scandi-shadow);
      padding: 2.5rem;
      transition: var(--scandi-transition);
      border: 1px solid rgba(0, 102, 204, 0.08);
    }

    .scandi-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 64px rgba(0, 0, 0, 0.12);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .scandi-container {
        padding: 0 1rem;
      }
      
      .scandi-grid-2 {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      h1 {
        font-size: 2.5rem !important;
        letter-spacing: -1px !important;
      }
      
      .scandi-section {
        padding: 3rem 0;
      }
      
      nav .scandi-container {
        padding: 1rem;
      }
      
      nav > div > div:last-child {
        display: none;
      }
      
      .mobile-menu-btn {
        display: block !important;
        background: none;
        border: none;
        color: var(--scandi-blue);
        font-size: 1.5rem;
        cursor: pointer;
      }
      
      .mobile-menu {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: white;
        border-top: 1px solid rgba(0, 102, 204, 0.1);
        padding: 1rem;
        display: none;
        flex-direction: column;
        gap: 1rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }
      
      .mobile-menu a,
      .mobile-menu button {
        padding: 0.75rem;
        text-align: center;
        border-radius: 8px;
        transition: background 0.2s;
      }
      
      .mobile-menu button {
        background: var(--scandi-blue);
        color: white;
        border: none;
        font-weight: 600;
      }
    }

    @media (max-width: 480px) {
      h1 {
        font-size: 2rem !important;
      }
      
      .scandi-card {
        padding: 1.5rem;
      }
      
      .scandi-section {
        padding: 2rem 0;
      }
    }

    /* Enhanced interaction styles */
    input:focus, textarea:focus, select:focus {
      border-color: var(--scandi-blue) !important;
      box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1) !important;
      outline: none;
    }

    button:hover {
      transform: translateY(-2px);
    }

    a:hover {
      color: var(--scandi-blue) !important;
    }

    .bidjoy-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .bidjoy-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 2rem;
      align-items: center;
    }

    .hero-content {
      grid-column: span 6;
    }

    .hero-visual {
      grid-column: span 6;
      text-align: center;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 800;
      color: var(--bidjoy-text);
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }

    .hero-description {
      font-size: 1.25rem;
      color: var(--bidjoy-text-secondary);
      margin-bottom: 2rem;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    /* HubSpot-inspired CTA button */
    .hubspot-cta {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
      text-decoration: none;
      display: inline-block;
    }

    .hubspot-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
      background: linear-gradient(135deg, #f7931e 0%, #ff6b35 100%);
    }

    .bidjoy-btn {
      padding: 0.875rem 1.75rem;
      border-radius: var(--bidjoy-radius);
      font-weight: 600;
      text-decoration: none;
      display: inline-block;
      transition: var(--bidjoy-transition);
      cursor: pointer;
      border: 2px solid;
    }

    .bidjoy-btn-secondary {
      background: transparent;
      color: var(--bidjoy-primary);
      border-color: var(--bidjoy-primary);
    }

    .bidjoy-btn-secondary:hover {
      background: var(--bidjoy-primary);
      color: white;
    }

    .bidjoy-card {
      background: #FFFFFF;
      border: 1px solid var(--bidjoy-border);
      border-radius: var(--bidjoy-radius);
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: var(--bidjoy-transition);
    }

    .bidjoy-card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
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

    /* HubSpot-inspired form styling */
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

    .form-input, .form-select, .form-textarea {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 6px;
      font-size: 1rem;
      transition: all 0.2s ease;
      background: #ffffff;
      box-sizing: border-box;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--bidjoy-primary);
      box-shadow: 0 0 0 3px rgba(0, 85, 165, 0.1);
      transform: translateY(-1px);
    }

    .form-textarea {
      min-height: 100px;
      resize: vertical;
      font-family: inherit;
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

    @media (max-width: 768px) {
      .bidjoy-grid {
        grid-template-columns: 1fr;
        text-align: center;
      }
      
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-actions {
        justify-content: center;
        flex-direction: column;
      }
      
      .hubspot-form {
        padding: 1.5rem;
      }
      
      .trust-indicators {
        flex-direction: column;
        gap: 1rem;
      }
    }
  </style>
</head>
<body>
  <!-- Scandinavian Navigation -->
  <nav style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0, 102, 204, 0.1); position: fixed; top: 0; width: 100%; z-index: 1000; transition: var(--scandi-transition);">
    <div class="scandi-container" style="padding: 1rem 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 1.75rem; font-weight: 800; color: var(--scandi-blue); letter-spacing: -0.8px;">BidJoy</div>
        <div style="display: flex; gap: 3rem; align-items: center;">
          <a href="#hem" style="text-decoration: none; color: var(--scandi-text); font-weight: 500; transition: var(--scandi-transition); position: relative;">Hem</a>
          <a href="#funktioner" style="text-decoration: none; color: var(--scandi-text); font-weight: 500; transition: var(--scandi-transition);">Funktioner</a>
          <a href="#om-oss" style="text-decoration: none; color: var(--scandi-text); font-weight: 500; transition: var(--scandi-transition);">Om oss</a>
          <a href="#kontakt" style="text-decoration: none; color: var(--scandi-text); font-weight: 500; transition: var(--scandi-transition);">Kontakt</a>
          <button onclick="openLeadForm()" style="background: var(--scandi-blue); color: white; border: none; padding: 0.75rem 2rem; border-radius: var(--scandi-radius); font-weight: 600; cursor: pointer; transition: var(--scandi-transition); box-shadow: var(--scandi-shadow);">Kom igång</button>
        </div>
        <button class="mobile-menu-btn" onclick="toggleMobileMenu()" style="display: none;">☰</button>
        <div class="mobile-menu">
          <a href="#hem">Hem</a>
          <a href="#funktioner">Funktioner</a>
          <a href="#om-oss">Om oss</a>
          <a href="#kontakt">Kontakt</a>
          <button onclick="openLeadForm()">Kom igång</button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero Section - Modern Scandinavian Design -->
  <section style="padding: 8rem 0 6rem; background: linear-gradient(135deg, var(--scandi-gray) 0%, var(--scandi-light-blue) 100%); margin-top: 80px;">
    <div class="scandi-container">
      <div class="scandi-grid scandi-grid-2">
        <div>
          <div style="background: var(--scandi-accent); color: white; display: inline-block; padding: 0.5rem 1.5rem; border-radius: 50px; font-size: 0.875rem; font-weight: 600; margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 0.5px;">Skandinavisk Innovation</div>
          <h1 style="font-size: 4rem; font-weight: 800; color: var(--scandi-dark); margin-bottom: 2rem; line-height: 1.1; letter-spacing: -2px;">Sveriges mest <span style="color: var(--scandi-blue);">avancerade</span> auktionsplattform</h1>
          <p style="font-size: 1.25rem; color: var(--scandi-text-light); margin-bottom: 3rem; line-height: 1.7; max-width: 500px;">
            Revolutionera din auktionsupplevelse med SMS-budgivning, realtidsuppdateringar och pristine skandinavisk design. 
          </p>
          <div style="display: flex; gap: 1.5rem; margin-bottom: 3rem;">
            <button onclick="openLeadForm()" style="background: var(--scandi-blue); color: white; border: none; padding: 1.25rem 3rem; border-radius: var(--scandi-radius); font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: var(--scandi-transition); box-shadow: var(--scandi-shadow); text-transform: uppercase; letter-spacing: 0.5px;">Starta Idag</button>
            <button onclick="document.getElementById('demo').scrollIntoView({behavior: 'smooth'})" style="background: transparent; color: var(--scandi-blue); border: 2px solid var(--scandi-blue); padding: 1.25rem 3rem; border-radius: var(--scandi-radius); font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: var(--scandi-transition);">Se Demo</button>
          </div>
          <div style="display: flex; gap: 2rem; color: var(--scandi-text-light); font-size: 0.875rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: var(--scandi-success); font-size: 1.2rem;">✓</span>
              Gratis att börja
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: var(--scandi-success); font-size: 1.2rem;">✓</span>
              SMS-integration
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="color: var(--scandi-success); font-size: 1.2rem;">✓</span>
              24/7 Support
            </div>
          </div>
        </div>
        <div id="demo" style="position: relative;">
          <div style="background: linear-gradient(135deg, var(--scandi-blue) 0%, #4A90E2 100%); border-radius: 20px; padding: 3rem; color: white; box-shadow: 0 30px 60px rgba(0, 102, 204, 0.2); position: relative; overflow: hidden;">
            <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; filter: blur(40px);"></div>
            <div style="position: relative; z-index: 2;">
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
                <div style="width: 60px; height: 60px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🔨</div>
                <div>
                  <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">BidJoy Live Demo</h3>
                  <p style="color: rgba(255, 255, 255, 0.8); font-size: 0.9rem;">Upptäck framtidens auktioner</p>
                </div>
              </div>
              <div style="background: rgba(255, 255, 255, 0.15); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
                <p style="font-size: 0.9rem; margin-bottom: 1rem; opacity: 0.9;">Aktuell auktion:</p>
                <h4 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem;">Vintage Rolex Submariner</h4>
                <p style="font-size: 2rem; font-weight: 800; color: #FFD700;">47 850 kr</p>
              </div>
              <button onclick="openLeadForm()" style="background: white; color: var(--scandi-blue); border: none; padding: 1rem 2rem; border-radius: 8px; font-weight: 600; cursor: pointer; width: 100%; transition: var(--scandi-transition);">Börja Budgivning →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Value Proposition Section -->
  <section id="funktioner" class="scandi-section" style="background: var(--scandi-white);">
    <div class="scandi-container">
      <div style="text-align: center; margin-bottom: 4rem;">
        <h2 style="font-size: 3rem; font-weight: 800; color: var(--scandi-dark); margin-bottom: 1.5rem;">Varför väljer <span style="color: var(--scandi-blue);">3000+</span> företag BidJoy?</h2>
        <p style="font-size: 1.2rem; color: var(--scandi-text-light); max-width: 600px; margin: 0 auto; line-height: 1.7;">
          Upptäck fördelarna med Sveriges mest avancerade auktionsplattform som redan revolutionerat branschen.
        </p>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2.5rem;">
        <div class="scandi-card" style="text-align: center;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--scandi-blue), #4A90E2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 2rem;">📱</div>
          <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: var(--scandi-dark);">SMS-Budgivning</h3>
          <p style="color: var(--scandi-text-light); line-height: 1.6; margin-bottom: 1.5rem;">Budgivning direkt via SMS - enkelt, snabbt och tillgängligt för alla. Ingen app-nedladdning krävs.</p>
          <div style="background: var(--scandi-light-blue); padding: 1rem; border-radius: 8px; font-size: 0.9rem; color: var(--scandi-blue); font-weight: 600;">
            Ökning av deltagande: +340%
          </div>
        </div>
        
        <div class="scandi-card" style="text-align: center;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--scandi-accent), #FF8A65); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 2rem;">⚡</div>
          <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: var(--scandi-dark);">Realtidsuppdateringar</h3>
          <p style="color: var(--scandi-text-light); line-height: 1.6; margin-bottom: 1.5rem;">Få direkta uppdateringar om budstatus och auktionsresultat via SMS, e-post eller push-notiser.</p>
          <div style="background: rgba(255, 107, 53, 0.1); padding: 1rem; border-radius: 8px; font-size: 0.9rem; color: var(--scandi-accent); font-weight: 600;">
            Reaktionstid: <1 sekund
          </div>
        </div>
        
        <div class="scandi-card" style="text-align: center;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--scandi-success), #66BB6A); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 2rem;">🎨</div>
          <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: var(--scandi-dark);">Skandinavisk Design</h3>
          <p style="color: var(--scandi-text-light); line-height: 1.6; margin-bottom: 1.5rem;">Ren, minimalistisk design som prioriterar användarupplevelsen och accessibility.</p>
          <div style="background: rgba(40, 167, 69, 0.1); padding: 1rem; border-radius: 8px; font-size: 0.9rem; color: var(--scandi-success); font-weight: 600;">
            Användarengagemang: +280%
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Social Proof Section -->
  <section style="background: var(--scandi-gray); padding: 4rem 0;">
    <div class="scandi-container">
      <div style="text-align: center; margin-bottom: 3rem;">
        <h2 style="font-size: 2.5rem; font-weight: 700; color: var(--scandi-dark); margin-bottom: 1rem;">Betrodd av ledande företag</h2>
        <p style="color: var(--scandi-text-light); font-size: 1.1rem;">Över 3000+ företag förlitar sig på BidJoy för sina auktioner</p>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; align-items: center; opacity: 0.7;">
        <div style="text-align: center; font-size: 1.5rem; font-weight: 700; color: var(--scandi-blue);">Klockargården</div>
        <div style="text-align: center; font-size: 1.5rem; font-weight: 700; color: var(--scandi-blue);">Stockholms Auktionsverk</div>
        <div style="text-align: center; font-size: 1.5rem; font-weight: 700; color: var(--scandi-blue);">Uppsala Auktionskammare</div>
        <div style="text-align: center; font-size: 1.5rem; font-weight: 700; color: var(--scandi-blue);">Göteborgs Auktioner</div>
      </div>
    </div>
  </section>

  <!-- Lead Generation Form Section -->
  <section id="kom-igang" style="background: linear-gradient(135deg, var(--scandi-blue) 0%, #1565C0 100%); padding: 6rem 0; color: white;">
    <div class="scandi-container">
      <div class="scandi-grid scandi-grid-2" style="gap: 4rem;">
        <div>
          <h2 style="font-size: 3rem; font-weight: 800; margin-bottom: 2rem; line-height: 1.2;">Redo att revolutionera dina auktioner?</h2>
          <p style="font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; line-height: 1.6;">
            Få en personlig demo och upptäck hur BidJoy kan öka dina auktionsintäkter med i genomsnitt 340%.
          </p>
          <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span style="color: #4CAF50; font-size: 1.2rem;">✓</span>
              <span>Gratis demo på 15 minuter</span>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span style="color: #4CAF50; font-size: 1.2rem;">✓</span>
              <span>Ingen bindningstid</span>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span style="color: #4CAF50; font-size: 1.2rem;">✓</span>
              <span>Uppsättning på under 24 timmar</span>
            </div>
          </div>
        </div>
        
        <div style="background: white; border-radius: var(--scandi-radius); padding: 2.5rem; color: var(--scandi-text);">
          <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--scandi-dark);">Boka din demo idag</h3>
          <form id="leadForm" onsubmit="submitLeadForm(event)" style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--scandi-text);">Namn *</label>
              <input type="text" name="name" required style="width: 100%; padding: 0.875rem; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 1rem; transition: var(--scandi-transition);">
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--scandi-text);">E-post *</label>
              <input type="email" name="email" required style="width: 100%; padding: 0.875rem; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 1rem; transition: var(--scandi-transition);">
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--scandi-text);">Telefon</label>
              <input type="tel" name="phone" style="width: 100%; padding: 0.875rem; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 1rem; transition: var(--scandi-transition);">
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--scandi-text);">Företag</label>
              <input type="text" name="company" style="width: 100%; padding: 0.875rem; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 1rem; transition: var(--scandi-transition);">
            </div>
            <button type="submit" style="background: var(--scandi-blue); color: white; border: none; padding: 1rem 2rem; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: var(--scandi-transition); text-transform: uppercase; letter-spacing: 0.5px;">
              Boka Demo Nu →
            </button>
          </form>
          <p style="text-align: center; font-size: 0.8rem; color: var(--scandi-text-light); margin-top: 1rem;">
            Vi respekterar din integritet. Inga spam-meddelanden.
          </p>
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
      <button onclick="closeLeadForm()" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; color: #a0aec0; cursor: pointer;">&times;</button>
      
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
        
        <div id="leadSuccess" style="display: none; text-align: center; color: #10b981; margin-top: 20px;">
          <h4>Tack för ditt intresse!</h4>
          <p>Vi kontaktar dig inom 24 timmar för att diskutera hur BidJoy kan hjälpa dig.</p>
        </div>
      </div>
    </div>
  </div>

  <script>
    function openLeadForm() {
      document.getElementById('leadModal').style.display = 'block';
    }
    
    function closeLeadForm() {
      document.getElementById('leadModal').style.display = 'none';
      document.getElementById('leadForm').style.display = 'block';
      document.getElementById('leadSuccess').style.display = 'none';
    }
    
    document.getElementById('leadForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const leadData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company'),
        interest: formData.get('interest'),
        message: formData.get('message'),
        source: 'bidjoy_landing_hubspot'
      };
      
      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leadData)
        });
        
        if (response.ok) {
          document.getElementById('leadForm').style.display = 'none';
          document.getElementById('leadSuccess').style.display = 'block';
          setTimeout(() => {
            closeLeadForm();
          }, 3000);
        } else {
          alert('Ett fel uppstod. Försök igen senare.');
        }
      } catch (error) {
        alert('Ett fel uppstod. Försök igen senare.');
      }
    });
    
    // Close modal when clicking outside
    document.getElementById('leadModal').addEventListener('click', function(e) {
      if (e.target === this) {
        closeLeadForm();
      }
    });
  </script>
</body>
</html>`;
}

// API Routes
app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, phone, company, interest, message, source } = req.body;
    
    // Insert lead into database
    const result = await pool.query(
      'INSERT INTO leads (name, email, phone, company, interest, message, source) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [name, email, phone, company, interest, message, source || 'bidjoy_landing_page']
    );
    
    const leadId = result.rows[0].id;
    
    // Send HubSpot-inspired inbound marketing SMS to admin
    const adminMessage = `🎯 Kvalificerad lead: ${name} från ${company || 'företag'} - ${interest}. Värde: Hög potential för ${interest === 'platform' ? 'Enterprise' : interest === 'investment' ? 'Investerare' : 'Kund'}. Lead: ${leadId}`;
    await sendSMS(ADMIN_PHONE, adminMessage);
    
    // Send HubSpot-inspired value-driven SMS to lead
    if (phone) {
      let personalizedMessage = '';
      switch (interest) {
        case 'seller':
          personalizedMessage = `Hej ${name}! 🚀 Tack för ditt intresse att sälja via BidJoy. Vi hjälper dig maximera värdet på dina föremål med SMS-budgivning som ökar engagemanget med 300%. Vi ringer inom 2 timmar! //BidJoy`;
          break;
        case 'buyer':
          personalizedMessage = `Hej ${name}! 🎯 Perfekt timing - BidJoy revolutionerar hur du handlar på auktioner. Få tillgång till unika fynd och buda enkelt via SMS. Vi visar dig hur inom 2 timmar! //BidJoy`;
          break;
        case 'both':
          personalizedMessage = `Hej ${name}! ⚡ Som både köpare och säljare får du full nytta av BidJoy:s SMS-auktioner. Vi visar dig hur du kan tjäna mer och spara tid. Personlig demo inom 2 timmar! //BidJoy`;
          break;
        case 'investment':
          personalizedMessage = `Hej ${name}! 💎 BidJoy:s unika SMS-auktionsmodell skapar exceptionella investeringsmöjligheter. Vi diskuterar potential och ROI inom 2 timmar. //BidJoy Investments`;
          break;
        case 'platform':
          personalizedMessage = `Hej ${name}! 🏆 En egen auktionsplattform med BidJoy:s beprövade teknologi kan transformera ${company || 'din verksamhet'}. Enterprise-demo inom 2 timmar! //BidJoy Enterprise`;
          break;
        case 'enterprise':
          personalizedMessage = `Hej ${name}! 🚀 BidJoy Enterprise hjälper ${company || 'företag'} att öka försäljningen med avancerade auktionslösningar. Skräddarsydd demo inom 2 timmar! //BidJoy Enterprise`;
          break;
        default:
          personalizedMessage = `Hej ${name}! 🌟 Tack för ditt intresse för BidJoy - Sveriges mest avancerade auktionsplattform. Vi kontaktar dig inom 2 timmar med en personlig genomgång! //BidJoy`;
      }
      await sendSMS(phone, personalizedMessage);
    }
    
    res.json({ 
      success: true, 
      leadId, 
      message: 'Lead registrerad framgångsrikt' 
    });
    
  } catch (error) {
    console.error('Lead capture error:', error);
    res.status(500).json({ error: 'Kunde inte registrera lead' });
  }
});

// Default route - Landing page with aggressive cache busting
app.get('/', (req, res) => {
  const timestamp = Date.now();
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Last-Modified': new Date().toUTCString(),
    'ETag': `W/"${timestamp}.${Math.random()}"`,
    'X-Cache-Buster': timestamp,
    'X-Force-Rebuild': 'true',
    'X-Deploy-Timestamp': new Date().toISOString()
  });
  res.send(getLandingPageHTML());
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    version: 'v24.1.0-hubspot',
    timestamp: new Date().toISOString() 
  });
});

// Start server
async function startServer() {
  await initDatabase();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BidJoy HubSpot Server running on port ${PORT}`);
    console.log(`HubSpot-inspired lead generation: ACTIVE`);
    console.log(`Features: Orange CTA, Trust indicators, GDPR compliance`);
  });
}

startServer().catch(console.error);