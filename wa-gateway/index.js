const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode'); 

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth(), // Saves session to .wwebjs_auth folder
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html'
    }
});

let qrCodeDataUrl = null;
let connectionStatus = 'DISCONNECTED'; // DISCONNECTED, QR_READY, AUTHENTICATING, CONNECTED
let linkedNumber = null;

client.on('qr', async (qr) => {
    connectionStatus = 'QR_READY';
    qrCodeDataUrl = await qrcode.toDataURL(qr);
    console.log('QR Code is ready! Scan it on the frontend.');
});

client.on('ready', () => {
    connectionStatus = 'CONNECTED';
    qrCodeDataUrl = null;
    linkedNumber = client.info && client.info.wid ? client.info.wid.user : null;
    console.log('WhatsApp Client is ready! Linked number:', linkedNumber);
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
    connectionStatus = 'AUTHENTICATING';
});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
    connectionStatus = 'DISCONNECTED';
});

client.on('disconnected', async (reason) => {
    console.log('Client was logged out', reason);
    connectionStatus = 'DISCONNECTED';
    qrCodeDataUrl = null;
    linkedNumber = null;
    
    // Attempt to re-initialize after a short delay
    setTimeout(() => {
        client.initialize();
    }, 5000);
});

// Initial start
client.initialize();

// API Endpoints
app.get('/wa/status', (req, res) => {
    res.json({ status: connectionStatus, number: linkedNumber });
});

app.get('/wa/qr', (req, res) => {
    if (connectionStatus === 'QR_READY' && qrCodeDataUrl) {
        res.json({ success: true, qr: qrCodeDataUrl });
    } else {
        res.json({ success: false, message: 'QR Not Ready or Already Connected' });
    }
});

app.post('/wa/logout', async (req, res) => {
    try {
        if (connectionStatus === 'CONNECTED') {
            await client.logout();
        } else {
            // If it's just stuck or want to reset
            try { await client.destroy(); } catch (e) {}
            setTimeout(() => {
                client.initialize();
            }, 3000);
        }
        connectionStatus = 'DISCONNECTED';
        qrCodeDataUrl = null;

        res.json({ success: true, message: 'Logged out or reset successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/wa/send', async (req, res) => {
    try {
        const { target, message } = req.body;
        
        if (connectionStatus !== 'CONNECTED') {
            return res.status(400).json({ success: false, message: 'WhatsApp is not connected' });
        }

        if (!target || !message) {
            return res.status(400).json({ success: false, message: 'Target and message are required' });
        }

        // target should be like "628xxx" or "08xxx"
        let formattedTarget = target;
        if (formattedTarget.startsWith('0')) {
            formattedTarget = '62' + formattedTarget.substring(1);
        }
        // Remove spaces, + or - 
        formattedTarget = formattedTarget.replace(/[\+\-\s]/g, '');
        
        // WhatsApp Web JS requires appending @c.us for regular numbers
        formattedTarget = `${formattedTarget}@c.us`;

        const response = await client.sendMessage(formattedTarget, message);
        res.json({ success: true, response });
    } catch (error) {
        console.error('Failed to send message', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`WA Gateway Server running on port ${PORT}`);
});
