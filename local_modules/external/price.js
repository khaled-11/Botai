// Function to get app data
const axios = require ("axios");

module.exports = async (coin) => {
  const url = `https://api.kucoin.com/api/v1/prices?currencies=${coin}`;
  try {
    const response = await axios.get(url);
    return response.data
  } catch (error) {
    console.log(error)
    return;
  }
}