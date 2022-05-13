/// Function to request Data from Facebook Messenger ///
const rp = require('request-promise');

module.exports = async (sender_psid, token) => {
    var result;
    try{
      var options = {
        uri: `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic`,
        qs: {
            access_token: token
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };
    result = await(rp(options));
    }
    catch (e){
        try{
            var options = {
              uri: `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name`,
              qs: {
                  access_token: token
              },
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
    }
    return result;  
};