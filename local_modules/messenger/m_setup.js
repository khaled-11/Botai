/// Function to setup the App callback URL ///
const rp = require('request-promise');

module.exports = async () => {
  // Construct the message body
  var request_body;
  // Create a request Body.
  request_body = {
    access_token: `${process.env.APP_ID}|${process.env.APP_SECRET}`,
    object: "page",
    callback_url: `${process.env.URL}/webhook`,
    verify_token: process.env.VERIFY_TOKEN,
    include_values: "true"
  }
  // Try the request after setting up the request_body.
  try {
    var state;
    var options = {
      method: 'POST',
      uri: `https://graph.facebook.com/v9.0/${process.env.APP_ID}/subscriptions`,
      body: request_body,
      json: true
    };
    state = await rp(options);
  }
  catch (e){
    return;
  }
  return state;
};