/// Function to post entity ///
const rp = require('request-promise');
module.exports = async (key, name, lookups) => {
  var state;
  try{
    if (lookups){
      var options = {
        method: 'POST',
        uri: `https://api.wit.ai/entities?v=20200513`,
        headers: {
          Authorization: `Bearer ${key}`,
          ContentType: "application/json"
      },
      body: `{"name": '${name}', roles:[], lookups:[${lookups}]}`,
    };  
  } else {
    var options = {
      method: 'POST',
      uri: `https://api.wit.ai/entities?v=20200513`,
      headers: {
        Authorization: `Bearer ${key}`,
        ContentType: "application/json"
    },
    body: `{"name": '${name}', roles:[], lookups:["keywords", "free-text"]}`,
    };  
  }
  state = await JSON.parse(await rp(options));
  }
  catch (e){
    return;
  }
   return state;
};

