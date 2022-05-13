const _ = require("lodash");
const AWS = require("aws-sdk");

var ddb = new AWS.DynamoDB();

var docClient = new AWS.DynamoDB.DocumentClient();
 module.exports = async (pageID, utterance, index, intent, state) => {
   if (state === "creating"){
    var params = {
      TableName: 'wit_pages',
      Key: {
          "pageID" : pageID,
      },
      UpdateExpression : `SET #attrName.#Name = :attrValue1, utterances_list[${index}] = :attrValue2`,
      ExpressionAttributeNames : {
          "#attrName" : "utterances",
          "#Name" : `${utterance}`
      },
      ExpressionAttributeValues : {
        ":attrValue1" : [index, intent, `${state}`],
        ":attrValue2" : `${utterance}`
      } 
    };
  } else {
    var params = {
      TableName: 'wit_pages',
      Key: {
          "pageID" : pageID,
      },
      UpdateExpression : `SET #attrName.#Name = :attrValue1, utterances_list[${index}] = :attrValue2`,
      ExpressionAttributeNames : {
          "#attrName" : "utterances",
          "#Name" : `${utterance}`
      },
      ExpressionAttributeValues : {
        ":attrValue1" : [index, intent, `${state}`],
        ":attrValue2" : ``
      } 
    };
  }

    const request = docClient.update(params);
    result = await request.promise();
    return result;
  };