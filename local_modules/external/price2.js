// Function to get app data
const axios = require ("axios");

module.exports = async (coin) => {
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${coin}`;
  const OPTIONS = {
    headers: {
      "Content-Type": "application/json",
      "X-CMC_PRO_API_KEY": "91d34573-6fdb-4ab4-ba06-314f15b18b91"
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