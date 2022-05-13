/// Function to Whitelist the domain name ///
const rp = require('request-promise');
module.exports = async (token, domain) => {
// Construct the message body
var request_body;
var state;
// Create a request Body.
if (domain){
  request_body = {
    "whitelisted_domains": domain
  }
} else {
  request_body = {
    "whitelisted_domains": [`${process.env.URL}`]
  }
}
  // Try the request after setting up the request_body.
  try{
    var state;
    var options = {
      method: 'POST',
      uri: `https://graph.facebook.com/v9.0/me/messenger_profile?access_token=${token}`,
      body: request_body,
      json: true
    };
  state = await rp(options);
  }
  catch (e){
    return;
  }
   return state;
}