// Function to update the Data for intents //
const _ = require("lodash");
const AWS = require("aws-sdk");

var docClient = new AWS.DynamoDB.DocumentClient();
module.exports = async (pageID, field, field2, data, data2, bot_type) => {
    if (bot_type){
        params = {
            TableName: 'wit_pages',
            Key: {
            "pageID" : pageID,
            },
            UpdateExpression: `set ${field} = :ss, ${field2} = :ss2, bot_type = :ss3`,
            ExpressionAttributeValues:{
                ":ss":`${data}`,
                ":ss2":`${data2}`,
                ":ss3":`${bot_type}`
            },
        };
    } else if (data2 || data2 === ""){
        params = {
            TableName: 'wit_pages',
            Key: {
            "pageID" : pageID,
            },
            UpdateExpression: `set ${field} = :ss, ${field2} = :ss2`,
            ExpressionAttributeValues:{
                ":ss":`${data}`,
                ":ss2":`${data2}`
            },
        };
    } else {
        params = {
            TableName: 'wit_pages',
            Key: {
            "pageID" : pageID,
            },
            UpdateExpression: `set ${field} = :ss`,
            ExpressionAttributeValues:{
                ":ss":`${field2}`
            },
        };
    }

    const request = docClient.update(params);
    const result = await request.promise();
    return result;
};