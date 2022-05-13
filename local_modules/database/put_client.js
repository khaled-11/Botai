/// Function used to add client data ///
const _ = require("lodash");
const AWS = require("aws-sdk");

var ddb = new AWS.DynamoDB();
module.exports = async (user_id, name, email) => {
    const params = {
        TableName: 'wit_clients',
        Item: {
        'clientID' : {S: `${user_id}`},
        'user_name' : {S: `${name}`},
        'user_email' : {S: `${email}`},
        'current_page' : {S: ``},
        'pages_id' : {L:  [{"S": "pages id"}]},
        'pages_name' : {L:  [{"S": "pages name"}]},
        'pages_language' : {L:  [{"S": "pages language"}]},
        'pages_state' : {L:  [{"S": "pages state"}]},
        'app_type' : {L:  [{"S": "App type"}]},
        'update_state' : {S: ``}
    }};
    const request = ddb.putItem(params);
    const result = await request.promise();
    return result;
};
