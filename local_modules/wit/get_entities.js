// Function to get entities
const rp = require('request-promise'),
fs = require("fs");

module.exports = async (key) => {
    var state;
    // Try the request after setting up the request_body.
    try{
        var options = {
        method: 'GET',
        uri: `https://api.wit.ai/entities?v=20200513`,
        headers: {
            Authorization: `Bearer ${key}`
        }
        };
    state = await JSON.parse(await rp(options));
    }
    catch (e){
        return;
    }
    return state;
};

