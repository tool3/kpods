const axios = require('axios');

const getRequest = async (url, token) => {
    return await axios.get(url, { headers: { Authorization: `Bearer ${token}`, 'Accept-Encoding': 'gzip' } });
};

module.exports = { getRequest };