///////////////////////////////////////////////////////////////////
// Asynchronous Module to Request the client data from Facebook. //
///////////////////////////////////////////////////////////////////
const rp = require('request-promise');

module.exports = async (userID, token) => {
    var result;
    try{
      var options = {
        uri: `https://graph.facebook.com/v9.0/${userID}?access_token=${token}&fields=name,email,id`,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };
    results = await rp(options);
    }
    catch (e){
      return;
    }
     return results;  
};