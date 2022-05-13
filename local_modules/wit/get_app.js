// Function to get app data
const axios = require ("axios");

module.exports = async (id, token) => {
    const url = `https://api.wit.ai/apps/${id}/?v=20200513`;
    const OPTIONS = {
        headers: {
            Authorization: `Bearer ${token}`,
            ContentType: 'application/json'
        }
    }
  try {
    const response = await axios.get(url, OPTIONS);
    return response.data;
  } catch (error) {
    return;
  }
}