// Function to Delete Persistent Menu from page
const rp = require('request-promise');
module.exports = async (token) => {
    var results;
    try{
      var options = {
        method: 'DELETE',
        uri: `https://graph.facebook.com/v9.0/me/messenger_profile?access_token=${token}&fields=["persistent_menu"]`,
        headers: {
          ContentType: 'application/json'
        }

    };
    results = await rp(options);
    }
    catch (e){
      return;
    }
    return results;  
};