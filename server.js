/**
 * // Deployment: 2025-06-23T14:57:08.892Z
 * Production BidJoy Server with HubSpot Inbound Marketing Lead Generation
 * Unified server for Render deployment with all dependencies included
 * Features: Personaliserade SMS meddelanden, Lead generation, HubSpot-inspired design
 * Manual Deploy Trigger: 2025-06-23 14:51:30
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

// Landing page with HubSpot-inspired design
function getLandingPageHTML() {
  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BidJoy - Sveriges mest avancerade auktionsplattform</title>
  <style>
    :root {
      --bidjoy-primary: #0055A5;
      --bidjoy-secondary: #7CC2FF;
      --bidjoy-success: #10B981;
      --bidjoy-warning: #F59E0B;
      --bidjoy-text: #1A202C;
      --bidjoy-text-secondary: #4A5568;
      --bidjoy-text-muted: #A0AEC0;
      --bidjoy-background: #F7FAFC;
      --bidjoy-border: #E2E8F0;
      --bidjoy-radius: 0.5rem;
      --bidjoy-transition: all 0.2s ease;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #FFFFFF;
      color: var(--bidjoy-text);
      line-height: 1.6;
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
  <section style="padding: 4rem 0; min-height: 80vh; display: flex; align-items: center;">
    <div class="bidjoy-container">
      <div class="bidjoy-grid">
        <div class="hero-content">
          <h1 class="hero-title">Sveriges mest avancerade auktionsplattform</h1>
          <p class="hero-description">
            BidJoy revolutionerar auktionsbranschen med SMS-budgivning, realtidsuppdateringar och Scandinavisk design. 
            Upplev framtidens auktioner idag.
          </p>
          <div class="hero-actions">
            <button onclick="openLeadForm()" class="hubspot-cta">Kom igång nu - helt gratis!</button>
            <a href="#features" class="bidjoy-btn bidjoy-btn-secondary">Läs mer</a>
          </div>
        </div>
        <div class="hero-visual">
          <div style="width: 400px; height: 300px; background: linear-gradient(45deg, #0055A5, #7CC2FF); border-radius: 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 700;">
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

// Default route - Landing page
app.get('/', (req, res) => {
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