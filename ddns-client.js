import axios from 'axios';

// Get environment variables from Kubernetes or Docker
const DOMAIN = process.env.DOMAIN;
const SUBDOMAIN = process.env.SUBDOMAIN;
const PORKBUN_API_KEY = process.env.PORKBUN_API_KEY;
const PORKBUN_SECRET_KEY = process.env.PORKBUN_SECRET_KEY;
const INTERVAL = process.env.INTERVAL || 60000; // Default to 60 seconds if not set
const INITIAL_IP = process.env.INITIAL_IP  || "1.1.1.1"; // Default ip 1.1.1.1 if not set

let previousIP = INITIAL_IP;


if (!DOMAIN || !SUBDOMAIN || !PORKBUN_API_KEY || !PORKBUN_SECRET_KEY) {
  console.error("Missing required environment variables: DOMAIN, SUBDOMAIN, PORKBUN_API_KEY, or PORKBUN_SECRET_KEY.");
  process.exit(1);
}

// Function to get public IP
async function getPublicIP() {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Error getting public IP:', error);
    throw error;
  }
}

// Function to update DNS record
async function updateDNS(ip) {
  try {
    const response = await axios.post(`https://api.porkbun.com/api/json/v3/dns/editByNameType/${DOMAIN}/A/${SUBDOMAIN}`, {
        secretapikey: PORKBUN_SECRET_KEY,
        apikey: PORKBUN_API_KEY,
        content: ip,
        ttl: 600
    });
    console.log('DNS updated:', response.data);
  } catch (error) {
    console.error('Error updating DNS:', error);
  }
}

// Function to check and update the DNS if the public IP changes
async function checkAndUpdateDNS() {
  try {
    const currentIP = await getPublicIP();
    console.log('Current public IP:', currentIP);
    
    if (currentIP === INITIAL_IP || currentIP === previousIP) {
      console.log('IP has not changed, skipping DNS update');
      return;
    }

    previousIP = currentIP;
    console.log('IP has changed, updating DNS...');

    // Call the updateDNS function to update the DNS with the new IP
    await updateDNS(currentIP);

  } catch (error) {
    console.error('Error in checkAndUpdateDNS:', error);
  }
}

// Run the DNS update at a regular interval
setInterval(checkAndUpdateDNS, INTERVAL);
