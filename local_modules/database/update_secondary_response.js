const _ = require("lodash");
const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

module.exports = async (pageID, firstName, first_assosiated, firstType, firstResponse) => {
    var params = {
      TableName: 'wit_pages',
      Key: {
          "pageID" : pageID,
      },
      UpdateExpression : `SET #attrName.#Name = :attrValue`,
      ExpressionAttributeNames : {
        "#attrName" : "secondary_responses",
        "#Name" : `${first_assosiated}`
      },
      ExpressionAttributeValues : {
        ":attrValue" :  [firstResponse,firstName, firstType]
      }     
    };
  const request = docClient.update(params);
  const result = await request.promise();
  return result;
};