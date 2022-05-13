const rp = require('request-promise');
module.exports = async (intent, token) => {
    var state;
    // Try the request after setting up the request_body.
    try{
        var options = {
        method: 'DELETE',
        uri: encodeURI(`https://api.wit.ai/intents/${intent}?v=20200513`),
        headers: {
            Authorization: `Bearer ${token}`,
            ContentType: 'application/json'
        }
        };
    state = await JSON.parse(await rp(options));
    }
    catch (e){
        return;
    }
    return state;
};

