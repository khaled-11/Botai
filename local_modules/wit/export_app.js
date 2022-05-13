// Function to get app data
const axios = require ("axios");

module.exports = async (token) => {
    const url = `https://api.wit.ai/export/?v=20200513`;
    const OPTIONS = {
        headers: {
            Authorization: `Bearer ${token}`,
            ContentType: 'application/json'
        }
    }
  try {
    response = await axios.get(url, OPTIONS);
    return response.data;
  } catch (error) {
    return;
  }
}