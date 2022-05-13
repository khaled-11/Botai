// Function to get app data
const axios = require ("axios");
const FormData = require ('form-data');
const fs = require ("fs");
module.exports = async (id) => {
  const form = new FormData()
  form.append('photo', fs.createReadStream('./fear_index.png'))
  const url = `https://api.telegram.org/bot5058153020:AAENUXQeAxlmi_Q1ncTUwNCOoXXLeS4RqwU/sendPhoto?chat_id=${id}`;
  const OPTIONS = {
    headers: {
      "Content-Type": `multipart/form-data; boundary=${form._boundary}`
    },
  }
  try {
    await axios.post(url, form, OPTIONS);
    return ('success');
  } catch (error) {
    return ('fail');
  }
}