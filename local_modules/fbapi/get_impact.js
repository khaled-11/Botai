// Function to get Get Started Data for Page
const rp = require('request-promise');
module.exports = async (token) => {
    var results;
    try{
      var options = {
        method: 'GET',
        uri: `https://graph.facebook.com/v9.0/me/messenger_profile?access_token=${token}&fields=subject_to_new_eu_privacy_rules`,
        json: true
    };
    results = await rp(options);
    }
    catch (e){
      return;
    }
    return results;  
};