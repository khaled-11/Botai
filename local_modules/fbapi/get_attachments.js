// Function to get Persistent Menu Data for Page
const rp = require('request-promise'),
fs = require("fs");

module.exports = async (page_id, token) => {
    var results;
    try{
      var options = {
        method: 'GET',
        uri: `https://graph.facebook.com/v9.0/me/message_attachments?access_token=${token}`,
        json: true
    };
    results = await rp(options);
    }
    catch (e){
      return;
    }
    return results;  
};