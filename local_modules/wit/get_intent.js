const request = require ("request");

module.exports = async () => {
    try{
        request(
            {
            uri: `https://api.wit.ai/intents/test?v=20200513`,
            headers: {
                Authorization: 'Bearer T7QYBJYO6CW5TDPQ5YMIWNOYPNBM3Y3B',
                ContentType: 'application/json'
            },
            method: "GET"
            },
            (error, _res, data) => {
            if (!error) {
                return data;
            } else {
                return error
            }
            }
        );
    } catch (e){
        return e.msg
    }
};