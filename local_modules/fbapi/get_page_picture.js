// Function to get Persistent Menu Data for Page
const rp = require('request-promise'),
fs = require("fs");

module.exports = async (page_id, token) => {
    var results;
    try{
      var options = {
        method: 'GET',
        uri: `https://graph.facebook.com/v9.0/${page_id}/picture?access_token=${token}`,
        json: true
    };
    results = await rp(options);
    filePath = `./files/img/${page_id}`;
    return await (rp(options).pipe(fs.createWriteStream(filePath)));
    }
    catch (e){
      return;
    }
    return results;  
};