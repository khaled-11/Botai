// Function to get app data
const axios = require ("axios");

module.exports = async (coin) => {
    const url = `https://api.alternative.me/fng`;
    const OPTIONS = {
        headers: {
            "Content-Type": "application/json",
        }
    }
  try {
    const response = await axios.get(url, OPTIONS);
    return response.data;
  } catch (error) {
    console.log(error)
    return;
  }
}