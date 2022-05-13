////////////////////////////////////////////////////////////////////
// Asynchronous Module to Request Long Lived Token from Facebook. //
////////////////////////////////////////////////////////////////////
const rp = require('request-promise');

module.exports = async Token => {
    var result;
    try{
      var options = {
        uri: `https://graph.facebook.com/v9.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.APP_ID}&client_secret=${process.env.APP_SECRET}&fb_exchange_token=${Token}`,
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