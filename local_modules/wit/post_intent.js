/// Function to post New Intents ///
const rp = require('request-promise');
module.exports = async (name, key) => {
var state;
  try{
    var options = {
      method: 'POST',
      uri: `https://api.wit.ai/intents?v=20200513`,
      headers: {
        Authorization: `Bearer ${key}`,
        ContentType: "application/json"
    },
    body: `{"name": "${name}"}`,
};
  state = await JSON.parse(await rp(options));
  }
  catch (e){
    return;
  }
   return state;
};

