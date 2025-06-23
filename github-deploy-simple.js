/**
 * GitHub Deploy Simple - Lära sig korrekt deployment med vanilla Node.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class GitHubDeploySimple {
  constructor() {
    this.owner = 'affarsdesign';
    this.repo = 'bidjoy';
    this.token = process.env.GITHUB_TOKEN;
    this.deployedFiles = [];
  }

  log(message, level = 'info') {
    const timestamp = new Date().toLocaleTimeString('sv-SE');
    const icon = level === 'error' ? '❌' : level === 'success' ? '✅' : '📋';
    console.log(`${icon} [${timestamp}] ${message}`);
  }

  makeGitHubRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.github.com',
        port: 443,
        path: path,
        method: method,
        headers: {
          'Authorization': `token ${this.token}`,
          'User-Agent': 'BidJoy-Deploy',
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
              reject(new Error(`GitHub API Error: ${res.statusCode} - ${parsed.message || responseData}`));
            }
          } catch (error) {
            reject(new Error(`Parse Error: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }

  async deployToGitHub() {
    this.log('Startar GitHub Deploy Simple - Svensk tid deployment');
    
    try {
      // Verifiera repository access
      await this.verifyRepository();
      
      // Deploya alla kritiska filer
      await this.deployAllFiles();
      
      // Verifiera deployment
      await this.verifyDeployment();
      
      // Generera rapport
      this.generateReport();
      
    } catch (error) {
      this.log(`GitHub deployment misslyckades: ${error.message}`, 'error');
      throw error;
    }
  }

  async verifyRepository() {
    this.log('Verifierar repository access...');
    
    const repo = await this.makeGitHubRequest('GET', `/repos/${this.owner}/${this.repo}`);
    this.log(`✓ Repository verified: ${repo.full_name}`);
    this.log(`✓ Last updated: ${new Date(repo.updated_at).toLocaleString('sv-SE')}`);
    return repo;
  }

  async deployAllFiles() {
    this.log('Deploying alla viktiga filer med svensk tidsstämpel...');
    
    const files = [
      'server.js',
      'package.json', 
      'github-deploy-simple.js',
      '.deployment-force'
    ];

    for (const fileName of files) {
      try {
        await this.deployFile(fileName);
        await this.sleep(1000); // Undvik rate limiting
      } catch (error) {
        this.log(`Misslyckades med ${fileName}: ${error.message}`, 'error');
      }
    }
  }

  async deployFile(fileName) {
    const filePath = path.join(process.cwd(), fileName);
    
    if (!fs.existsSync(filePath)) {
      this.log(`Skipping ${fileName} - fil finns inte lokalt`);
      return;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const encodedContent = Buffer.from(fileContent).toString('base64');
    
    // Hämta nuvarande fil SHA om den existerar
    let currentSha = null;
    try {
      const currentFile = await this.makeGitHubRequest('GET', `/repos/${this.owner}/${this.repo}/contents/${fileName}`);
      currentSha = currentFile.sha;
    } catch (error) {
      // Fil existerar inte än
    }

    // Skapa commit message med korrekt svensk tid
    const svenskTid = new Date().toLocaleString('sv-SE', {
      timeZone: 'Europe/Stockholm',
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    const commitMessage = `Deploy: ${fileName} - Svensk tid ${svenskTid}`;

    const updateData = {
      message: commitMessage,
      content: encodedContent,
      branch: 'main'
    };

    if (currentSha) {
      updateData.sha = currentSha;
    }

    const result = await this.makeGitHubRequest('PUT', `/repos/${this.owner}/${this.repo}/contents/${fileName}`, updateData);
    
    this.log(`✅ ${fileName} deployed successfully`);
    this.deployedFiles.push({
      file: fileName,
      sha: result.content.sha,
      timestamp: svenskTid,
      commitUrl: result.commit.html_url
    });
  }

  async verifyDeployment() {
    this.log('Verifierar deployment...');
    
    for (const deployedFile of this.deployedFiles) {
      const fileInfo = await this.makeGitHubRequest('GET', `/repos/${this.owner}/${this.repo}/contents/${deployedFile.file}`);
      
      if (fileInfo.sha === deployedFile.sha) {
        this.log(`✓ ${deployedFile.file} verified on GitHub`);
      } else {
        throw new Error(`SHA mismatch for ${deployedFile.file}`);
      }
    }
  }

  generateReport() {
    const timestamp = new Date().toLocaleString('sv-SE', {
      timeZone: 'Europe/Stockholm'
    });
    
    console.log('\n============================================================');
    console.log('GITHUB DEPLOYMENT SIMPLE - FRAMGÅNGSRIK SYNKRONISERING');
    console.log('============================================================');
    console.log(`🕐 Deployment tid (svensk tid): ${timestamp}`);
    console.log(`📁 Repository: ${this.owner}/${this.repo}`);
    console.log(`📦 Antal filer deployade: ${this.deployedFiles.length}`);
    console.log('\nDeployade filer med korrekt svensk tid:');
    
    this.deployedFiles.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file.file}`);
      console.log(`     SHA: ${file.sha.substring(0, 8)}...`);
      console.log(`     Svensk tid: ${file.timestamp}`);
      console.log(`     Commit URL: ${file.commitUrl}`);
      console.log('');
    });
    
    console.log('✅ Modern skandinavisk design är nu synkroniserad på GitHub!');
    console.log('🚀 Render kommer automatiskt att deploya från GitHub');
    console.log('⏰ Alla tidsstämplar använder nu korrekt svensk tid');
    console.log('============================================================\n');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Kör deployment med korrekt svensk tid
async function main() {
  if (!process.env.GITHUB_TOKEN) {
    console.error('❌ GITHUB_TOKEN environment variable saknas');
    process.exit(1);
  }

  const deployer = new GitHubDeploySimple();
  
  try {
    await deployer.deployToGitHub();
    console.log('🎉 GitHub deployment slutförd med korrekt svensk tidsstämpel!');
    process.exit(0);
  } catch (error) {
    console.error('💥 GitHub deployment misslyckades:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = GitHubDeploySimple;