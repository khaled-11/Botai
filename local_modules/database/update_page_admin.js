// Function to update the Messenger user Data //
const _ = require("lodash");
const AWS = require("aws-sdk");

var ddb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
 module.exports = async (page_id, sender_psid) => {
    const params = {
        TableName: 'wit_pages',
        Key: {
        "pageID" : page_id,
        },
        UpdateExpression: `set admin = :ss`,
        ExpressionAttributeValues:{
            ":ss":`${sender_psid}`
        },
    };
     const request = docClient.update(params);
         const result = await request.promise();
         return result;
  };