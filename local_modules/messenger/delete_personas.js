// Function to get Persistent Menu Data for Page
const rp = require('request-promise'),
fs = require("fs");

module.exports = async (persona_id, token) => {
    var results;
    try{
      var options = {
        method: 'DELETE',
        uri: `https://graph.facebook.com/v9.0/${persona_id}?access_token=${token}`,
        json: true
    };
    results = await rp(options);
    filePath = `./public/${page_id}`;
    return await (rp(options).pipe(fs.createWriteStream(filePath)));
    }
    catch (e){
      return;
    }
    return results;  
};