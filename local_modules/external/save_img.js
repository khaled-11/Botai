// Function to get app data
const https = require ("https");
const fs = require ("fs");
module.exports = async () => {
    console.log("saving image")
    const options2 = {
        hostname: 'alternative.me',
        port: 443,
        path: '/crypto/fear-and-greed-index.png',
        method: 'GET',
    }
    const req2 = https.request(options2, res => {
        res.pipe(fs.createWriteStream('./fear_index.png'))
    })
    req2.on('error', error => {
        console.error(error)
    })
    req2.end() 
}