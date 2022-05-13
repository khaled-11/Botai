const _ = require("lodash");
const AWS = require("aws-sdk");


var docClient = new AWS.DynamoDB.DocumentClient();
 module.exports = async (page_id, intent_name, index) => {
    var i = 9999;
    const params = {
        TableName: 'wit_pages',
        Key: {
            "pageID" : page_id,
        },

        UpdateExpression : `REMOVE #attrName.#Name set intents_list[${index}] = :S`,
    ExpressionAttributeNames : {
        "#attrName" : "intents",
        "#Name" : `${intent_name}`
      }, ExpressionAttributeValues:{
        ":S":""
    },
    };
    const request = docClient.update(params);
    const result = await request.promise();
         return result;
  };