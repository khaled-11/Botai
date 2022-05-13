// Function to update the Messenger user Data //
const _ = require("lodash");
const AWS = require("aws-sdk");

var ddb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
 module.exports = async (page_id) => {
    const params = {
        TableName: 'wit_pages',
        Key: {
        "pageID" : page_id,
        },
        UpdateExpression: `set utterances = :ss, utterances_list = :ss2`,
        ExpressionAttributeValues:{
            ":ss": {"Utterance": ["Utterance", "Intent Name", '0']},
            ":ss2": ["utterance name"]
        },
    };
     const request = docClient.update(params);
         const result = await request.promise();
         return result;
  };