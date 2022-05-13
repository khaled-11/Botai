/// Function to post New Apps ///
const rp = require('request-promise');
module.exports = async (name) => {
  var state;
  try{
    var options = {
      method: 'POST',
      uri: `https://api.wit.ai/apps?v=20200513`,
      headers: {
        Authorization: 'Bearer VWRCIEKP5RH3OD7FEU2GREK5X2NG46AY',
        ContentType: "application/json"
    },
    body: `{"name": "${name}", "lang":"en", "private":false, "timezone": "America/Los_Angeles"}`,
  };
  state = await JSON.parse(await rp(options));
  }
  catch (e){
    return;
  }
   return state;
};

