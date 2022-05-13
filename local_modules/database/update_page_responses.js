const _ = require("lodash");
const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

module.exports = async (pageID, firstName, first_assosiated, firstType, firstResponse, secondName, second_assosiated, secondResponse, thirdName, third_assosiated, thirdResponse, impact) => {
  if (secondResponse){
    var params = {
      TableName: 'wit_pages',
      Key: {
          "pageID" : pageID,
      },
      UpdateExpression : `SET #impact = :impact, #attrName.#Name = :attrValue, #attrName.#Name2 = :attrValue2, #attrName.#Name3 = :attrValue3`,
      ExpressionAttributeNames : {
        "#impact" : "isImpacted",
        "#attrName" : "responses",
        "#Name" : `${first_assosiated}`,
        "#Name2" : `${second_assosiated}`,
        "#Name3" : `${third_assosiated}`
      },
      ExpressionAttributeValues : {
        ":attrValue" :  [firstResponse,firstName, "Default"],
        ":attrValue2" :  [secondResponse,secondName, "NLP"],
        ":attrValue3" :  [thirdResponse,thirdName, "Payload"],
        ":impact" : `${impact}`
      }     
    };
  } else {
    var params = {
      TableName: 'wit_pages',
      Key: {
          "pageID" : pageID,
      },
      UpdateExpression : `SET #attrName.#Name = :attrValue`,
      ExpressionAttributeNames : {
        "#attrName" : "responses",
        "#Name" : `${first_assosiated}`
      },
      ExpressionAttributeValues : {
        ":attrValue" :  [firstResponse,firstName, firstType]
      }     
    };
  }
  const request = docClient.update(params);
  const result = await request.promise();
  return result;
};