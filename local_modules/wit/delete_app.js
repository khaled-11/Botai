const rp = require('request-promise');
module.exports = async (app, token) => {
    var state;
    // Try the request after setting up the request_body.
    try{
        var options = {
        method: 'DELETE',
        uri: encodeURI(`https://api.wit.ai/apps/${app}?v=20200513`),
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

