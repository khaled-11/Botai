/// Function to set the Persistent Menu ///
const rp = require('request-promise');
module.exports = async (token, page_id, dataArr) => {
// Construct the message body
var request_body;
// Create a request Body.
  var url = `https://graph.facebook.com/v9.0//me/messenger_profile?access_token=${token}`
  if (dataArr){
    request_body = {
      "persistent_menu": [
        {
          "locale": "default",
          "composer_input_disabled": false,
          "call_to_actions": dataArr
        }
      ]
    };
  }
  // Try the request after setting up the request_body.
  try{
    var options = {
      method: 'POST',
      uri: url,
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