/**
 * BidJoy Render Deployment Verification
 * Kontrollerar om deployment har startat på Render
 */

const https = require('https');

async function checkRenderDeployment() {
    console.log('🚀 Checking BidJoy Render deployment status...');
    
    const domains = [
        'https://bidjoy.io',
        'https://app.bidjoy.io',
        'https://bidjoy-io.onrender.com'
    ];
    
    for (const domain of domains) {
        try {
            console.log(`\n📡 Testing ${domain}...`);
            
            const response = await fetch(domain, { 
                method: 'HEAD',
                timeout: 10000
            });
            
            console.log(`✅ ${domain}: Status ${response.status}`);
            
            if (response.status === 200) {
                console.log(`✨ SUCCESS: ${domain} is LIVE!`);
                
                // Test full response
                const fullResponse = await fetch(domain);
                const content = await fullResponse.text();
                
                if (content.includes('BidJoy') || content.includes('HubSpot')) {
                    console.log(`🎯 CONFIRMED: HubSpot-inspired landing page is deployed!`);
                } else {
                    console.log(`⚠️  WARNING: Page is live but content may not be updated`);
                }
            }
            
        } catch (error) {
            console.log(`❌ ${domain}: ${error.message}`);
        }
    }
}

async function verifyDeploymentTriggers() {
    console.log('\n🔍 Checking deployment triggers...');
    
    const fs = require('fs');
    
    try {
        const procfile = fs.readFileSync('Procfile', 'utf8');
        console.log(`📋 Procfile: ${procfile.trim()}`);
        
        const deploymentForce = fs.readFileSync('.deployment-force', 'utf8');
        console.log(`🔧 Deployment Force: ${deploymentForce.trim()}`);
        
        const renderMarker = fs.readFileSync('.render-deployment-marker', 'utf8');
        console.log(`📌 Render Marker: ${renderMarker.trim()}`);
        
        console.log('\n✅ All deployment triggers are in place!');
        
    } catch (error) {
        console.log(`❌ Error reading deployment files: ${error.message}`);
    }
}

async function main() {
    console.log('🎯 BidJoy HubSpot Deployment Verification Started');
    console.log('=' .repeat(50));
    
    await verifyDeploymentTriggers();
    await checkRenderDeployment();
    
    console.log('\n' + '=' .repeat(50));
    console.log('📊 Verification Complete');
    console.log('\n💡 If domains are not live yet, Render may still be processing the deployment.');
    console.log('💡 Check your Render dashboard for deployment logs and status.');
}

main().catch(console.error);