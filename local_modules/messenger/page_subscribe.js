/// Function to Subscribe Page to Webhook Events ///
const rp = require('request-promise');
module.exports = async (PAGE_ID, token) => {
  let fields =
  "messages, messaging_postbacks, messaging_optins, feed, message_deliveries, messaging_referrals, standby, message_echoes, messaging_handovers";
  // Construct the message body
  var request_body;
  // Create a request Body.
  request_body = {
        access_token: token,
        subscribed_fields: fields
  }
  // Try the request after setting up the request_body.
  try{
    var state;
    var options = {
      method: 'POST',
      uri: `https://graph.facebook.com/v8.0/${PAGE_ID}/subscribed_apps`,
      body: request_body,
      json: true
    };
  state = await rp(options);
  console.log(state)
  }
  catch (e){
    console.log(e.message)
    return;
  }
   return state;
};