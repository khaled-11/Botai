/// Function to set the Persistent Menu ///
const rp = require('request-promise');
module.exports = async (token, sender_id) => {
// Construct the message body
var request_body;
var state;
// Create a request Body.
  var url = `https://graph.facebook.com/v9.0/me/custom_user_settings?psid=${sender_id}&params=[%22persistent_menu%22]&access_token=${token}`
  // Try the request after setting up the request_body.
  try{
    var options = {
      method: 'delete',
      uri: url,
      json: true
    };
  state = await rp(options);
  }
  catch (e){
    return;
  }
   return state;
}