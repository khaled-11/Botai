const rp = require('request-promise'),
fs = require("fs");

module.exports = async (text, token) => {
    var state;
    // Try the request after setting up the request_body.
    try{
        var options = {
        method: 'DELETE',
        uri: encodeURI(`https://api.wit.ai/utterances?v=20200513`),
        headers: {
            Authorization: `Bearer ${token}`,
            ContentType: 'application/json'
        },
        body: `[{"text": '${text.toString()}'}]`,
        };
    state = await JSON.parse(await rp(options));
    }
    catch (e){
        return;
    }
    return state;
};

