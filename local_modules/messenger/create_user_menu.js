/// Function to set the Persistent Menu ///
const rp = require('request-promise'),
getPersistentMenu = require("./get_persistent_menu");

module.exports = async (token, sender_id) => {
// Construct the message body
var request_body;
var state;
cur = await getPersistentMenu(token)
if (cur && cur.data && cur.data[0] && cur.data[0].persistent_menu[0]){
    // Create a request Body.
    var url = `https://graph.facebook.com/v9.0/me/custom_user_settings?access_token=${token}`
    // Try the request after setting up the request_body.
    request_body = {
    "psid": sender_id,
    "persistent_menu": [
        {
        "locale": "default",
        "composer_input_disabled": false,
        "call_to_actions": cur.data[0].persistent_menu[0].call_to_actions
        }
    ]
    };
    try{
    var options = {
        method: 'post',
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
    } else {
        return;
    }
}