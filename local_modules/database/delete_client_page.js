const _ = require("lodash");
const AWS = require("aws-sdk");


var docClient = new AWS.DynamoDB.DocumentClient();
 module.exports = async (clientID, index) => {
    const params = {
        TableName: 'wit_clients',
        Key: {
            "clientID" : clientID,
        },

        UpdateExpression : `set #attrName[${index}] = :S, #attrName2[${index}] = :S, #attrName3[${index}] = :S, #attrName4[${index}] = :S2`,
    ExpressionAttributeNames : {
        "#attrName" : "pages_id",
        "#attrName2" : "pages_name",
        "#attrName3" : "pages_language",
        "#attrName4" : "pages_state"
      }, ExpressionAttributeValues:{
        ":S":"",
        ":S2":"deleted"
    },
    };
    const request = docClient.update(params);
    const result = await request.promise();
    return result;
  };