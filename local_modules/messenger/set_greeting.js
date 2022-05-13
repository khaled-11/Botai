/// Function to set the Greeting Message ///
const rp = require('request-promise'),
fs = require("fs");

module.exports = async (token, msg) => {
    var result;
    try{
      var options = {
        method: 'POST',
        uri: `https://graph.facebook.com/v8.0/me/messenger_profile?access_token=${token}`,
        body: {"greeting":[{"locale":"default",
        "text":msg
        }]},
        json: true
    };
    results = await rp(options);
    }
    catch (e){
      return;
    }
    return results;  
};