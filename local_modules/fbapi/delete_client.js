const rp = require('request-promise');
module.exports = async (client_id, token) => {
    var state;
    // Try the request after setting up the request_body.
    try{
        var options = {
        method: 'DELETE',
        uri: encodeURI(`https://graph.facebook.com/v9.0/${client_id}/permissions?access_token=${token}`),
        headers: {
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

