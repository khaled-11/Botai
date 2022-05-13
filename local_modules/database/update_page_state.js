const _ = require("lodash");
const AWS = require("aws-sdk");


var docClient = new AWS.DynamoDB.DocumentClient();
 module.exports = async (clientID, index, lang, type, impact) => {
    const params = {
        TableName: 'wit_clients',
        Key: {
            "clientID" : clientID,
        },

        UpdateExpression : `set #attrName[${index}] = :S, #attrName2[${index}] = :S2, #attrName3[${index}] = :S3`,
    ExpressionAttributeNames : {
        "#attrName" : "pages_state",
        "#attrName2" : "pages_language",
        "#attrName3" : "app_type"
      }, ExpressionAttributeValues:{
        ":S":`Active_${impact}`,
        ":S2":`${lang}`,
        ":S3":`${type}`
    },
    };
    const request = docClient.update(params);
    const result = await request.promise();
         return result;
  };