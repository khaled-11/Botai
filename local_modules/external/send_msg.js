// Function to get app data
const axios = require ("axios");

module.exports = async (id, name, text) => {
    var data;
    if (name === "mark"){
        data = new TextEncoder().encode(
            JSON.stringify({
                text:text,
                parse_mode:'markdown',
                chat_id:id,
                protect_content : true
            })
        )
    } else {
        data = new TextEncoder().encode(
            JSON.stringify({
                chat_id:id,
                parse_mode:'HTML',
                text:`${text}­`
            })
        )
    }
    const url = `https://api.telegram.org/bot5058153020:AAENUXQeAxlmi_Q1ncTUwNCOoXXLeS4RqwU/sendMessage`;
    const OPTIONS = {
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
        },
    }
  try {
    const ress = await axios.post(url, data, OPTIONS);
    console.log(ress.data)
    return ('success');
  } catch (error) {
    console.log(error)
    return ('fail');
  }
}