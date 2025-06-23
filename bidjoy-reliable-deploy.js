/**
 * BidJoy Reliable Deploy - Funktionell pipeline som garanterar deployment
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class ReliableDeploy {
  constructor() {
    this.owner = 'affarsdesign';
    this.repo = 'bidjoy';
    this.token = process.env.GITHUB_TOKEN;
    this.deployedFiles = [];
    this.verificationResults = [];
    this.startTime = new Date();
    
    // Kritiska filer som ALLTID ska deployeras
    this.criticalFiles = [
      'server.js',
      'package.json',
      'bidjoy-reliable-deploy.js',
      '.deployment-force',
      'bidjoy-config.js'
    ];
  }

  log(message, level = 'info') {
    const timestamp = new Date().toLocaleString('sv-SE', {
      timeZone: 'Europe/Stockholm'
    });
    const icons = { error: '❌', success: '✅', info: '📋', warning: '⚠️' };
    console.log(`${icons[level]} [${timestamp}] ${message}`);
  }

  async deploy() {
    this.log('🚀 Startar BidJoy Reliable Deploy Pipeline');
    
    try {
      // Steg 1: Förberedelser
      await this.prepareDeployment();
      
      // Steg 2: Uppdatera kritiska filer
      await this.updateFiles();
      
      // Steg 3: Synkronisera till GitHub
      await this.syncToGitHub();
      
      // Steg 4: Verifiera deployment
      await this.verifyDeployment();
      
      // Steg 5: Generera rapport
      this.generateReport();
      
      return true;
    } catch (error) {
      this.log(`Deployment misslyckades: ${error.message}`, 'error');
      return false;
    }
  }

  async prepareDeployment() {
    this.log('Förbereder deployment...');
    
    // Kontrollera GitHub token
    if (!this.token) {
      throw new Error('GITHUB_TOKEN saknas i environment variables');
    }
    
    // Kontrollera att kritiska filer existerar
    for (const file of this.criticalFiles) {
      if (!fs.existsSync(file)) {
        this.log(`Varning: ${file} existerar inte lokalt`, 'warning');
      }
    }
    
    this.log('✓ Deployment förberedd');
  }

  async updateFiles() {
    this.log('Uppdaterar deployment-markörer...');
    
    // Skapa deployment timestamp
    const timestamp = new Date().toISOString();
    const deploymentMarker = `// BidJoy Reliable Deploy - ${timestamp}\n`;
    
    // Uppdatera .deployment-force med ny timestamp
    fs.writeFileSync('.deployment-force', 
      `${deploymentMarker}DEPLOYMENT_TIMESTAMP=${timestamp}\nDEPLOYMENT_STATUS=READY\n`
    );
    
    this.log('✓ Deployment-markörer uppdaterade');
  }

  async syncToGitHub() {
    this.log('Synkroniserar till GitHub...');
    
    let successCount = 0;
    
    for (const fileName of this.criticalFiles) {
      try {
        await this.uploadToGitHub(fileName);
        successCount++;
        this.log(`✓ ${fileName} synkroniserad`);
        
        // Undvik rate limiting
        await this.wait(1000);
      } catch (error) {
        this.log(`Failed: ${fileName} - ${error.message}`, 'error');
      }
    }
    
    if (successCount === 0) {
      throw new Error('Ingen fil kunde synkroniseras till GitHub');
    }
    
    this.log(`✓ ${successCount}/${this.criticalFiles.length} filer synkroniserade`);
  }

  async uploadToGitHub(fileName) {
    const filePath = path.join(process.cwd(), fileName);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Fil existerar inte: ${fileName}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const encodedContent = Buffer.from(fileContent).toString('base64');
    
    // Hämta nuvarande SHA
    let currentSha = null;
    try {
      const response = await this.makeGitHubRequest('GET', `/repos/${this.owner}/${this.repo}/contents/${fileName}`);
      currentSha = response.sha;
    } catch (error) {
      // Fil existerar inte än
    }

    // Skapa commit med svensk tid
    const svenskTid = new Date().toLocaleString('sv-SE', {
      timeZone: 'Europe/Stockholm'
    });
    
    const updateData = {
      message: `Reliable Deploy: ${fileName} - ${svenskTid}`,
      content: encodedContent,
      branch: 'main'
    };

    if (currentSha) {
      updateData.sha = currentSha;
    }

    const result = await this.makeGitHubRequest('PUT', `/repos/${this.owner}/${this.repo}/contents/${fileName}`, updateData);
    
    this.deployedFiles.push({
      file: fileName,
      sha: result.content.sha,
      timestamp: svenskTid,
      commitUrl: result.commit.html_url
    });
  }

  async makeGitHubRequest(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.github.com',
        port: 443,
        path: endpoint,
        method: method,
        headers: {
          'Authorization': `token ${this.token}`,
          'User-Agent': 'BidJoy-Reliable-Deploy',
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        const jsonData = JSON.stringify(data);
        options.headers['Content-Length'] = Buffer.byteLength(jsonData);
      }

      const req = https.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
            } else {
              reject(new Error(`GitHub API Error: ${res.statusCode} - ${parsed.message}`));
            }
          } catch (error) {
            reject(new Error(`Parse Error: ${responseData}`));
          }
        });
      });

      req.on('error', reject);
      
      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }

  async verifyDeployment() {
    this.log('Verifierar deployment på GitHub...');
    
    for (const deployedFile of this.deployedFiles) {
      try {
        const response = await this.makeGitHubRequest('GET', `/repos/${this.owner}/${this.repo}/contents/${deployedFile.file}`);
        
        const isVerified = response.sha === deployedFile.sha;
        this.verificationResults.push({
          file: deployedFile.file,
          verified: isVerified,
          sha: response.sha
        });
        
        if (isVerified) {
          this.log(`✓ ${deployedFile.file} verifierad på GitHub`);
        } else {
          this.log(`✗ ${deployedFile.file} verifiering misslyckades`, 'warning');
        }
        
        await this.wait(500);
      } catch (error) {
        this.log(`Verifiering misslyckades för ${deployedFile.file}: ${error.message}`, 'error');
      }
    }
    
    // Kontrollera att vissa domäner är tillgängliga
    await this.checkDomains();
  }

  async checkDomains() {
    const domains = ['bidjoy.io', 'app.bidjoy.io'];
    
    for (const domain of domains) {
      try {
        await this.checkDomain(domain);
      } catch (error) {
        this.log(`Domain check för ${domain}: ${error.message}`, 'warning');
      }
    }
  }

  async checkDomain(domain) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: domain,
        port: 443,
        path: '/',
        method: 'HEAD',
        timeout: 5000
      };

      const req = https.request(options, (res) => {
        this.log(`✓ ${domain} svarar (${res.statusCode})`);
        resolve(res.statusCode);
      });

      req.on('error', () => {
        this.log(`⚠️ ${domain} inte tillgänglig än`, 'warning');
        resolve(null);
      });

      req.on('timeout', () => {
        req.destroy();
        resolve(null);
      });

      req.end();
    });
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateReport() {
    const endTime = new Date();
    const duration = Math.round((endTime - this.startTime) / 1000);
    const verifiedCount = this.verificationResults.filter(r => r.verified).length;
    
    console.log('\n' + '='.repeat(60));
    console.log('BIDJOY RELIABLE DEPLOY - SLUTRAPPORT');
    console.log('='.repeat(60));
    console.log(`⏱️  Deploy-tid: ${duration} sekunder`);
    console.log(`📁 Repository: ${this.owner}/${this.repo}`);
    console.log(`📦 Filer deployade: ${this.deployedFiles.length}`);
    console.log(`✅ Filer verifierade: ${verifiedCount}/${this.deployedFiles.length}`);
    console.log(`🕐 Slutförd: ${endTime.toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })}`);
    
    console.log('\nDeployade filer:');
    this.deployedFiles.forEach((file, index) => {
      const verified = this.verificationResults.find(v => v.file === file.file)?.verified ? '✅' : '❌';
      console.log(`  ${index + 1}. ${file.file} ${verified}`);
      console.log(`     Tid: ${file.timestamp}`);
      console.log(`     SHA: ${file.sha.substring(0, 12)}`);
    });
    
    if (verifiedCount === this.deployedFiles.length) {
      console.log('\n🎉 DEPLOYMENT FRAMGÅNGSRIK - Alla filer verifierade!');
      console.log('🚀 Render kommer automatiskt att deploya ändringarna');
      console.log('🌐 BidJoy moderna design är nu live på GitHub');
    } else {
      console.log('\n⚠️  PARTIELL DEPLOYMENT - Vissa filer kunde inte verifieras');
    }
    
    console.log('='.repeat(60) + '\n');
  }
}

// Kör reliable deployment
async function main() {
  const deployer = new ReliableDeploy();
  
  const success = await deployer.deploy();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = ReliableDeploy;