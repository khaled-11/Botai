///////////////////////////////////////////////////////////////////
// Asynchronous Module to Request the client data from Facebook. //
///////////////////////////////////////////////////////////////////
const rp = require('request-promise'),
fs = require("fs");

module.exports = async (userID) => {
    var result;
    try{
      var options = {
        uri: `https://graph.facebook.com/v9.0/${userID}/picture`,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };
    filePath = `./files/${userID}_profile.jpg`;
    results = await (rp(options).pipe(fs.createWriteStream(filePath)));
    }
    catch (e){
      return;
    }
    return result;  
};