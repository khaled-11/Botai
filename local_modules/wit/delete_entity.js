// Function to get app data
const axios = require ("axios");
const rp = require('request-promise');

module.exports = async (entity, token) => {
    const url = encodeURI(`https://api.wit.ai/entities/${entity}?v=20200513`);
    const OPTIONS = {
        headers: {
            Authorization: `Bearer ${token}`,
            ContentType: 'application/json'
        }
    }
  try {
    const response = await axios.delete(url, OPTIONS);
    return response.data;
  } catch (error) {
        try{
            var options = {
                method: 'PUT',
                uri: `https://api.wit.ai/entities/${entity}?v=20200513`,
                headers: {
                Authorization: `Bearer ${token}`,
                ContentType: "application/json"
            },
            body: `{"name": '${entity}', roles:["${entity}"], lookups:["keywords", "free-text"]}`,
            }; 
            state = await JSON.parse(await rp(options)); 
        }
        catch (e){
          return;
        }
        const url = encodeURI(`https://api.wit.ai/entities/${entity}?v=20200513`);
        const OPTIONS = {
            headers: {
                Authorization: `Bearer ${token}`,
                ContentType: 'application/json'
            }
        }
      try {
        const response = await axios.delete(url, OPTIONS);
        return response.data;
      }
      catch(e){
        return error.response.data;
      }
  }
}

