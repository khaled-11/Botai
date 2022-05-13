const _ = require("lodash");
const AWS = require("aws-sdk");


var docClient = new AWS.DynamoDB.DocumentClient();
 module.exports = async (page_id, intent_name, value, index) => {
    const params = {
        TableName: 'wit_pages',
        Key: {
            "pageID" : page_id,
        },

        UpdateExpression : `SET #attrName.#Name = :attrValue, intents_list[${index}] = :attrValue2`,
    ExpressionAttributeNames : {
        "#attrName" : "intents",
        "#Name" : `${intent_name}`
      },
      ExpressionAttributeValues : {
        ":attrValue" :  [value, index],
        ":attrValue2" :  `${intent_name}`       
      } 
    };
    const request = docClient.update(params);
    const result = await request.promise();
    return result;
  };