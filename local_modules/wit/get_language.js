const rp = require('request-promise'),
fs = require("fs");

module.exports = async (text, token) => {
    var state;
    // Try the request after setting up the request_body.
    try{
        var options = {
        method: 'GET',
        uri: encodeURI(`https://api.wit.ai/language?v=20200513&q=${text}`),
        headers: {
            Authorization: `Bearer ${token}`
        }
        };
    state = await JSON.parse(await rp(options));
    }
    catch (e){
        return;
    }
    return state;
};

