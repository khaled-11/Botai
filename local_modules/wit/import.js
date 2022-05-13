/// Function to post New Apps ///
const axios = require ("axios");
const fs = require ("fs");
module.exports = async (fileN, name) => {
  var fileReaderStream = fs.createReadStream(`./files/${fileN}`);
  const url = `https://api.wit.ai/import/?v=20200513&name=${name}&private=false`;
  const OPTIONS = {
      headers: {
        Authorization: `Bearer VWRCIEKP5RH3OD7FEU2GREK5X2NG46AY`,
        ContentType: 'application/json'
      }
    }
    try {
      response = await axios.post(url, fileReaderStream, OPTIONS);
    } catch (error) {
      return;
    }
    return response.data;
  }
