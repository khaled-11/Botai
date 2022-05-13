const _ = require("lodash");
const AWS = require("aws-sdk");

var docClient = new AWS.DynamoDB.DocumentClient();
 module.exports = async (page_id, response) => {
    var i = 9999;
    const params = {
        TableName: 'wit_pages',
        Key: {
            "pageID" : page_id,
        },

        UpdateExpression : `REMOVE #attrName.#Name`,
    ExpressionAttributeNames : {
        "#attrName" : "responses",
        "#Name" : `${response}`
      }
    };
    const request = docClient.update(params);
    const result = await request.promise();
         return result;
  };