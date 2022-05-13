/// Function to post New Traits ///
const rp = require('request-promise');
module.exports = async (key, trait, values) => {
var state;
  try{
    var options = {
      method: 'POST',
      uri: `https://api.wit.ai/traits?v=20200513`,
      headers: {
        Authorization: `Bearer ${key}`,
        ContentType: "application/json"
    },
    body: `{"name": "${trait}", "values":[${values}]}`
    };
  state = await JSON.parse(await rp(options));
  }
  catch (e){
    return;
  }
   return state;
};
 
