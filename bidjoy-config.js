/**
 * BidJoy Central Configuration
 * Centraliserad konfiguration för alla integrationspunkter
 */

const BIDJOY_CONFIG = {
  // GitHub Integration - Låst konfiguration
  github: {
    repository: 'affarsdesign/bidjoy',
    branch: 'main',
    token: process.env.GITHUB_TOKEN,
    syncFiles: ['server.js', 'package.json', 'Procfile', '.deployment-force', '.render-deployment-marker']
  },

  // Render Deployment - Låst konfiguration
  render: {
    service: 'bidjoy-io',
    domains: ['bidjoy.io', 'app.bidjoy.io'],
    buildCommand: 'npm install',
    startCommand: 'node server.js',
    autoDeployment: true
  },

  // Database - Låst konfiguration
  database: {
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production',
    poolSize: 20
  },

  // SMS Integration - Låst konfiguration
  sms: {
    provider: 'cellsynt',
    username: process.env.CELLSYNT_USERNAME,
    password: process.env.CELLSYNT_PASSWORD,
    fromNumber: '+46730122022',
    adminPhone: '+46761468300'
  },

  // HubSpot Features - Låst konfiguration
  hubspot: {
    enabled: true,
    features: {
      leadGeneration: true,
      personalizedSMS: true,
      valueBasedMessaging: true,
      gdprCompliant: true
    },
    ctaButton: {
      color: 'orange-gradient',
      text: 'Kom igång nu - helt gratis!',
      action: 'lead-modal'
    }
  },

  // Security - Låst konfiguration
  security: {
    jwtSecret: process.env.JWT_SECRET || 'bidjoy-secret-key-2024',
    rateLimiting: true,
    cors: true,
    superadminAccess: ['+46761468300']
  }
};

// Valideringsfunktion för konfiguration
function validateConfig() {
  const errors = [];

  // Kontrollera GitHub-konfiguration
  if (!BIDJOY_CONFIG.github.token) {
    errors.push('GitHub token saknas');
  }

  // Kontrollera SMS-konfiguration
  if (!BIDJOY_CONFIG.sms.username || !BIDJOY_CONFIG.sms.password) {
    errors.push('SMS-kredentialer saknas');
  }

  // Kontrollera databas-konfiguration
  if (!BIDJOY_CONFIG.database.url) {
    errors.push('Database URL saknas');
  }

  if (errors.length > 0) {
    console.error('KONFIGURATIONSFEL:', errors.join(', '));
    return false;
  }

  console.log('✅ BidJoy-konfiguration validerad');
  return true;
}

// Synkroniseringsfunktion som använder låst konfiguration
async function syncToGitHub() {
  if (!validateConfig()) {
    throw new Error('Konfigurationsfel - kan inte synkronisera');
  }

  const { repository, syncFiles, token } = BIDJOY_CONFIG.github;
  console.log(`Synkroniserar till ${repository}...`);
  
  // Synkroniseringslogik här använder endast den låsta konfigurationen
  return true;
}

// Deployment-funktion som använder låst konfiguration
async function deployToRender() {
  if (!validateConfig()) {
    throw new Error('Konfigurationsfel - kan inte deploya');
  }

  const { domains, service } = BIDJOY_CONFIG.render;
  console.log(`Deploying ${service} till ${domains.join(', ')}...`);
  
  // Deployment-logik här använder endast den låsta konfigurationen
  return true;
}

// Exportera endast den låsta konfigurationen
module.exports = {
  BIDJOY_CONFIG,
  validateConfig,
  syncToGitHub,
  deployToRender
};