// Pass thread function
const rp = require('request-promise');

module.exports = async (sender_psid, app, token) => {
  let appID;
  var token;
  if (app === "first"){
  appID = process.env.APP_ID;
  token = token;
  } else if (app === "inbox") {
    appID = 263902037430900;
    token = token;
  } else {
    appID = process.env.APP_ID_2;
    token = token;
  }
  // Construct the message body
  var request_body;
  var state;
  // Create a request Body.
  request_body = {
    "recipient": {
    "id": sender_psid
    },
    "target_app_id":appID
  }
 
  // Try the request after setting up the request_body.
  try{
    var options = {
      method: 'POST',
      uri: `https://graph.facebook.com/v9.0/me/pass_thread_control?access_token=${token}`,
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