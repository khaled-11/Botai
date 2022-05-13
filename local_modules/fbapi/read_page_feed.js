/////////////////////////////////////////////////////////////////
// Asynchronous Module to Request the page Info from Facebook. //
/////////////////////////////////////////////////////////////////
const rp = require('request-promise');

module.exports = async (pageID, Token) => {
    var result;
    try{
      var options = {
        uri: `https://graph.facebook.com/v9.0/${pageID}/feed?fields=can_reply_privately,from,message,comments{can_reply_privately,from,message}&access_token=${Token}`,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };
    result = await(rp(options));
    }
    catch (e){
      return;
    }
     return result;  
};