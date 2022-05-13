/// Function to Get App Utterances ///
const rp = require('request-promise');
module.exports = async (key) => {
var state;
  try{
    var options = {
      method: 'GET',
      uri: `https://api.wit.ai/utterances?v=20200513&limit=3000`,
      headers: {
        Authorization: `Bearer ${key}`,
        ContentType: "application/json"
    }
};
  state = await JSON.parse(await rp(options));
  }
  catch (e){
    return;
  }
   return state;
};

